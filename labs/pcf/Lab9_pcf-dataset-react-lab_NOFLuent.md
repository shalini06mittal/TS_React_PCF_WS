# 🧪 Lab: Using PCF Dataset with React

> **Power Apps Component Framework (PCF)** lets you build rich UI controls using modern web frameworks. This lab walks you through building a fully functional React-based PCF control that reads and displays data from a **Dataset** (e.g., a Dataverse table or view).

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Initialize the PCF Project](#2-initialize-the-pcf-project)
3. [Understand the Project Structure](#3-understand-the-project-structure)
4. [Configure the Manifest for Dataset](#4-configure-the-manifest-for-dataset)
5. [Install React and Dependencies](#5-install-react-and-dependencies)
6. [Create the React Component](#6-create-the-react-component)
7. [Wire Up the PCF Index to React](#7-wire-up-the-pcf-index-to-react)
8. [Read Dataset Columns and Rows](#8-read-dataset-columns-and-rows)
9. [Handle Paging and Sorting](#9-handle-paging-and-sorting)
10. [Build and Test Locally](#10-build-and-test-locally)
11. [Deploy to Power Apps](#11-deploy-to-power-apps)
12. [Summary and Next Steps](#12-summary-and-next-steps)

---

## 1. Prerequisites

Before starting, make sure the following are installed and configured on your machine.

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 16.x or 18.x | JavaScript runtime |
| npm | 8+ | Package manager |
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
pac pcf init --namespace MyCompany --name DatasetReactControl --template dataset
```

### What this does

- `--namespace` — Your company or solution namespace (used in the control's unique name).
- `--name` — The control's display name.
- `--template dataset` — Generates a scaffold configured for **Dataset** binding (as opposed to `field`).

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
│   ├── index.ts          ← PCF lifecycle entry point
│   ├── ControlManifest.Input.xml  ← Control metadata & dataset config
│   └── generated/
│       └── ManifestTypes.d.ts    ← Auto-generated TypeScript types
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

> 💡 **Tip:** `control-type="virtual"` is required for React controls. It tells PCF to use a virtual DOM instead of directly managing a real DOM node.

---

## 5. Install React and Dependencies

PCF doesn't include React by default. Add it manually:

```bash
npm install react react-dom
npm install --save-dev @types/react @types/react-dom
```

Since PCF controls are bundled into Power Apps (which already ships React), you should **externalize** React in the build to avoid duplicate copies.

Open `package.json` and add the `pcfconfig` section if not present, then update `tsconfig.json`:

**`tsconfig.json`** — enable JSX support:

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

## 6. Create the React Component

Create a new file: `DatasetReactControl/DataTable.tsx`

This component will receive the dataset records as props and render them in an HTML table.

```tsx
// DatasetReactControl/DataTable.tsx

import * as React from "react";

export interface DataTableProps {
  columns: string[];
  rows: Record<string, string>[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  totalCount,
  currentPage,
  pageSize,
  onNextPage,
  onPrevPage,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", padding: "16px" }}>
      <p style={{ color: "#666", marginBottom: "8px" }}>
        Showing page <strong>{currentPage}</strong> of{" "}
        <strong>{totalPages}</strong> ({totalCount} total records)
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#0078d4", color: "#fff" }}>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  padding: "10px 14px",
                  textAlign: "left",
                  borderBottom: "2px solid #005a9e",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: "16px", textAlign: "center", color: "#999" }}
              >
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#ffffff",
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    style={{
                      padding: "8px 14px",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    {row[col] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <button
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          style={{ padding: "6px 14px", cursor: "pointer" }}
        >
          ← Previous
        </button>
        <button
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          style={{ padding: "6px 14px", cursor: "pointer" }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};
```

---

## 7. Wire Up the PCF Index to React

Now open `DatasetReactControl/index.ts` and update it to mount your React component into the PCF container.

```typescript
// DatasetReactControl/index.ts

import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DataTable } from "./DataTable";

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

    // Tell PCF we need the full dataset paging info
    context.mode.trackContainerResize(true);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._context = context;

    const dataset = context.parameters.sampleDataSet;

    // Extract column display names
    const columns = dataset.columns
      .filter((col) => !col.isHidden)
      .map((col) => col.displayName);

    // Extract row data as plain key-value records
    const rows = dataset.sortedRecordIds.map((recordId) => {
      const record = dataset.records[recordId];
      const row: Record<string, string> = {};
      dataset.columns
        .filter((col) => !col.isHidden)
        .forEach((col) => {
          row[col.displayName] =
            record.getFormattedValue(col.name) ?? "";
        });
      return row;
    });

    // Render React component
    ReactDOM.render(
      React.createElement(DataTable, {
        columns,
        rows,
        totalCount: dataset.paging.totalResultCount,
        currentPage: this._currentPage,
        pageSize: dataset.paging.pageSize,
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

## 8. Read Dataset Columns and Rows

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

  // Get the record's entity reference (for navigation)
  const ref = record.getNamedReference();
  console.log(ref.id, ref.name, ref.entityType);
});
```

### Dataset Loading State

```typescript
if (dataset.loading) {
  // Show a spinner — data is still being fetched
}

if (dataset.error) {
  // dataset.errorMessage contains the error string
  console.error(dataset.errorMessage);
}
```

---

## 9. Handle Paging and Sorting

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

### Sorting

```typescript
// Get current sort status per column
dataset.columns.forEach(col => {
  // col.sortDirection: 0 = none, 1 = ascending, 2 = descending
  console.log(`${col.name}: sort = ${col.sortDirection}`);
});

// Apply a sort on a column (triggers reload)
dataset.sorting.push({
  name: "createdon",
  sortDirection: 1  // 1 = Ascending, 2 = Descending
});

dataset.refresh();  // Apply the new sort
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

---

## 10. Build and Test Locally

### Build the Control

```bash
npm run build
```

This compiles TypeScript and bundles everything into the `out/` folder.

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

Your React table should render the data immediately.

---

## 11. Deploy to Power Apps

### Authenticate with Your Environment

```bash
pac auth create --url https://yourorg.crm.dynamics.com
```

### Push the Control

```bash
pac pcf push --publisher-prefix mco
```

> 💡 Replace `mco` with your publisher prefix. This bundles and deploys the control directly into your Dataverse environment for testing.

### Add to a Model-Driven App

1. Open **make.powerapps.com**.
2. Navigate to your Model-Driven App and open a form editor.
3. Select a **subgrid** (dataset view) component on the form.
4. In the component properties, click **+ Component**.
5. Find **DatasetReactControl** and add it.
6. Map the dataset binding to the appropriate table/view.
7. Save and publish the form.

---

## 12. Summary and Next Steps

### What You Built

In this lab, you:

- Initialized a **PCF Dataset control** using the Power Platform CLI.
- Configured the **manifest** for virtual/React rendering.
- Built a **React component** (`DataTable.tsx`) with pagination.
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

### Next Steps

- **Add column sorting** — let users click column headers to sort.
- **Add search/filter UI** — expose filtering controls in the React component.
- **Navigate to records** — use `record.getNamedReference()` to open forms.
- **Add error boundaries** — wrap your React tree in an `ErrorBoundary`.
- **Deploy via Solution** — package your control into a Dataverse solution for production deployments.

---

> 📚 **References**
> - [PCF Dataset API Docs](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/reference/dataset)
> - [PCF React Controls](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/react-controls-platform-libraries)
> - [Power Platform CLI Reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/pcf)
