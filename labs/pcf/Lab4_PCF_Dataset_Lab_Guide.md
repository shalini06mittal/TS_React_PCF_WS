# Microsoft Power Apps Component Framework
## Dataset PCF Control — Step-by-Step Lab Guide
*Including Test Harness & Model-Driven App Deployment*

| Field | Details |
|---|---|
| **Lab Type** | Hands-On Lab |
| **Difficulty** | Intermediate |
| **Duration** | Approximately 3 – 4 hours |
| **Platform** | Power Apps / Dataverse |
| **Prerequisites** | Node.js 16+, VS Code, Power Apps CLI, Dataverse Environment |
| **Last Updated** | 2026 |

---

## Table of Contents

1. [Lab Overview](#1-lab-overview)
   - 1.1 [What is a PCF Dataset Control?](#11-what-is-a-pcf-dataset-control)
   - 1.2 [Learning Objectives](#12-learning-objectives)
   - 1.3 [Architecture Overview](#13-architecture-overview)
2. [Prerequisites & Environment Setup](#2-prerequisites--environment-setup)
   - 2.1 [Required Software](#21-required-software)
   - 2.2 [Step-by-Step: Install Power Apps CLI](#22-step-by-step-install-power-apps-cli)
   - 2.3 [Dataverse Environment](#23-dataverse-environment)
3. [Scaffolding the PCF Dataset Control](#3-scaffolding-the-pcf-dataset-control)
   - 3.1 [Create the Project Folder](#31-create-the-project-folder)
   - 3.2 [Initialise the PCF Project](#32-initialise-the-pcf-project)
   - 3.3 [Review the Project Structure](#33-review-the-project-structure)
4. [Understanding the Control Manifest](#4-understanding-the-control-manifest)
   - 4.1 [Full Manifest for a Dataset Control](#41-full-manifest-for-a-dataset-control)
   - 4.2 [Key Manifest Elements](#42-key-manifest-elements)
5. [Implementing the Control in TypeScript](#5-implementing-the-control-in-typescript)
   - 5.1 [Define Input and Output Interfaces](#51-define-input-and-output-interfaces)
   - 5.2 [Class Skeleton and Constructor](#52-class-skeleton-and-constructor)
   - 5.3 [The init() Method](#53-the-init-method)
   - 5.4 [The updateView() Method](#54-the-updateview-method)
   - 5.5 [Paging Helper](#55-paging-helper)
   - 5.6 [The destroy() Method](#56-the-destroy-method)
   - 5.7 [CSS Styles](#57-css-styles)
   - 5.8 [Build the Control](#58-build-the-control)
6. [Testing with the PCF Test Harness](#6-testing-with-the-pcf-test-harness)
   - 6.1 [Start the Test Harness](#61-start-the-test-harness)
   - 6.2 [Test Harness Layout](#62-test-harness-layout)
   - 6.3 [Configuring Mock Dataset Data](#63-configuring-mock-dataset-data)
   - 6.4 [Testing Paging Behaviour](#64-testing-paging-behaviour)
   - 6.5 [Testing Loading State](#65-testing-loading-state)
   - 6.6 [Checking Console Errors](#66-checking-console-errors)
7. [Packaging and Deploying to Dataverse](#7-packaging-and-deploying-to-dataverse)
   - 7.1 [Create a Solution Project](#71-create-a-solution-project)
   - 7.2 [Add the PCF Control to the Solution](#72-add-the-pcf-control-to-the-solution)
   - 7.3 [Build and Package the Solution](#73-build-and-package-the-solution)
   - 7.4 [Authenticate and Deploy with pac CLI](#74-authenticate-and-deploy-with-pac-cli)
   - 7.5 [Alternative: Manual Import via Browser](#75-alternative-manual-import-via-browser)
8. [Configuring the Control in a Model-Driven App](#8-configuring-the-control-in-a-model-driven-app)
   - 8.1 [Add the Control to a Subgrid](#81-add-the-control-to-a-subgrid)
   - 8.2 [Configure Control Properties](#82-configure-control-properties)
   - 8.3 [Set the Control as Default (Optional)](#83-set-the-control-as-default-optional)
   - 8.4 [Testing the Control in the Live App](#84-testing-the-control-in-the-live-app)
   - 8.5 [Debugging in the Live App](#85-debugging-in-the-live-app)
9. [Advanced Topics & Best Practices](#9-advanced-topics--best-practices)
   - 9.1 [Handling Dataset Events](#91-handling-dataset-events)
   - 9.2 [Sorting](#92-sorting)
   - 9.3 [Filtering](#93-filtering)
   - 9.4 [Best Practices](#94-best-practices)
   - 9.5 [Updating an Existing Control](#95-updating-an-existing-control)
10. [Troubleshooting Reference](#10-troubleshooting-reference)
11. [Quick Reference — CLI Commands](#11-quick-reference--cli-commands)
12. [Lab Summary & Next Steps](#12-lab-summary--next-steps)
    - 12.1 [Suggested Next Steps](#121-suggested-next-steps)
    - 12.2 [Useful Resources](#122-useful-resources)

---

## 1 Lab Overview

This lab guide walks you through the complete lifecycle of a Power Apps Component Framework (PCF) control of type **Dataset**. You will scaffold the project, implement the control in TypeScript, test it locally using the built-in Test Harness, deploy it to a Dataverse environment, and finally add it to a Model-Driven App (MDA).

### 1.1 What is a PCF Dataset Control?

The Power Apps Component Framework (PCF) allows developers to build reusable UI components that can be embedded in Canvas Apps, Model-Driven Apps, and Power Pages. There are two primary control types:

| Control Type | Description |
|---|---|
| **Field Control** | Bound to a single column/field. Used to replace or enhance a standard form input. |
| **Dataset Control** | Bound to an entire dataset (table/view). Used to display and interact with multiple records — e.g., replacing a standard subgrid or gallery. |

This lab focuses exclusively on the **Dataset** type, which provides access to a paging-enabled dataset via the `ComponentFramework.PropertyTypes.DataSet` API.

### 1.2 Learning Objectives

- Set up the development environment with required tools
- Scaffold a PCF dataset control project using the Power Apps CLI
- Understand the manifest structure (`ControlManifest.Input.xml`) for dataset controls
- Implement the required `IPCFControl` interface methods in TypeScript
- Load, page, and render dataset records in the component
- Test the component locally using the PCF Test Harness
- Package and deploy the solution to a Dataverse environment
- Configure and test the control in a Model-Driven App

### 1.3 Architecture Overview

The following diagram illustrates where the PCF control fits in the overall Power Platform architecture:

| Your TypeScript Code | PCF Framework APIs | Dataverse / Model-Driven App |
|---|---|---|
| `index.ts`, CSS, assets | `DataSet`, `EntityRecord`, `Paging`, `Filtering` | Subgrid, View, Custom Page |

---

## 2 Prerequisites & Environment Setup

Before starting this lab, ensure that the following tools are installed and configured on your development machine.

### 2.1 Required Software

| Tool | Details |
|---|---|
| **Node.js** | Version 16.x or later. Download from nodejs.org. Verify: `node --version` |
| **npm** | Bundled with Node.js. Verify: `npm --version` |
| **Power Apps CLI** | `pac` CLI. Install via: `npm install -g pac` OR MSI installer from Microsoft |
| **Visual Studio Code** | Recommended IDE. Install the ESLint and Prettier extensions. |
| **TypeScript** | `npm install -g typescript` (version 4.x or later) |
| **Git** | Optional, but recommended for version control. |

### 2.2 Step-by-Step: Install Power Apps CLI

1. Open a terminal (PowerShell or Command Prompt on Windows, Terminal on macOS/Linux).

2. Run the following command to install the `pac` CLI globally:

```bash
npm install -g pac
```

3. Verify the installation:

```bash
pac --version
```

4. You should see output similar to:

```
Microsoft PowerApps CLI
Version: 1.xx.x
```

### 2.3 Dataverse Environment

- You need a Dataverse environment with **System Customizer** or **System Administrator** permissions.
- You can use a Microsoft 365 Developer tenant or an existing Power Platform environment.
- Navigate to [make.powerapps.com](https://make.powerapps.com) to confirm access to your environment.

> **⚠️ NOTE:** Custom controls with the dataset type can only be used in **Model-Driven Apps** and **Power Pages**. They are not supported in Canvas Apps.

---

## 3 Scaffolding the PCF Dataset Control

The Power Apps CLI provides a `pac pcf init` command to scaffold a new PCF project. In this section you will create a new directory and initialise the project with the dataset template.

### 3.1 Create the Project Folder

1. Open a terminal and navigate to the directory where you want to store your project. For example:

```bash
# Windows
mkdir C:\PCFLab\DatasetControl
cd C:\PCFLab\DatasetControl

# macOS / Linux
mkdir -p ~/PCFLab/DatasetControl
cd ~/PCFLab/DatasetControl
```

### 3.2 Initialise the PCF Project

2. Run the `pac pcf init` command with the following parameters:

```bash
pac pcf init \
  --namespace Contoso \
  --name DatasetGrid \
  --template dataset \
  --run-npm-install
```

**Parameter breakdown:**

| Parameter | Description |
|---|---|
| `--namespace` | A unique namespace (e.g., your company name). Used to avoid naming conflicts. |
| `--name` | The name of the control. No spaces allowed. PascalCase recommended. |
| `--template` | Must be `dataset` for a Dataset PCF control. Use `field` for field controls. |
| `--run-npm-install` | Automatically runs `npm install` after scaffolding. |

### 3.3 Review the Project Structure

After scaffolding, your directory will contain:

```
DatasetControl/
├── DatasetGrid/
│   ├── ControlManifest.Input.xml   ← Control definition & properties
│   ├── index.ts                    ← Main TypeScript implementation
│   ├── css/
│   │   └── DatasetGrid.css         ← Component styles
│   └── img/                        ← Optional image assets
├── node_modules/
├── package.json
├── tsconfig.json
└── .pcfignore
```

> **💡 TIP:** Open the project folder in VS Code using `code .` from inside the `DatasetControl` directory. This gives you IntelliSense for the PCF type definitions.

---

## 4 Understanding the Control Manifest

The `ControlManifest.Input.xml` file is the heart of your PCF control. It declares the control's identity, input properties, and data-set bindings. Dataset controls have a different manifest structure compared to field controls.

### 4.1 Full Manifest for a Dataset Control

Replace the contents of `ControlManifest.Input.xml` with the following:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest>
  <control namespace="Contoso"
           constructor="DatasetGrid"
           version="1.0.0"
           display-name-key="DatasetGrid_Display_Key"
           description-key="DatasetGrid_Desc_Key"
           control-type="virtual"
           api-version="1.3.3">

    <!-- ═══ Data-set property ═══ -->
    <data-set name="sampleDataSet"
              display-name-key="DataSet_Display_Key"
              cds-data-set-options="displayCommandBar:true;
                                    displayViewSelector:true;
                                    displayQuickFind:true">
    </data-set>

    <!-- ═══ Optional input properties ═══ -->
    <property name="PageSize"
              display-name-key="PageSize_Display_Key"
              description-key="PageSize_Desc_Key"
              of-type="Whole.None"
              usage="input"
              default-value="10"/>

    <!-- ═══ Resources ═══ -->
    <resources>
      <code path="index.ts" order="1"/>
      <css path="css/DatasetGrid.css" order="1"/>
    </resources>

    <!-- ═══ Platforms ═══ -->
    <platforms>
      <platform key="PC" allowed="true"/>
    </platforms>

  </control>
</manifest>
```

### 4.2 Key Manifest Elements

| Element | Description |
|---|---|
| `control-type` | Use `virtual` for React/virtual DOM controls. Use `standard` for direct DOM manipulation. |
| `data-set` | Declares that this control accepts a dataset binding. The `name` attribute is used in `index.ts` to reference the data. |
| `cds-data-set-options` | Controls visibility of the command bar, view selector, and quick-find search box when embedded in MDA. |
| `property` | Optional scalar input. Here we expose a `PageSize` property configurable by the maker. |
| `resources` | Declares the TypeScript entry point and any CSS files. |

> **⚠️ IMPORTANT:** The `data-set` element's `name` attribute (e.g., `sampleDataSet`) must exactly match the key you use when calling `context.parameters.sampleDataSet` in `index.ts`.

---

## 5 Implementing the Control in TypeScript

The `index.ts` file must implement the `ComponentFramework.StandardControl<IInputs, IOutputs>` interface. For dataset controls, the key method is `updateView`, which is called each time the underlying data changes.

### 5.1 Define Input and Output Interfaces

At the top of `index.ts`, define the `IInputs` and `IOutputs` interfaces to match your manifest:

```typescript
export interface IInputs {
  sampleDataSet: ComponentFramework.PropertyTypes.DataSet;
  PageSize: ComponentFramework.PropertyTypes.WholeNumberProperty;
}

export interface IOutputs {
  // Dataset controls rarely output values, but the interface is required
}
```

### 5.2 Class Skeleton and Constructor

```typescript
import { IInputs, IOutputs } from './generated/ManifestTypes';

export class DatasetGrid
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _notifyOutputChanged: () => void;

  constructor() {
    // No initialisation needed here
  }

  // ── Lifecycle methods follow ──
}
```

### 5.3 The init() Method

`init()` is called once when the control is first attached to the DOM. Here you set up your container element and store references.

```typescript
public init(
  context: ComponentFramework.Context<IInputs>,
  notifyOutputChanged: () => void,
  state: ComponentFramework.Dictionary,
  container: HTMLDivElement
): void {
  this._context = context;
  this._notifyOutputChanged = notifyOutputChanged;
  this._container = container;

  // Set the page size from the manifest property (default 10)
  const pageSize = context.parameters.PageSize.raw ?? 10;
  context.parameters.sampleDataSet.paging.setPageSize(pageSize);

  this._container.classList.add('dataset-grid-container');
}
```

### 5.4 The updateView() Method

`updateView()` is called every time the dataset changes — on initial load, after paging, filtering, or sorting. This is where you render your UI.

```typescript
public updateView(context: ComponentFramework.Context<IInputs>): void {
  this._context = context;
  const dataset = context.parameters.sampleDataSet;

  // Clear previous render
  this._container.innerHTML = '';

  if (dataset.loading) {
    this._container.innerHTML = '<p class="loading">Loading records...</p>';
    return;
  }

  // ── Build the table ──────────────────────────────────────────
  const table = document.createElement('table');
  table.classList.add('pcf-table');

  // Header row
  const thead = document.createElement('thead');
  const hRow = document.createElement('tr');
  dataset.columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col.displayName;
    hRow.appendChild(th);
  });
  thead.appendChild(hRow);
  table.appendChild(thead);

  // Data rows
  const tbody = document.createElement('tbody');
  dataset.sortedRecordIds.forEach(recordId => {
    const record = dataset.records[recordId];
    const row = document.createElement('tr');
    dataset.columns.forEach(col => {
      const td = document.createElement('td');
      td.textContent = record.getFormattedValue(col.name);
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  this._container.appendChild(table);

  // ── Paging controls ─────────────────────────────────────────
  this._renderPagingControls(dataset);
}
```

### 5.5 Paging Helper

```typescript
private _renderPagingControls(
  dataset: ComponentFramework.PropertyTypes.DataSet
): void {
  const paging = dataset.paging;
  const div = document.createElement('div');
  div.classList.add('paging-controls');

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '< Previous';
  prevBtn.disabled = !paging.hasPreviousPage;
  prevBtn.onclick = () => paging.loadPreviousPage();

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next >';
  nextBtn.disabled = !paging.hasNextPage;
  nextBtn.onclick = () => paging.loadNextPage();

  const info = document.createElement('span');
  info.textContent = `Page ${paging.pageNumber} | ${dataset.sortedRecordIds.length} records`;

  div.appendChild(prevBtn);
  div.appendChild(info);
  div.appendChild(nextBtn);
  this._container.appendChild(div);
}
```

### 5.6 The destroy() Method

`destroy()` is called when the control is removed from the page. Clean up event listeners and DOM references here.

```typescript
public destroy(): void {
  // Clean up DOM
  this._container.innerHTML = '';
}
```

### 5.7 CSS Styles

Add the following to `css/DatasetGrid.css`:

```css
.dataset-grid-container {
  font-family: 'Segoe UI', Tahoma, sans-serif;
  font-size: 14px;
  overflow: auto;
  width: 100%;
}

.pcf-table {
  border-collapse: collapse;
  width: 100%;
}

.pcf-table th,
.pcf-table td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.pcf-table th {
  background-color: #1F538D;
  color: #fff;
  font-weight: 600;
}

.pcf-table tr:nth-child(even) { background-color: #f7f7f7; }
.pcf-table tr:hover            { background-color: #d6e4f0; }

.paging-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.paging-controls button {
  padding: 6px 14px;
  background: #2E75B6;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.paging-controls button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.loading { color: #666; font-style: italic; }
```

### 5.8 Build the Control

Compile the TypeScript and verify there are no errors:

```bash
npm run build
```

A successful build will output compiled files into the `out/` directory. If you encounter TypeScript errors, check that your `IInputs` interface matches the `ControlManifest.Input.xml` exactly.

> **💡 TIP:** Use `npm run watch` during development. This will automatically recompile whenever you save a TypeScript or CSS file, and will auto-refresh the Test Harness browser page.

---

## 6 Testing with the PCF Test Harness

The Test Harness is a local web server that simulates the Power Apps runtime. It allows you to test your PCF control without deploying it to Dataverse. For dataset controls, the harness provides a sample dataset that you can configure.

### 6.1 Start the Test Harness

1. Open a terminal in the project root directory.

2. Run the following command:

```bash
npm start
```

3. The command will compile the project and open a browser tab at:

```
http://localhost:8181
```

4. You should see the PCF Test Harness interface with your control rendered on the right and a configuration panel on the left.

### 6.2 Test Harness Layout

| Panel | Description |
|---|---|
| **Left Panel** | Context inputs — configure your dataset columns, rows, paging settings, and scalar properties (e.g., `PageSize`). |
| **Right Panel** | Live control preview — your PCF control renders here and updates in real time as you change inputs. |
| **Data section** | Under `sampleDataSet`, you can define columns, add rows with mock data, and simulate loading states. |

### 6.3 Configuring Mock Dataset Data

1. In the left panel, locate the `sampleDataSet` section.

2. Click **Add column** and add the following columns:

| Column Name | Data Type | Sample Values |
|---|---|---|
| `name` | `SingleLine.Text` | Alice, Bob, Carol, Dave |
| `age` | `Whole.None` | 28, 34, 22, 45 |
| `city` | `SingleLine.Text` | London, Paris, Berlin, Madrid |
| `joinDate` | `DateAndTime.DateOnly` | 2022-01-15, 2021-06-20, 2023-03-01, 2020-11-30 |

3. Click **Add record** and populate at least 4 rows using the sample values above.

4. Click **Apply** to push the changes to the live control preview.

### 6.4 Testing Paging Behaviour

1. In the left panel, locate `sampleDataSet` > **Paging**.
2. Set `pageSize` to `2` (or set the `PageSize` property to `2`).
3. Click **Apply**. The control should now show only 2 records.
4. Click the **Next >** button in your rendered control. Verify that the second page loads.
5. Verify that the **Previous** button becomes active on page 2 and the **Next** button is disabled on the last page.

### 6.5 Testing Loading State

1. In the left panel, set `sampleDataSet` > **Loading** to `true`.
2. Click **Apply**.
3. Verify that the control displays your "Loading records..." message instead of the table.
4. Set **Loading** back to `false` and **Apply** to restore normal rendering.

### 6.6 Checking Console Errors

1. Open browser Developer Tools (`F12`).
2. Navigate to the **Console** tab.
3. Ensure there are no JavaScript errors. Common issues at this stage include:
   - `dataset.columns is undefined` — check that `updateView` handles the loading state
   - `Cannot read property of undefined` — ensure `dataset.records[recordId]` exists before accessing

> **⚠️ NOTE:** The Test Harness does not perfectly replicate every behaviour of a live Dataverse environment. Some features (e.g., column filtering, linked entity lookups) may behave differently. Always perform a final end-to-end test in a real MDA after deploying.

---

## 7 Packaging and Deploying to Dataverse

Once testing in the Test Harness is complete, the control must be packaged into a Power Platform solution and deployed to your Dataverse environment.

### 7.1 Create a Solution Project

1. Open a new terminal in the parent directory (one level above your PCF project):

```bash
# Navigate one level up from your PCF project
cd ..

# Create a solution folder
mkdir DatasetControlSolution
cd DatasetControlSolution
```

2. Initialise a new solution project:

```bash
pac solution init \
  --publisher-name ContosoPublisher \
  --publisher-prefix contoso
```

### 7.2 Add the PCF Control to the Solution

3. Run the following command from inside the `DatasetControlSolution` directory:

```bash
pac solution add-reference \
  --path ../DatasetControl
```

This links the PCF project to the solution. The solution manifest will now reference your control.

### 7.3 Build and Package the Solution

4. Build the solution:

```bash
dotnet build
```

> **⚠️ NOTE:** You need the .NET SDK (v6 or later) installed to run `dotnet build`. Download from [dotnet.microsoft.com](https://dotnet.microsoft.com).

5. After a successful build, the packaged solution ZIP will be in:

```
DatasetControlSolution/
└── bin/
    └── Debug/
        └── DatasetControlSolution.zip
```

### 7.4 Authenticate and Deploy with pac CLI

6. Create an authentication profile for your environment:

```bash
pac auth create --url https://YourOrg.crm.dynamics.com
```

7. A browser window will open for Azure AD authentication. Sign in with your Dataverse credentials.

8. After authentication, push the solution to your environment:

```bash
pac solution import \
  --path bin/Debug/DatasetControlSolution.zip \
  --publish-changes
```

9. Verify the deployment:

```bash
pac solution list
```

You should see `DatasetControlSolution` listed with a **Published** status. Alternatively, navigate to [make.powerapps.com](https://make.powerapps.com) > **Solutions** to confirm the solution appears in your environment.

### 7.5 Alternative: Manual Import via Browser

If you prefer not to use the CLI for import, you can manually upload the ZIP file:

1. Navigate to [make.powerapps.com](https://make.powerapps.com) and select your environment.
2. Go to **Solutions** in the left navigation.
3. Click **Import solution** and upload the `DatasetControlSolution.zip` file.
4. Follow the wizard and click **Publish all customizations** when complete.

---

## 8 Configuring the Control in a Model-Driven App

After deploying the solution, the PCF dataset control is available to be added to any subgrid in a Model-Driven App. This section walks through configuring the control and testing it end-to-end in a live MDA.

### 8.1 Add the Control to a Subgrid

In this walkthrough, we will add the `DatasetGrid` control to the **Contacts** subgrid on the Account form.

1. Navigate to [make.powerapps.com](https://make.powerapps.com) and select your environment.
2. In the left navigation, click **Apps**, then open (or create) a Model-Driven App.
3. In the app designer, click the pencil icon next to the main site map or directly **Edit** the app.
4. Navigate to the **Account** form. You can do this via: **Tables** > **Account** > **Forms** > **Main Form (Account)**.
5. In the form designer, click on the **Contacts** subgrid to select it.
6. In the right-hand properties panel, scroll down and click **+ Component**.
7. In the **Add component** dialog, select **Get more components** (if your control is not yet listed) or find `DatasetGrid` under the **Custom** tab.
8. Select **DatasetGrid** and click **Add**.

### 8.2 Configure Control Properties

After adding the control, a properties panel will appear. Configure the following:

| Property | Value |
|---|---|
| **Show component on** | Select **Web** (and optionally Phone, Tablet if responsive behaviour has been implemented). |
| **sampleDataSet** | This is automatically bound to the subgrid's data source (Contacts related to the Account). |
| **PageSize** | Enter your desired page size, e.g., `10`. This overrides the manifest default. |

9. Click **Done** in the properties panel.
10. Click **Save**, then **Publish** in the top toolbar of the form designer.

### 8.3 Set the Control as Default (Optional)

To replace the built-in subgrid entirely with your custom control:

1. Select the **Contacts** subgrid in the form designer.
2. In the right panel, expand the **Components** section.
3. Click the three-dot menu next to **DatasetGrid** and select **Set as default**.
4. **Save** and **Publish** the form again.

### 8.4 Testing the Control in the Live App

1. Return to the **Apps** list and click **Play** (or **Run**) to open the Model-Driven App in a new browser tab.
2. Open any **Account** record that has related **Contact** records.
3. Scroll to the **Contacts** subgrid. You should see your custom `DatasetGrid` control rendering the contact records as an HTML table with your pagination controls.

**Validate the following scenarios:**

| Test Scenario | Expected Result |
|---|---|
| Control renders without errors | Table displays with column headers and rows |
| Column headers match Dataverse schema | Displays display names, not logical names |
| Paging: Next and Previous buttons work | Records change correctly; buttons disable at boundaries |
| Loading indicator shows on initial load | "Loading records..." message visible briefly |
| Styles are applied correctly | Blue header row, hover highlight, readable fonts |
| New Contact added refreshes the grid | `updateView` is called; new record appears on the correct page |
| Account with 0 Contacts | Table renders with headers but no rows; no errors in console |

### 8.5 Debugging in the Live App

If the control does not render correctly in the live app:

- Open browser Developer Tools (`F12`) on the MDA page and check the **Console** for errors.
- Confirm the solution is **Published** (not just Saved) by checking [make.powerapps.com](https://make.powerapps.com) > **Solutions**.
- Hard-refresh the page (`Ctrl + Shift + R`) to clear the browser cache.
- Verify the correct environment is selected in the `pac` CLI and in the browser.
- Check that the control's `code` property in the manifest points to the correct entry point (`index.ts`).

> **💡 TIP:** Use `pac pcf push` to push incremental changes directly to your environment during iterative development, without needing to repackage the full solution each time.

---

## 9 Advanced Topics & Best Practices

### 9.1 Handling Dataset Events

For interactive controls, you can call `context.parameters.sampleDataSet.refresh()` to reload data, or `openDatasetItem()` to open a record form:

```typescript
// Open a record when a row is clicked
row.addEventListener('click', () => {
  const entityRef = record.getNamedReference();
  this._context.parameters.sampleDataSet.openDatasetItem(entityRef);
});

// Refresh the dataset programmatically
this._context.parameters.sampleDataSet.refresh();
```

### 9.2 Sorting

```typescript
// Apply sorting on a column header click
th.addEventListener('click', () => {
  dataset.sorting.length = 0;
  dataset.sorting.push({ name: col.name, sortDirection: 0 }); // 0 = ASC, 1 = DESC
  dataset.refresh();
});
```

### 9.3 Filtering

```typescript
// Apply a simple filter (records where 'city' equals 'London')
const filterExpression: ComponentFramework.PropertyHelper.DataSetApi.FilterExpression = {
  conditions: [{
    attributeName: 'city',
    conditionOperator: 0, // 0 = Equal
    value: 'London'
  }],
  filterOperator: 0 // 0 = AND
};

dataset.filtering.setFilter(filterExpression);
dataset.refresh();
```

### 9.4 Best Practices

- Always guard against `dataset.loading` being `true` before accessing records or columns.
- Use `getFormattedValue()` instead of `getValue()` for display — it applies locale-appropriate formatting.
- Dispose of DOM event listeners in `destroy()` to avoid memory leaks.
- Keep the manifest `version` (`1.0.0`) incremented on each deployment to force cache invalidation.
- Use the `virtual` `control-type` and React if you need a component-based rendering architecture.
- Test on both desktop and mobile views if enabling `phone`/`tablet` platforms in the manifest.

### 9.5 Updating an Existing Control

To update a deployed control with changes:

1. Increment the `version` attribute in `ControlManifest.Input.xml` (e.g., `1.0.0` to `1.0.1`).
2. Run `npm run build` to rebuild.
3. Either use `pac pcf push` for a quick update, or repackage and reimport the solution.
4. **Publish all customizations** in your environment after import.

---

## 10 Troubleshooting Reference

| Issue | Likely Cause | Resolution |
|---|---|---|
| `npm run build` fails | TypeScript type errors | Run `npm install` again; ensure `@types/powerapps-component-framework` is installed |
| Test Harness shows blank | CSS or JS error on load | Check browser console (F12) for errors; verify `index.ts` exports the class correctly |
| Control not visible in MDA form designer | Solution not published | Publish all customizations in the environment after import |
| Dataset columns are empty | Columns not added in manifest / harness | Ensure `data-set` element in manifest has no column restrictions, and columns are set up in the harness |
| `pac pcf push` fails | Auth profile missing or expired | Run `pac auth create` and re-authenticate |
| Control appears but shows no data in MDA | Subgrid entity not populated | Verify the Account has related Contact records; check subgrid configuration in form designer |
| TypeScript: Property does not exist on IInputs | Manifest and `IInputs` mismatch | Regenerate types: `pac pcf init` regenerates `ManifestTypes.d.ts`; or manually update `IInputs` |

---

## 11 Quick Reference — CLI Commands

```bash
# ── Scaffold a new PCF dataset project ──────────────────────────────────
pac pcf init --namespace <ns> --name <name> --template dataset --run-npm-install

# ── Build the control ───────────────────────────────────────────────────
npm run build

# ── Start the Test Harness ──────────────────────────────────────────────
npm start

# ── Watch mode (auto-rebuild) ───────────────────────────────────────────
npm run watch

# ── Push changes directly to environment (dev iteration) ────────────────
pac pcf push --publisher-prefix contoso

# ── Initialise a solution project ───────────────────────────────────────
pac solution init --publisher-name ContosoPublisher --publisher-prefix contoso

# ── Add PCF reference to solution ───────────────────────────────────────
pac solution add-reference --path ../DatasetControl

# ── Build and package solution ──────────────────────────────────────────
dotnet build

# ── Authenticate ────────────────────────────────────────────────────────
pac auth create --url https://YourOrg.crm.dynamics.com

# ── Import solution to environment ──────────────────────────────────────
pac solution import --path bin/Debug/DatasetControlSolution.zip --publish-changes
```

---

## 12 Lab Summary & Next Steps

🎉 **Congratulations on completing the Power Apps PCF Dataset Control lab!** You have learned how to:

- Set up the development environment with Node.js, npm, and the Power Apps CLI
- Scaffold a PCF dataset control project with the `pac pcf init` command
- Configure the `ControlManifest.Input.xml` with dataset and property bindings
- Implement the full `IPCFControl` interface (`init`, `updateView`, `destroy`) in TypeScript
- Build a functional table with paging, loading state handling, and CSS styling
- Test the control locally in the PCF Test Harness
- Package the control into a Power Platform solution
- Deploy the solution to Dataverse using the `pac` CLI
- Add and configure the control on a Model-Driven App form
- Perform end-to-end testing in the live Model-Driven App

### 12.1 Suggested Next Steps

- Enhance the control with **sorting** — click column headers to toggle ASC/DESC sort order
- Add a **search/filter toolbar** to the control using `dataset.filtering` APIs
- Migrate the control to use **React** (`virtual` control-type) for more complex UI
- Implement **multi-record selection** using `dataset.setSelectedRecordIds()`
- Add the control to a **Custom Page** for use in both Canvas Apps and Model-Driven Apps
- Explore the **PCF Gallery** at [pcf.gallery](https://pcf.gallery) for inspiration and community controls

### 12.2 Useful Resources

| Resource | URL |
|---|---|
| **PCF Documentation** | [docs.microsoft.com/.../component-framework/overview](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/overview) |
| **PCF API Reference** | [docs.microsoft.com/.../component-framework/reference](https://docs.microsoft.com/en-us/powerapps/developer/component-framework/reference) |
| **PCF Gallery** | [pcf.gallery](https://pcf.gallery) |
| **Power Platform CLI** | [docs.microsoft.com/.../cli/introduction](https://docs.microsoft.com/en-us/power-platform/developer/cli/introduction) |
| **Sample PCF Controls** | [github.com/microsoft/PowerApps-Samples/...](https://github.com/microsoft/PowerApps-Samples/tree/master/component-framework) |

---

> ✅ **WELL DONE!** You have successfully built, tested, and deployed a production-ready PCF Dataset Control for Power Apps. The skills you have practised here form the foundation for building advanced, enterprise-grade UI components on the Power Platform.
