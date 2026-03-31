# 🧪 Lab: Using PCF Dataset with React & Fluent UI v9

> **Power Apps Component Framework (PCF)** lets you build rich UI controls using modern web frameworks. This lab walks you through building a fully functional React-based PCF control that reads and displays data from a **Dataset** (e.g., a Dataverse table or view), styled with **Fluent UI v9** — Microsoft's latest design system.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Initialize the PCF Project](#2-initialize-the-pcf-project)
3. [Understand the Project Structure](#3-understand-the-project-structure)
4. [Configure the Manifest for Dataset](#4-configure-the-manifest-for-dataset)
5. [Install React and Fluent UI v9](#5-install-react-and-fluent-ui-v9)
6. [Set Up the FluentProvider Wrapper](#6-set-up-the-fluentprovider-wrapper)
7. [Create the DataTable Component with Fluent DataGrid](#7-create-the-datatable-component-with-fluent-datagrid)
8. [Wire Up the PCF Index to React](#8-wire-up-the-pcf-index-to-react)
9. [Read Dataset Columns and Rows](#9-read-dataset-columns-and-rows)
10. [Handle Paging and Sorting](#10-handle-paging-and-sorting)
11. [Build and Test Locally](#11-build-and-test-locally)
12. [Deploy to Power Apps](#12-deploy-to-power-apps)
13. [Summary and Next Steps](#13-summary-and-next-steps)

---

## 1. Prerequisites

Before starting, make sure the following are installed and configured on your machine.

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x LTS | JavaScript runtime |
| npm | 9+ | Package manager |
| Power Platform CLI (`pac`) | Latest | Scaffold & deploy PCF |
| Visual Studio Code | Any | Code editor |
| Power Apps environment | Any Dataverse env | Test target |

### Install the Power Platform CLI

```bash
npm install -g @microsoft/powerplatform-cli
```

Verify it works:

```bash
pac --version
```

---

## 2. Initialize the PCF Project

Create a new folder for your project and initialize the PCF control using the **dataset** template.

```bash
mkdir my-dataset-control
cd my-dataset-control
pac pcf init --namespace MyCompany --name DatasetReactControl --template dataset --framework react
```

### What this does

- `--namespace` — Your company or solution namespace (used in the control's unique name).
- `--name` — The control's display name.
- `--template dataset` — Generates a scaffold configured for **Dataset** binding (as opposed to `field`).
- `--framework react` — Includes React scaffolding and sets `control-type="virtual"` automatically.

After initialization, install the npm dependencies:

```bash
npm install
```

---

## 3. Understand the Project Structure

Once initialized, your project will look like this:

```
my-dataset-control/
├── DatasetReactControl/
│   ├── index.ts                       ← PCF lifecycle entry point
│   ├── ControlManifest.Input.xml      ← Control metadata & dataset config
│   └── generated/
│       └── ManifestTypes.d.ts         ← Auto-generated TypeScript types
├── node_modules/
├── package.json
└── tsconfig.json
```

### Key Files

| File | Role |
|------|------|
| `index.ts` | Implements `IInputs`, `IOutputs`, and PCF lifecycle methods |
| `ControlManifest.Input.xml` | Declares datasets, properties, and resources |
| `ManifestTypes.d.ts` | TypeScript types generated from the manifest |

---

## 4. Configure the Manifest for Dataset

Open `DatasetReactControl/ControlManifest.Input.xml` and review the `<data-set>` node. This is what connects your control to a Dataverse view or table.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<manifest>
  <control namespace="MyCompany"
           constructor="DatasetReactControl"
           version="0.0.1"
           display-name-key="DatasetReactControl"
           description-key="DatasetReactControl_Desc"
           control-type="virtual">

    <!-- Dataset binding -->
    <data-set name="sampleDataSet" display-name-key="DataSet_Display_Key">
      <!-- Optional: declare expected columns -->
    </data-set>

    <resources>
      <code path="index.ts" order="1" />
    </resources>

  </control>
</manifest>
```

> 💡 **Tip:** `control-type="virtual"` is **required** for React controls. It tells PCF to use a virtual DOM instead of directly managing a real DOM node, and is also a prerequisite for Fluent UI v9's Griffel renderer to work correctly.

---

## 5. Install React and Fluent UI v9

Fluent UI v9 (`@fluentui/react-components`) is the current recommended library for PCF controls targeting Power Apps. It uses the **Griffel** CSS-in-JS engine and ships with the Fluent 2 design language.

### Install packages

```bash
# React (if not already present)
npm install react react-dom
npm install --save-dev @types/react @types/react-dom

# Fluent UI v9 core
npm install @fluentui/react-components

# Fluent icons (v2 icon set — optional but recommended)
npm install @fluentui/react-icons
```

### Why v9 over v8?

| Feature | Fluent UI v8 | Fluent UI v9 |
|---------|-------------|-------------|
| Styling engine | `merge-styles` | Griffel (CSS-in-JS, atomic) |
| Tree-shaking | Partial | Full |
| Theming | Manual theme tokens | `FluentProvider` + design tokens |
| Component API | Prop-heavy | Slot-based, composable |
| React version | 16+ | 17+ |
| PCF recommendation | Legacy | ✅ Current |

### Update `tsconfig.json` for JSX

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "lib": ["ES6", "DOM"],
    "jsx": "react",
    "strict": false,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "outDir": "out/controls/DatasetReactControl"
  },
  "include": ["DatasetReactControl/**/*"]
}
```

---

## 6. Set Up the FluentProvider Wrapper

Fluent UI v9 requires all components to be wrapped in a `<FluentProvider>` that injects the design token theme. In a PCF control, the best place to do this is a top-level wrapper component.

Create `DatasetReactControl/App.tsx`:

```tsx
// DatasetReactControl/App.tsx

import * as React from "react";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Theme,
} from "@fluentui/react-components";
import { DataTable, DataTableProps } from "./DataTable";

interface AppProps extends DataTableProps {
  isDarkMode?: boolean;
}

export const App: React.FC<AppProps> = ({ isDarkMode = false, ...tableProps }) => {
  const theme: Theme = isDarkMode ? webDarkTheme : webLightTheme;

  return (
    <FluentProvider theme={theme}>
      <DataTable {...tableProps} />
    </FluentProvider>
  );
};
```

### Available Built-in Themes

| Theme import | Use case |
|---|---|
| `webLightTheme` | Default light mode |
| `webDarkTheme` | Dark mode |
| `teamsLightTheme` | Microsoft Teams light |
| `teamsDarkTheme` | Microsoft Teams dark |
| `teamsHighContrastTheme` | Accessibility / high contrast |

> 💡 For production PCF controls, detect the host app's theme from `context.fluentDesignLanguage` (available in PCF API 1.3+) and pass the matching Fluent theme automatically.

---

## 7. Create the DataTable Component with Fluent DataGrid

Create `DatasetReactControl/DataTable.tsx`. This component uses Fluent UI v9's `DataGrid`, `Button`, `Spinner`, `MessageBar`, and `makeStyles` with design tokens to render dataset records in a fully accessible, styled table.

```tsx
// DatasetReactControl/DataTable.tsx

import * as React from "react";
import {
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridBody,
  DataGridRow,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  Button,
  Spinner,
  MessageBar,
  MessageBarBody,
  Text,
  makeStyles,
  tokens,
  Toolbar,
  ToolbarGroup,
  Badge,
} from "@fluentui/react-components";
import {
  ChevronLeftRegular,
  ChevronRightRegular,
} from "@fluentui/react-icons";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataTableProps {
  columns: string[];
  rows: Record<string, string>[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  errorMessage?: string;
  onNextPage: () => void;
  onPrevPage: () => void;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// makeStyles uses Griffel to generate atomic, scoped CSS at runtime.
// tokens.* references Fluent design tokens (spacing, color, typography).

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalL,
  },
  toolbar: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "0",
    paddingRight: "0",
  },
  paginationInfo: {
    color: tokens.colorNeutralForeground3,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    padding: tokens.spacingVerticalXXL,
  },
  emptyState: {
    textAlign: "center",
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  totalCount,
  currentPage,
  pageSize,
  isLoading,
  errorMessage,
  onNextPage,
  onPrevPage,
}) => {
  const styles = useStyles();
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Build Fluent DataGrid column definitions dynamically from dataset columns.
  // createTableColumn defines both the header and cell render functions.
  const columnDefs: TableColumnDefinition<Record<string, string>>[] = columns.map(
    (col) =>
      createTableColumn<Record<string, string>>({
        columnId: col,
        renderHeaderCell: () => <strong>{col}</strong>,
        renderCell: (row) => row[col] ?? "—",
      })
  );

  // ── Error State ────────────────────────────────────────────────────────────
  if (errorMessage) {
    return (
      <div className={styles.root}>
        <MessageBar intent="error">
          <MessageBarBody>{errorMessage}</MessageBarBody>
        </MessageBar>
      </div>
    );
  }

  // ── Loading State ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.root}>
        <div className={styles.loadingContainer}>
          <Spinner label="Loading records..." />
        </div>
      </div>
    );
  }

  // ── Empty State ────────────────────────────────────────────────────────────
  if (rows.length === 0) {
    return (
      <div className={styles.root}>
        <div className={styles.emptyState}>
          <Text size={400}>No records found.</Text>
        </div>
      </div>
    );
  }

  // ── Data State ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.root}>

      {/* Toolbar: record count badge + pagination buttons */}
      <Toolbar className={styles.toolbar}>
        <ToolbarGroup>
          <Text className={styles.paginationInfo}>
            Page{" "}
            <Badge appearance="filled" color="brand">
              {currentPage}
            </Badge>{" "}
            of {totalPages} · {totalCount} total records
          </Text>
        </ToolbarGroup>
        <ToolbarGroup>
          <Button
            appearance="subtle"
            icon={<ChevronLeftRegular />}
            disabled={currentPage <= 1}
            onClick={onPrevPage}
          >
            Previous
          </Button>
          <Button
            appearance="subtle"
            icon={<ChevronRightRegular />}
            iconPosition="after"
            disabled={currentPage >= totalPages}
            onClick={onNextPage}
          >
            Next
          </Button>
        </ToolbarGroup>
      </Toolbar>

      {/* Fluent DataGrid — sortable, resizable, accessible out of the box */}
      <DataGrid
        items={rows}
        columns={columnDefs}
        sortable
        getRowId={(_row, idx) => String(idx)}
        focusMode="composite"
        resizableColumns
      >
        <DataGridHeader>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>

        <DataGridBody<Record<string, string>>>
          {({ item, rowId }) => (
            <DataGridRow<Record<string, string>> key={rowId}>
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </div>
  );
};
```

### Key Fluent v9 Components Used

| Component | Purpose |
|-----------|---------|
| `FluentProvider` | Injects the design token theme into the component tree |
| `DataGrid` | Accessible, sortable, resizable data table |
| `createTableColumn` | Defines column shape and cell/header renderers |
| `Spinner` | Loading indicator while dataset fetches |
| `MessageBar` | Error display with intent-based colouring |
| `Button` | Pagination controls with icon slots |
| `Toolbar` / `ToolbarGroup` | Layout container for the pagination bar |
| `Badge` | Highlights current page number |
| `makeStyles` | Griffel-based scoped styles |
| `tokens` | Fluent design tokens (spacing, colour, typography) |

---

## 8. Wire Up the PCF Index to React

Open `DatasetReactControl/index.ts` and update it to mount the `App` wrapper (which includes `FluentProvider`) into the PCF container.

```typescript
// DatasetReactControl/index.ts

import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

export class DatasetReactControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _currentPage: number = 1;

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._container = container;
    this._context = context;

    // Allow PCF to track container size changes (triggers updateView on resize)
    context.mode.trackContainerResize(true);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._context = context;

    const dataset = context.parameters.sampleDataSet;

    // ── Columns ──────────────────────────────────────────────────────────────
    const columns = dataset.columns
      .filter((col) => !col.isHidden)
      .map((col) => col.displayName);

    // ── Rows ─────────────────────────────────────────────────────────────────
    const rows = dataset.sortedRecordIds.map((recordId) => {
      const record = dataset.records[recordId];
      const row: Record<string, string> = {};
      dataset.columns
        .filter((col) => !col.isHidden)
        .forEach((col) => {
          row[col.displayName] = record.getFormattedValue(col.name) ?? "";
        });
      return row;
    });

    // ── Render ────────────────────────────────────────────────────────────────
    // App wraps everything in <FluentProvider> before rendering DataTable.
    ReactDOM.render(
      React.createElement(App, {
        columns,
        rows,
        totalCount: dataset.paging.totalResultCount,
        currentPage: this._currentPage,
        pageSize: dataset.paging.pageSize,
        isLoading: dataset.loading,
        errorMessage: dataset.error ? dataset.errorMessage : undefined,
        onNextPage: () => {
          dataset.paging.loadNextPage();
          this._currentPage++;
        },
        onPrevPage: () => {
          dataset.paging.loadPreviousPage();
          this._currentPage--;
        },
      }),
      this._container
    );
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    ReactDOM.unmountComponentAtNode(this._container);
  }
}
```

---

## 9. Read Dataset Columns and Rows

Here's a detailed breakdown of how the PCF Dataset API works:

### Accessing Columns

```typescript
const dataset = context.parameters.sampleDataSet;

// All columns (including hidden)
const allColumns = dataset.columns;

// Filter to visible columns only
const visibleColumns = dataset.columns.filter(col => !col.isHidden);

// Column properties
visibleColumns.forEach(col => {
  console.log(col.name);          // Internal logical name (e.g., "fullname")
  console.log(col.displayName);   // User-friendly label (e.g., "Full Name")
  console.log(col.dataType);      // "SingleLine.Text", "Whole.None", "DateAndTime.DateOnly", etc.
  console.log(col.alias);         // Alias used in FetchXML
});
```

### Accessing Records

```typescript
// Sorted record IDs (respects the view's sort order)
const recordIds = dataset.sortedRecordIds;

recordIds.forEach(id => {
  const record = dataset.records[id];

  // Get raw value (typed)
  const rawValue = record.getValue("fullname");

  // Get display-formatted string value (preferred for rendering)
  const displayValue = record.getFormattedValue("fullname");

  // Get the record's entity reference (for navigation or opening a form)
  const ref = record.getNamedReference();
  console.log(ref.id, ref.name, ref.entityType);
});
```

### Dataset Loading and Error State

```typescript
if (dataset.loading) {
  // Pass isLoading={true} to show the Fluent <Spinner>
}

if (dataset.error) {
  // Pass errorMessage={dataset.errorMessage} to show a Fluent <MessageBar>
  console.error(dataset.errorMessage);
}
```

---

## 10. Handle Paging and Sorting

### Paging

PCF datasets support server-side paging. Use the `paging` object:

```typescript
const paging = dataset.paging;

console.log(paging.pageSize);           // Records per page (default: 25)
console.log(paging.totalResultCount);   // Total records matching the filter
console.log(paging.hasNextPage);        // Boolean: more pages forward
console.log(paging.hasPreviousPage);    // Boolean: more pages back

// Navigate pages (triggers updateView after loading)
paging.loadNextPage();
paging.loadPreviousPage();

// Jump to a specific page (PCF v1.3+)
paging.loadExactPage(3);

// Change page size
paging.setPageSize(50);
```

### Sorting with Fluent DataGrid

The Fluent v9 `DataGrid` has built-in client-side sort UI. To integrate with PCF server-side sorting, forward the `onSortChange` event to the PCF dataset:

```typescript
// In DataTable.tsx — add to <DataGrid> props:
onSortChange={(_e, { sortColumn, sortDirection }) => {
  // Map Fluent sort direction to PCF sort direction values
  // "ascending" → 1,  "descending" → 2
  const pcfDirection = sortDirection === "ascending" ? 1 : 2;

  dataset.sorting = [{ name: sortColumn as string, sortDirection: pcfDirection }];
  dataset.refresh();  // Triggers PCF to re-fetch with the new sort
}}
```

### Filtering

```typescript
// Apply a simple filter (replaces existing filter)
dataset.filtering.setFilter({
  conditions: [
    {
      attributeName: "statecode",
      conditionOperator: 0,  // 0 = Equal
      value: "0",            // "0" = Active
    }
  ],
  filterOperator: 0  // 0 = AND, 1 = OR
});

dataset.refresh();
```

> 💡 Pair filtering with a Fluent `SearchBox` component to build a live search bar that calls `dataset.filtering.setFilter()` on each keystroke.

---

## 11. Build and Test Locally

### Build the Control

```bash
npm run build
```

This compiles TypeScript, processes Griffel styles, and bundles everything into the `out/` folder.

### Start the Test Harness

PCF includes a local test harness that simulates a Power Apps environment:

```bash
npm start watch
```

This opens `http://localhost:8181` in your browser. You'll see the PCF test harness where you can:

- Load a **mock dataset** from a CSV file.
- Resize the control container.
- Simulate property changes.

### Load Mock Data

In the test harness, click **Data Inputs → sampleDataSet** and provide a CSV like:

```
fullname,emailaddress1,createdon
Alice Johnson,alice@contoso.com,2024-01-15
Bob Smith,bob@contoso.com,2024-02-20
Carol White,carol@contoso.com,2024-03-10
```

Your Fluent DataGrid should render with sortable column headers, the pagination toolbar, and proper Fluent UI styling.

### Troubleshooting Fluent Styles in the Harness

If Fluent UI styles look broken in the test harness, check:

- `control-type="virtual"` is set in the manifest (required for Griffel).
- No conflicting global CSS is overriding Fluent's injected styles.
- Griffel injects styles into `<head>` at runtime — no CSS file imports are needed.

---

## 12. Deploy to Power Apps

### Authenticate with Your Environment

```bash
pac auth create --url https://yourorg.crm.dynamics.com
```

### Push the Control

```bash
pac pcf push --publisher-prefix mco
```

> 💡 Replace `mco` with your publisher prefix. This bundles and deploys the control directly into your Dataverse environment for testing without requiring a full solution package.

### Add to a Model-Driven App

1. Open **make.powerapps.com**.
2. Navigate to your Model-Driven App and open a form editor.
3. Select a **subgrid** (dataset view) component on the form.
4. In the component properties, click **+ Component**.
5. Find **DatasetReactControl** and add it.
6. Map the dataset binding to the appropriate table/view.
7. Save and publish the form.

---

## 13. Summary and Next Steps

### What You Built

In this lab, you:

- Initialized a **PCF Dataset control** using the Power Platform CLI with React.
- Configured the **manifest** for `virtual` rendering.
- Installed and configured **Fluent UI v9** with `FluentProvider` and design tokens.
- Built a `DataTable.tsx` component using `DataGrid`, `Button`, `Spinner`, `MessageBar`, `Toolbar`, `Badge`, `makeStyles`, and `tokens`.
- Used the **PCF Dataset API** to read columns, rows, paging, sorting, and filtering.
- Tested locally using the **PCF test harness**.
- Deployed the control to **Power Apps**.

### PCF Dataset API Quick Reference

| API | Purpose |
|-----|---------|
| `dataset.columns` | Array of column metadata |
| `dataset.sortedRecordIds` | Ordered array of record IDs |
| `dataset.records[id]` | Access a record by ID |
| `record.getFormattedValue(col)` | Get display value of a field |
| `record.getValue(col)` | Get typed raw value |
| `dataset.paging.loadNextPage()` | Go to next page |
| `dataset.paging.loadPreviousPage()` | Go to previous page |
| `dataset.paging.totalResultCount` | Total matching records |
| `dataset.sorting` | Array of sort definitions |
| `dataset.filtering.setFilter()` | Apply filtering conditions |
| `dataset.refresh()` | Reload with new sort/filter |
| `dataset.loading` | `true` while data is loading |
| `dataset.error` / `dataset.errorMessage` | Error state |

### Fluent UI v9 Components Quick Reference

| Component | Import | Purpose |
|-----------|--------|---------|
| `FluentProvider` | `@fluentui/react-components` | Theme context wrapper |
| `DataGrid` | `@fluentui/react-components` | Sortable, accessible table |
| `createTableColumn` | `@fluentui/react-components` | Column definition factory |
| `Spinner` | `@fluentui/react-components` | Loading indicator |
| `MessageBar` | `@fluentui/react-components` | Error / info banners |
| `Button` | `@fluentui/react-components` | Actions and pagination |
| `Toolbar` / `ToolbarGroup` | `@fluentui/react-components` | Layout bar for controls |
| `Badge` | `@fluentui/react-components` | Highlight current page |
| `makeStyles` | `@fluentui/react-components` | Griffel scoped styles |
| `tokens` | `@fluentui/react-components` | Design token values |

### Next Steps

- **Server-side sorting** — wire `DataGrid`'s `onSortChange` to `dataset.sorting` + `dataset.refresh()`.
- **SearchBox filter** — add a Fluent `SearchBox` that calls `dataset.filtering.setFilter()` on input.
- **Record navigation** — use Fluent `Link` + `record.getNamedReference()` to open entity forms.
- **Dynamic theming** — read `context.fluentDesignLanguage` to auto-switch between light/dark Fluent themes.
- **Solution packaging** — bundle the control in a Dataverse solution `.zip` for production deployment.
- **Accessibility** — Fluent v9 DataGrid is ARIA-compliant out of the box; validate with a screen reader.

---

> 📚 **References**
> - [PCF Dataset API Docs](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/reference/dataset)
> - [PCF React Controls & Platform Libraries](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/react-controls-platform-libraries)
> - [Fluent UI v9 Documentation](https://react.fluentui.dev)
> - [Fluent UI v9 DataGrid](https://react.fluentui.dev/?path=/docs/components-datagrid--docs)
> - [Fluent UI v9 Theming](https://react.fluentui.dev/?path=/docs/concepts-developer-theming--docs)
> - [Power Platform CLI Reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/pcf)
