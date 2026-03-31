**LAB GUIDE**

**Power Apps Component Framework**

**Building a PCF Dataset Component**

**with React + Fluent UI v8**

  ---------------------------- ------------------------------------------
  **Template Type**            Dataset

  **React Framework**          React 17+

  **Fluent UI Version**        v8 (Dynamics 365 compatible)

  **Estimated Duration**       3 to 4 Hours

  **Difficulty Level**         Intermediate
  ---------------------------- ------------------------------------------

*Microsoft Power Platform \| Dynamics 365 \| Model-Driven Apps*

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Architecture Overview](#architecture-overview)
- [Step 1: Prerequisites and Environment Setup](#step-1-prerequisites-and-environment-setup)
- [Git                        Any                    Source control](#git------------------------any--------------------source-control)
- [Step 2: Scaffold the PCF Dataset Project](#step-2-scaffold-the-pcf-dataset-project)
- [Step 3: Configure the Control Manifest](#step-3-configure-the-control-manifest)
- [cds-data-set-options   displayCommandBar   Shows D365 toolbar above the dataset](#cds-data-set-options---displaycommandbar---shows-d365-toolbar-above-the-dataset)
- [Step 4: Implement index.ts --- PCF Lifecycle](#step-4-implement-indexts-----pcf-lifecycle)
- [4.1 Lifecycle Overview](#41-lifecycle-overview)
- [destroy()        Control removed               Cleanup timers, subscriptions, DOM refs](#destroy--------control-removed---------------cleanup-timers-subscriptions-dom-refs)
- [Step 5: Reading Data from Dataverse](#step-5-reading-data-from-dataverse)
- [dataset.filtering                 Filtering            Apply OData filter expressions](#datasetfiltering-----------------filtering------------apply-odata-filter-expressions)
- [Step 6: Communicating Back to Power Apps](#step-6-communicating-back-to-power-apps)
- [Scalar Output                       Set a field on getOutputs() return, then call notifyOutputChanged()](#scalar-output-----------------------set-a-field-on-getoutputs-return-then-call-notifyoutputchanged)
- [Step 7: Fluent UI v8 Setup and Theming](#step-7-fluent-ui-v8-setup-and-theming)
- [IconButton             @fluentui/react   Open record, delete, or custom row actions](#iconbutton-------------fluentuireact---open-record-delete-or-custom-row-actions)
- [Step 8: Build the React Component](#step-8-build-the-react-component)
- [Step 9: Styles with mergeStyleSets](#step-9-styles-with-mergestylesets)
- [Step 10: Local Testing with the Test Harness](#step-10-local-testing-with-the-test-harness)
- [Step 11: Build and Deploy to Dataverse](#step-11-build-and-deploy-to-dataverse)
- [Step 12: Troubleshooting Reference](#step-12-troubleshooting-reference)
- [Sort not working server-side                dataset.refresh() not called             After setting dataset.sorting, always call dataset.refresh()](#sort-not-working-server-side----------------datasetrefresh-not-called-------------after-setting-datasetsorting-always-call-datasetrefresh)
- [Appendix: Complete File Reference](#appendix-complete-file-reference)
- [File Summary](#file-summary)
- [styles.ts                   Scoped CSS-in-JS styles using mergeStyleSets                  Step 9](#stylests-------------------scoped-css-in-js-styles-using-mergestylesets------------------step-9)
- [Data Flow Summary](#data-flow-summary)
- [React to Power Apps (scalar output)   this.notifyOutputChanged() then getOutputs() returns value](#react-to-power-apps-scalar-output---thisnotifyoutputchanged-then-getoutputs-returns-value)
- [Useful Commands Reference](#useful-commands-reference)
- [pac auth create --url https://org.crm.dynamics.com   Authenticate CLI to a Dataverse org](#pac-auth-create---url-httpsorgcrmdynamicscom---authenticate-cli-to-a-dataverse-org)

## Overview

This lab guide walks you through building a production-grade Power Apps Component Framework (PCF) control using the Dataset template. The component renders a sortable, searchable, paginated data grid using React and Fluent UI v8, bound live to a Dataverse table. By the end of this lab you will understand how to:

-   Scaffold a PCF project with the dataset template and React framework

-   Configure the ControlManifest to declare dataset columns and input properties

-   Implement all four PCF lifecycle methods in index.ts

-   Read rows, column metadata, and formatted values from a Dataverse dataset

-   Pass user interactions (selection, sorting, paging) back from React to Power Apps

-   Build a full Fluent UI v8 DetailsList component with command bar and search

-   Apply scoped styles using mergeStyleSets without breaking PCF sandboxing

-   Deploy to Dataverse and add the control to a Model-Driven App

+------------------------------------------------------------------------------------+
| **Important: Fluent UI Version**                                                   |
|                                                                                    |
| Power Apps and Dynamics 365 support only Fluent UI React v8 (@fluentui/react).     |
|                                                                                    |
| Do NOT install Fluent UI v9 (@fluentui/react-components) in PCF projects.          |
|                                                                                    |
| Fluent UI v9 uses a rendering engine incompatible with PCF\'s virtual DOM sandbox. |
+------------------------------------------------------------------------------------+

## Architecture Overview

A PCF Dataset control sits between Dataverse and a React component. The PCF framework mediates all data access through a strongly-typed context object, which your index.ts consumes and transforms into React props.

  --------------------- ------- --------------------- ------- --------------------------- ------- ----------------- ------- --------------------
  **Dataverse Table**   **→**   **PCF Context API**   **→**   **index.ts updateView()**   **→**   **React Props**   **→**   **Fluent UI Grid**

  --------------------- ------- --------------------- ------- --------------------------- ------- ----------------- ------- --------------------

## Step 1: Prerequisites and Environment Setup

+-------+----------------------------------------------------------------+
| **1** | **Prerequisites & Environment Setup**                          |
|       |                                                                |
|       | *Estimated time: 15 minutes*                                   |
+-------+----------------------------------------------------------------+

**1.1 Required Tools**

Before creating a PCF component, ensure all the following tools are installed on your local machine.

  --------------------------------------------------------------------------------------
  **Tool**                   **Version Required**   **Purpose**
  -------------------------- ---------------------- ------------------------------------
  Node.js (LTS)              16.x or higher         JavaScript runtime for build tools

  npm                        8.x or higher          Package manager

  Power Platform CLI (pac)   Latest                 Scaffold and deploy PCF projects

  TypeScript                 4.x                    Type-safe component code

  VS Code                    Latest (recommended)   IDE with PCF extension support

  Git                        Any                    Source control
  --------------------------------------------------------------------------------------

**1.2 Power Platform Requirements**

-   A Dataverse environment (trial or sandbox is fine)

-   System Customizer or System Administrator security role

-   Custom controls feature enabled in the environment settings

-   A solution with a publisher prefix (e.g., cnt for Contoso)

**1.3 Install Global Tools**

Open a terminal and run the following commands:

+-----------------------------------------------------------------------+
| **Terminal**                                                          |
+-----------------------------------------------------------------------+
| \# Install Power Platform CLI                                         |
|                                                                       |
| npm install -g microsoft-powerapps-cli                                |
|                                                                       |
| \# Install TypeScript compiler globally                               |
|                                                                       |
| npm install -g typescript                                             |
|                                                                       |
| \# Verify installations                                               |
|                                                                       |
| pac \--version                                                        |
|                                                                       |
| tsc \--version                                                        |
+-----------------------------------------------------------------------+

**1.4 Authenticate to Your Dataverse Org**

+-----------------------------------------------------------------------+
| **Terminal**                                                          |
+-----------------------------------------------------------------------+
| \# Create an authentication profile for your environment              |
|                                                                       |
| pac auth create \--url https://yourorg.crm.dynamics.com               |
|                                                                       |
| \# List all authentication profiles                                   |
|                                                                       |
| pac auth list                                                         |
|                                                                       |
| \# Select a profile if you have more than one                         |
|                                                                       |
| pac auth select \--index 1                                            |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **Tip: Environment URL**                                              |
|                                                                       |
| Find your environment URL in the Power Platform Admin Center.         |
|                                                                       |
| Navigate to Environments, select your environment, then copy the      |
|                                                                       |
| Environment URL shown in the details panel.                           |
+-----------------------------------------------------------------------+

## Step 2: Scaffold the PCF Dataset Project

+-------+----------------------------------------------------------------+
| **2** | **Scaffold the PCF Dataset Project**                           |
|       |                                                                |
|       | *Estimated time: 10 minutes*                                   |
+-------+----------------------------------------------------------------+

**2.1 Create the Project**

The pac pcf init command generates all the boilerplate files for a PCF component. Use the dataset template with the React framework flag.

+-----------------------------------------------------------------------+
| **Terminal**                                                          |
+-----------------------------------------------------------------------+
| \# Create a new directory for your component                          |
|                                                                       |
| mkdir AccountsGrid                                                    |
|                                                                       |
| cd AccountsGrid                                                       |
|                                                                       |
| \# Initialize a new PCF project                                       |
|                                                                       |
| pac pcf init \\                                                       |
|                                                                       |
| \--namespace Contoso \\                                               |
|                                                                       |
| \--name AccountsGrid \\                                               |
|                                                                       |
| \--template dataset \\                                                |
|                                                                       |
| \--framework react                                                    |
|                                                                       |
| \# Install all npm dependencies                                       |
|                                                                       |
| npm install                                                           |
+-----------------------------------------------------------------------+

**2.2 Install Fluent UI v8**

Install the Fluent UI React v8 package. Remember: do NOT install v9.

+-----------------------------------------------------------------------+
| **Terminal**                                                          |
+-----------------------------------------------------------------------+
| \# Install Fluent UI v8 - the only version supported in PCF / D365    |
|                                                                       |
| npm install \@fluentui/react@8                                        |
|                                                                       |
| \# Install React type definitions if not already present              |
|                                                                       |
| npm install \--save-dev \@types/react \@types/react-dom               |
+-----------------------------------------------------------------------+

**2.3 Generated File Structure**

After initialization, your project folder contains the following files:

+-----------------------------------------------------------------------+
| **Project Structure**                                                 |
+-----------------------------------------------------------------------+
| AccountsGrid/                                                         |
|                                                                       |
| AccountsGrid/                                                         |
|                                                                       |
| index.ts \<- PCF lifecycle class                                      |
|                                                                       |
| ControlManifest.Input.xml \<- component schema                        |
|                                                                       |
| generated/                                                            |
|                                                                       |
| ManifestTypes.d.ts \<- auto-generated TypeScript types                |
|                                                                       |
| package.json                                                          |
|                                                                       |
| tsconfig.json                                                         |
|                                                                       |
| node_modules/                                                         |
+-----------------------------------------------------------------------+

## Step 3: Configure the Control Manifest

+-------+----------------------------------------------------------------+
| **3** | **Configure ControlManifest.Input.xml**                        |
|       |                                                                |
|       | *Estimated time: 20 minutes*                                   |
+-------+----------------------------------------------------------------+

The ControlManifest.Input.xml file defines the schema of your PCF component. It declares the dataset binding, the columns (property-sets) that map to Dataverse fields, and any scalar input properties.

**3.1 Full Manifest XML**

+------------------------------------------------------------------------+
| **ControlManifest.Input.xml**                                          |
+------------------------------------------------------------------------+
| \<?xml version=\"1.0\" encoding=\"utf-8\"?\>                           |
|                                                                        |
| \<manifest\>                                                           |
|                                                                        |
| \<control                                                              |
|                                                                        |
| namespace=\"Contoso\"                                                  |
|                                                                        |
| constructor=\"AccountsGrid\"                                           |
|                                                                        |
| version=\"1.0.0\"                                                      |
|                                                                        |
| display-name-key=\"AccountsGrid\"                                      |
|                                                                        |
| description-key=\"AccountsGrid_Desc\"                                  |
|                                                                        |
| control-type=\"virtual\"\>                                             |
|                                                                        |
| \<!\-- Dataset node: binds component to a Dataverse table/view \--\>   |
|                                                                        |
| \<data-set                                                             |
|                                                                        |
| name=\"accountsDataSet\"                                               |
|                                                                        |
| display-name-key=\"Accounts Dataset\"                                  |
|                                                                        |
| cds-data-set-options=                                                  |
|                                                                        |
| \"displayCommandBar:true;                                              |
|                                                                        |
| displayViewSelector:true;                                              |
|                                                                        |
| displayQuickFind:true\"\>                                              |
|                                                                        |
| \<!\-- property-set maps a named slot to a Dataverse column type \--\> |
|                                                                        |
| \<property-set                                                         |
|                                                                        |
| name=\"accountname\"                                                   |
|                                                                        |
| display-name-key=\"Account Name\"                                      |
|                                                                        |
| of-type=\"SingleLine.Text\"                                            |
|                                                                        |
| usage=\"bound\"                                                        |
|                                                                        |
| required=\"true\"                                                      |
|                                                                        |
| /\>                                                                    |
|                                                                        |
| \<property-set                                                         |
|                                                                        |
| name=\"telephone1\"                                                    |
|                                                                        |
| display-name-key=\"Phone\"                                             |
|                                                                        |
| of-type=\"SingleLine.Phone\"                                           |
|                                                                        |
| usage=\"bound\"                                                        |
|                                                                        |
| required=\"false\"                                                     |
|                                                                        |
| /\>                                                                    |
|                                                                        |
| \<property-set                                                         |
|                                                                        |
| name=\"revenue\"                                                       |
|                                                                        |
| display-name-key=\"Annual Revenue\"                                    |
|                                                                        |
| of-type=\"Currency\"                                                   |
|                                                                        |
| usage=\"bound\"                                                        |
|                                                                        |
| required=\"false\"                                                     |
|                                                                        |
| /\>                                                                    |
|                                                                        |
| \</data-set\>                                                          |
|                                                                        |
| \<!\-- Scalar input property (not part of the dataset) \--\>           |
|                                                                        |
| \<property                                                             |
|                                                                        |
| name=\"pageSize\"                                                      |
|                                                                        |
| display-name-key=\"Page Size\"                                         |
|                                                                        |
| of-type=\"Whole.None\"                                                 |
|                                                                        |
| usage=\"input\"                                                        |
|                                                                        |
| required=\"false\"                                                     |
|                                                                        |
| /\>                                                                    |
|                                                                        |
| \<resources\>                                                          |
|                                                                        |
| \<code path=\"index.ts\" order=\"1\" /\>                               |
|                                                                        |
| \</resources\>                                                         |
|                                                                        |
| \</control\>                                                           |
|                                                                        |
| \</manifest\>                                                          |
+------------------------------------------------------------------------+

**3.2 Manifest Attributes Reference**

  ----------------------------------------------------------------------------------------
  **Attribute**          **Value**           **Description**
  ---------------------- ------------------- ---------------------------------------------
  control-type           virtual             Required for React; renders in virtual DOM

  data-set name          accountsDataSet     Referenced by name in index.ts context

  property-set of-type   SingleLine.Text     Maps to the Dataverse column data type

  usage                  bound               Value flows from Dataverse into the control

  cds-data-set-options   displayCommandBar   Shows D365 toolbar above the dataset
  ----------------------------------------------------------------------------------------

**3.3 Run Build to Regenerate Types**

After saving the manifest, run a build to regenerate the ManifestTypes.d.ts file that provides compile-time safety for your IInputs and IOutputs interfaces.

+-----------------------------------------------------------------------+
| **Terminal**                                                          |
+-----------------------------------------------------------------------+
| \# Regenerate TypeScript types from the updated manifest              |
|                                                                       |
| npm run build                                                         |
+-----------------------------------------------------------------------+

## Step 4: Implement index.ts --- PCF Lifecycle

+-------+----------------------------------------------------------------+
| **4** | **PCF Lifecycle Methods in index.ts**                          |
|       |                                                                |
|       | *Estimated time: 25 minutes*                                   |
+-------+----------------------------------------------------------------+

The index.ts file is the bridge between Power Apps and your React component. It implements four lifecycle methods defined by the ComponentFramework.ReactControl interface.

## 4.1 Lifecycle Overview

  -----------------------------------------------------------------------------------------------
  **Method**       **Called When**               **Responsibility**
  ---------------- ----------------------------- ------------------------------------------------
  init()           Once on load                  Store notifyOutputChanged, configure paging

  updateView()     Every input change            Read context, return React.createElement(\...)

  getOutputs()     After notifyOutputChanged()   Return output property values to Power Apps

  destroy()        Control removed               Cleanup timers, subscriptions, DOM refs
  -----------------------------------------------------------------------------------------------

**4.2 Full index.ts Implementation**

+-------------------------------------------------------------------------------+
| **AccountsGrid/index.ts**                                                     |
+-------------------------------------------------------------------------------+
| import { IInputs, IOutputs } from \"./generated/ManifestTypes\";              |
|                                                                               |
| import \* as React from \"react\";                                            |
|                                                                               |
| import { AccountsGridComponent } from \"./AccountsGridComponent\";            |
|                                                                               |
| export class AccountsGrid                                                     |
|                                                                               |
| implements ComponentFramework.ReactControl\<IInputs, IOutputs\> {             |
|                                                                               |
| private notifyOutputChanged: () =\> void;                                     |
|                                                                               |
| private selectedIds: string\[\] = \[\];                                       |
|                                                                               |
| /\*\*                                                                         |
|                                                                               |
| \* init() is called ONCE when the control first loads.                        |
|                                                                               |
| \* Store notifyOutputChanged so React callbacks can trigger it later.         |
|                                                                               |
| \* Also configure the dataset page size here.                                 |
|                                                                               |
| \*/                                                                           |
|                                                                               |
| init(                                                                         |
|                                                                               |
| context: ComponentFramework.Context\<IInputs\>,                               |
|                                                                               |
| notifyOutputChanged: () =\> void,                                             |
|                                                                               |
| state: ComponentFramework.Dictionary                                          |
|                                                                               |
| ): void {                                                                     |
|                                                                               |
| this.notifyOutputChanged = notifyOutputChanged;                               |
|                                                                               |
| // Request up to 500 records per page from Dataverse                          |
|                                                                               |
| context.parameters.accountsDataSet.paging.setPageSize(500);                   |
|                                                                               |
| }                                                                             |
|                                                                               |
| /\*\*                                                                         |
|                                                                               |
| \* updateView() is called every time ANY input changes.                       |
|                                                                               |
| \* This includes: dataset refresh, property update, container resize.         |
|                                                                               |
| \* Return a React element - PCF renders it into the virtual DOM.              |
|                                                                               |
| \*/                                                                           |
|                                                                               |
| updateView(                                                                   |
|                                                                               |
| context: ComponentFramework.Context\<IInputs\>                                |
|                                                                               |
| ): React.ReactElement {                                                       |
|                                                                               |
| const dataset = context.parameters.accountsDataSet;                           |
|                                                                               |
| const pageSize = context.parameters.pageSize?.raw ?? 25;                      |
|                                                                               |
| return React.createElement(AccountsGridComponent, {                           |
|                                                                               |
| dataset,                                                                      |
|                                                                               |
| pageSize,                                                                     |
|                                                                               |
| // Callback: row selection changed in React                                   |
|                                                                               |
| onSelectionChange: (ids: string\[\]) =\> {                                    |
|                                                                               |
| this.selectedIds = ids;                                                       |
|                                                                               |
| // Sync selection with PCF (updates D365 ribbon buttons)                      |
|                                                                               |
| dataset.setSelectedRecordIds(ids);                                            |
|                                                                               |
| },                                                                            |
|                                                                               |
| // Callback: user clicked Next Page                                           |
|                                                                               |
| onNextPage: () =\> {                                                          |
|                                                                               |
| dataset.paging.moveToNextPage();                                              |
|                                                                               |
| },                                                                            |
|                                                                               |
| // Callback: user clicked Previous Page                                       |
|                                                                               |
| onPrevPage: () =\> {                                                          |
|                                                                               |
| dataset.paging.moveToPreviousPage();                                          |
|                                                                               |
| },                                                                            |
|                                                                               |
| // Callback: user clicked a column header to sort                             |
|                                                                               |
| onSort: (columnName: string, ascending: boolean) =\> {                        |
|                                                                               |
| dataset.sorting = \[{ name: columnName, sortDirection: ascending ? 0 : 1 }\]; |
|                                                                               |
| dataset.refresh(); // triggers a new Dataverse OData fetch                    |
|                                                                               |
| },                                                                            |
|                                                                               |
| // Callback: user double-clicked a row to open the record                     |
|                                                                               |
| onOpenRecord: (id: string) =\> {                                              |
|                                                                               |
| dataset.openDatasetItem(dataset.records\[id\].getNamedReference());           |
|                                                                               |
| }                                                                             |
|                                                                               |
| });                                                                           |
|                                                                               |
| }                                                                             |
|                                                                               |
| /\*\*                                                                         |
|                                                                               |
| \* getOutputs() is called by Power Apps after notifyOutputChanged().          |
|                                                                               |
| \* For dataset controls, outputs are usually empty unless you declare         |
|                                                                               |
| \* scalar output properties in the manifest.                                  |
|                                                                               |
| \*/                                                                           |
|                                                                               |
| getOutputs(): IOutputs {                                                      |
|                                                                               |
| return {};                                                                    |
|                                                                               |
| }                                                                             |
|                                                                               |
| destroy(): void {                                                             |
|                                                                               |
| // Add cleanup logic here if needed                                           |
|                                                                               |
| }                                                                             |
|                                                                               |
| }                                                                             |
+-------------------------------------------------------------------------------+

## Step 5: Reading Data from Dataverse

+-------+----------------------------------------------------------------+
| **5** | **Dataverse to React: Reading Dataset Data**                   |
|       |                                                                |
|       | *Estimated time: 30 minutes*                                   |
+-------+----------------------------------------------------------------+

The context.parameters.accountsDataSet object is your window into Dataverse. It exposes sorted record IDs, typed values, column metadata, paging state, and filtering APIs.

**5.1 How the Dataset Object Works**

When updateView() fires, the dataset object contains the current page of records as returned by Dataverse. You access records by iterating over sortedRecordIds.

  ----------------------------------------------------------------------------------------------------
  **API**                           **Type / Returns**   **Purpose**
  --------------------------------- -------------------- ---------------------------------------------
  dataset.sortedRecordIds           string\[\]           Ordered list of record primary keys

  dataset.records\[id\]             DataSetRecord        Individual record object

  record.getValue(col)              raw typed value      Raw value: number, string, Date, EntityRef

  record.getFormattedString(col)    string               Localized display string from Dataverse

  dataset.columns                   Column\[\]           Metadata: name, displayName, dataType, etc.

  dataset.loading                   boolean              True while Dataverse fetch is in progress

  dataset.paging                    Paging               Paging state and navigation methods

  dataset.paging.totalResultCount   number               Total rows matching the current view

  dataset.paging.hasNextPage        boolean              Whether a next page of results exists

  dataset.sorting                   SortStatus\[\]       Current sort criteria (settable)

  dataset.refresh()                 void                 Re-fetches records from Dataverse

  dataset.filtering                 Filtering            Apply OData filter expressions
  ----------------------------------------------------------------------------------------------------

**5.2 Create useDatasetRows Hook**

Create a file called useDatasetRows.ts in the same folder as index.ts. This hook converts the raw PCF dataset object into a typed array your React component can use directly.

+-----------------------------------------------------------------------+
| **AccountsGrid/useDatasetRows.ts**                                    |
+-----------------------------------------------------------------------+
| import \* as React from \"react\";                                    |
|                                                                       |
| // Typed row shape extracted from the PCF DataSet                     |
|                                                                       |
| export interface AccountRow {                                         |
|                                                                       |
| id: string;                                                           |
|                                                                       |
| accountname: string;                                                  |
|                                                                       |
| telephone1: string;                                                   |
|                                                                       |
| revenue: number \| null;                                              |
|                                                                       |
| revenueFormatted: string;                                             |
|                                                                       |
| }                                                                     |
|                                                                       |
| /\*\*                                                                 |
|                                                                       |
| \* useDatasetRows converts a PCF DataSet into typed AccountRow\[\].   |
|                                                                       |
| \*                                                                    |
|                                                                       |
| \* Key PCF APIs used:                                                 |
|                                                                       |
| \* dataset.sortedRecordIds - ordered array of record keys             |
|                                                                       |
| \* dataset.records\[id\] - the DataSetRecord for that key             |
|                                                                       |
| \* record.getValue(col) - raw typed value (number, string, EntityRef) |
|                                                                       |
| \* record.getFormattedString() - Dataverse formatted display value    |
|                                                                       |
| \*/                                                                   |
|                                                                       |
| export function useDatasetRows(                                       |
|                                                                       |
| dataset: ComponentFramework.PropertyTypes.DataSet                     |
|                                                                       |
| ): AccountRow\[\] {                                                   |
|                                                                       |
| return React.useMemo(() =\> {                                         |
|                                                                       |
| if (!dataset \|\| dataset.loading) return \[\];                       |
|                                                                       |
| return dataset.sortedRecordIds.map((id) =\> {                         |
|                                                                       |
| const record = dataset.records\[id\];                                 |
|                                                                       |
| return {                                                              |
|                                                                       |
| id,                                                                   |
|                                                                       |
| accountname: record.getFormattedString(\"accountname\") ?? \"\",      |
|                                                                       |
| telephone1: record.getFormattedString(\"telephone1\") ?? \"\",        |
|                                                                       |
| revenue: record.getValue(\"revenue\") as number \| null,              |
|                                                                       |
| revenueFormatted: record.getFormattedString(\"revenue\") ?? \"---\",  |
|                                                                       |
| };                                                                    |
|                                                                       |
| });                                                                   |
|                                                                       |
| }, \[dataset, dataset?.sortedRecordIds, dataset?.loading\]);          |
|                                                                       |
| }                                                                     |
|                                                                       |
| // Column metadata hook - maps PCF Column\[\] to a simpler shape      |
|                                                                       |
| export interface ColumnMeta {                                         |
|                                                                       |
| name: string;                                                         |
|                                                                       |
| displayName: string;                                                  |
|                                                                       |
| dataType: string;                                                     |
|                                                                       |
| }                                                                     |
|                                                                       |
| export function useDatasetColumns(                                    |
|                                                                       |
| dataset: ComponentFramework.PropertyTypes.DataSet                     |
|                                                                       |
| ): ColumnMeta\[\] {                                                   |
|                                                                       |
| return React.useMemo(() =\> {                                         |
|                                                                       |
| if (!dataset?.columns) return \[\];                                   |
|                                                                       |
| return dataset.columns                                                |
|                                                                       |
| .filter(c =\> !c.isHidden)                                            |
|                                                                       |
| .map(c =\> ({                                                         |
|                                                                       |
| name: c.name,                                                         |
|                                                                       |
| displayName: c.displayName,                                           |
|                                                                       |
| dataType: c.dataType,                                                 |
|                                                                       |
| }));                                                                  |
|                                                                       |
| }, \[dataset?.columns\]);                                             |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

## Step 6: Communicating Back to Power Apps

+-------+----------------------------------------------------------------+
| **6** | **React to PCF: Notifying Power Apps of Changes**              |
|       |                                                                |
|       | *Estimated time: 25 minutes*                                   |
+-------+----------------------------------------------------------------+

When the user interacts with your React component (selecting rows, sorting columns, navigating pages), you must propagate those actions back through the PCF layer to Power Apps. There are three main mechanisms.

**6.1 Three Interaction Patterns**

  ---------------------------------------------------------------------------------------------------------
  **Pattern**                         **How It Works**
  ----------------------------------- ---------------------------------------------------------------------
  Row Selection                       Call dataset.setSelectedRecordIds() - keeps D365 ribbon in sync

  Pagination                          Call dataset.paging.moveToNextPage() or moveToPreviousPage()

  Sorting                             Set dataset.sorting array then call dataset.refresh()

  Open Record                         Call dataset.openDatasetItem(record.getNamedReference())

  Scalar Output                       Set a field on getOutputs() return, then call notifyOutputChanged()
  ---------------------------------------------------------------------------------------------------------

**6.2 When to Use notifyOutputChanged()**

Call notifyOutputChanged() only when you have scalar output properties declared in the manifest. For dataset controls, this is usually not needed. The dataset APIs (setSelectedRecordIds, refresh, paging) talk to Power Apps directly.

+-----------------------------------------------------------------------+
| **Rule of thumb**                                                     |
|                                                                       |
| Use dataset.setSelectedRecordIds() for row selection.                 |
|                                                                       |
| Use dataset.refresh() after changing dataset.sorting.                 |
|                                                                       |
| Use notifyOutputChanged() only for scalar output properties           |
|                                                                       |
| that you declared in the manifest with usage=\'output\'.              |
+-----------------------------------------------------------------------+

**6.3 Passing Callbacks Through Props**

The index.ts updateView() method creates the React element and passes PCF calls as callback props. Here is how to wire each interaction:

+-------------------------------------------------------------------------------+
| **index.ts --- updateView() callbacks**                                       |
+-------------------------------------------------------------------------------+
| // Inside updateView() in index.ts                                            |
|                                                                               |
| return React.createElement(AccountsGridComponent, {                           |
|                                                                               |
| dataset,                                                                      |
|                                                                               |
| pageSize,                                                                     |
|                                                                               |
| // 1. Row selection: sync PCF selection with React selection                  |
|                                                                               |
| onSelectionChange: (selectedIds: string\[\]) =\> {                            |
|                                                                               |
| dataset.setSelectedRecordIds(selectedIds);                                    |
|                                                                               |
| // setSelectedRecordIds updates D365 ribbon (Delete, Merge, etc.)             |
|                                                                               |
| },                                                                            |
|                                                                               |
| // 2. Paging: call PCF paging API directly                                    |
|                                                                               |
| onNextPage: () =\> dataset.paging.moveToNextPage(),                           |
|                                                                               |
| onPrevPage: () =\> dataset.paging.moveToPreviousPage(),                       |
|                                                                               |
| // 3. Sorting: update sorting criteria then re-fetch from Dataverse           |
|                                                                               |
| onSort: (columnName: string, ascending: boolean) =\> {                        |
|                                                                               |
| dataset.sorting = \[{ name: columnName, sortDirection: ascending ? 0 : 1 }\]; |
|                                                                               |
| dataset.refresh(); // fires a new OData GET with \$orderby                    |
|                                                                               |
| },                                                                            |
|                                                                               |
| // 4. Open record: navigate to the Dataverse record form                      |
|                                                                               |
| onOpenRecord: (id: string) =\> {                                              |
|                                                                               |
| dataset.openDatasetItem(dataset.records\[id\].getNamedReference());           |
|                                                                               |
| },                                                                            |
|                                                                               |
| });                                                                           |
+-------------------------------------------------------------------------------+

## Step 7: Fluent UI v8 Setup and Theming

+-------+----------------------------------------------------------------+
| **7** | **Fluent UI v8 Setup, ThemeProvider & Icons**                  |
|       |                                                                |
|       | *Estimated time: 20 minutes*                                   |
+-------+----------------------------------------------------------------+

**7.1 Initialize Icons**

Fluent UI icon fonts must be initialized once before any icon components render. Call initializeIcons() at module level, outside your component function.

+-----------------------------------------------------------------------+
| **AccountsGridComponent.tsx --- top of file**                         |
+-----------------------------------------------------------------------+
| import { initializeIcons } from \"@fluentui/react\";                  |
|                                                                       |
| // Call once at module load - not inside a component or useEffect     |
|                                                                       |
| initializeIcons();                                                    |
+-----------------------------------------------------------------------+

**7.2 Create a Dynamics 365 Theme**

Wrap your root component in ThemeProvider with a custom theme that matches the Dynamics 365 brand palette.

+-----------------------------------------------------------------------------------+
| **AccountsGridComponent.tsx**                                                     |
+-----------------------------------------------------------------------------------+
| import \* as React from \"react\";                                                |
|                                                                                   |
| import {                                                                          |
|                                                                                   |
| ThemeProvider,                                                                    |
|                                                                                   |
| PartialTheme,                                                                     |
|                                                                                   |
| createTheme,                                                                      |
|                                                                                   |
| initializeIcons,                                                                  |
|                                                                                   |
| } from \"@fluentui/react\";                                                       |
|                                                                                   |
| import { AccountsGridInner } from \"./AccountsGridInner\";                        |
|                                                                                   |
| initializeIcons();                                                                |
|                                                                                   |
| // Matches the Dynamics 365 / Power Apps brand palette                            |
|                                                                                   |
| const d365Theme: PartialTheme = createTheme({                                     |
|                                                                                   |
| palette: {                                                                        |
|                                                                                   |
| themePrimary: \"#0078d4\",                                                        |
|                                                                                   |
| themeDarkAlt: \"#106ebe\",                                                        |
|                                                                                   |
| themeDark: \"#005a9e\",                                                           |
|                                                                                   |
| themeDarker: \"#004578\",                                                         |
|                                                                                   |
| themeLight: \"#c7e0f4\",                                                          |
|                                                                                   |
| themeLighter: \"#deecf9\",                                                        |
|                                                                                   |
| themeLighterAlt: \"#eff6fc\",                                                     |
|                                                                                   |
| neutralPrimary: \"#323130\",                                                      |
|                                                                                   |
| neutralSecondary: \"#605e5c\",                                                    |
|                                                                                   |
| neutralTertiary: \"#a19f9d\",                                                     |
|                                                                                   |
| white: \"#ffffff\",                                                               |
|                                                                                   |
| },                                                                                |
|                                                                                   |
| });                                                                               |
|                                                                                   |
| export interface AccountsGridProps {                                              |
|                                                                                   |
| dataset: ComponentFramework.PropertyTypes.DataSet;                                |
|                                                                                   |
| pageSize: number;                                                                 |
|                                                                                   |
| onSelectionChange: (ids: string\[\]) =\> void;                                    |
|                                                                                   |
| onNextPage: () =\> void;                                                          |
|                                                                                   |
| onPrevPage: () =\> void;                                                          |
|                                                                                   |
| onSort: (col: string, asc: boolean) =\> void;                                     |
|                                                                                   |
| onOpenRecord: (id: string) =\> void;                                              |
|                                                                                   |
| }                                                                                 |
|                                                                                   |
| export const AccountsGridComponent: React.FC\<AccountsGridProps\> = (props) =\> { |
|                                                                                   |
| return (                                                                          |
|                                                                                   |
| // ThemeProvider injects CSS variables used by all Fluent v8 components           |
|                                                                                   |
| \<ThemeProvider theme={d365Theme}\>                                               |
|                                                                                   |
| \<AccountsGridInner {\...props} /\>                                               |
|                                                                                   |
| \</ThemeProvider\>                                                                |
|                                                                                   |
| );                                                                                |
|                                                                                   |
| };                                                                                |
+-----------------------------------------------------------------------------------+

**7.3 Key Fluent UI v8 Components for Dataset Controls**

  ------------------------------------------------------------------------------------------------
  **Component**          **Package**        **Use Case**
  ---------------------- ------------------ ------------------------------------------------------
  ShimmeredDetailsList   \@fluentui/react   Sortable, selectable data grid with loading skeleton

  CommandBar             \@fluentui/react   Toolbar: Refresh, Export, Filter actions

  SearchBox              \@fluentui/react   Client-side keyword filter input

  Selection              \@fluentui/react   Tracks checked rows; drives onSelectionChanged

  Stack                  \@fluentui/react   Flex layout container (horizontal / vertical)

  Text                   \@fluentui/react   Typography with theme-variant sizing

  Spinner                \@fluentui/react   Loading indicator while dataset.loading is true

  IconButton             \@fluentui/react   Open record, delete, or custom row actions
  ------------------------------------------------------------------------------------------------

## Step 8: Build the React Component

+-------+----------------------------------------------------------------+
| **8** | **AccountsGridInner --- Full React Component**                 |
|       |                                                                |
|       | *Estimated time: 45 minutes*                                   |
+-------+----------------------------------------------------------------+

Create AccountsGridInner.tsx. This component consumes the useDatasetRows and useDatasetColumns hooks, renders a ShimmeredDetailsList, and wires all user interactions back through the callback props from index.ts.

**8.1 Component File**

+--------------------------------------------------------------------------------------+
| **AccountsGrid/AccountsGridInner.tsx**                                               |
+--------------------------------------------------------------------------------------+
| import \* as React from \"react\";                                                   |
|                                                                                      |
| import {                                                                             |
|                                                                                      |
| ShimmeredDetailsList,                                                                |
|                                                                                      |
| DetailsListLayoutMode,                                                               |
|                                                                                      |
| SelectionMode,                                                                       |
|                                                                                      |
| Selection,                                                                           |
|                                                                                      |
| IColumn,                                                                             |
|                                                                                      |
| Stack,                                                                               |
|                                                                                      |
| SearchBox,                                                                           |
|                                                                                      |
| CommandBar,                                                                          |
|                                                                                      |
| ICommandBarItemProps,                                                                |
|                                                                                      |
| Text,                                                                                |
|                                                                                      |
| Spinner,                                                                             |
|                                                                                      |
| SpinnerSize,                                                                         |
|                                                                                      |
| } from \"@fluentui/react\";                                                          |
|                                                                                      |
| import { useDatasetRows, useDatasetColumns } from \"./useDatasetRows\";              |
|                                                                                      |
| import { AccountsGridProps } from \"./AccountsGridComponent\";                       |
|                                                                                      |
| import { gridStyles } from \"./styles\";                                             |
|                                                                                      |
| export const AccountsGridInner: React.FC\<AccountsGridProps\> = ({                   |
|                                                                                      |
| dataset, pageSize, onSelectionChange,                                                |
|                                                                                      |
| onNextPage, onPrevPage, onSort, onOpenRecord                                         |
|                                                                                      |
| }) =\> {                                                                             |
|                                                                                      |
| // ── Data ─────────────────────────────────────────────────────                     |
|                                                                                      |
| const rows = useDatasetRows(dataset);                                                |
|                                                                                      |
| const columns = useDatasetColumns(dataset);                                          |
|                                                                                      |
| // ── Local state ──────────────────────────────────────────────                     |
|                                                                                      |
| const \[filterText, setFilterText\] = React.useState(\"\");                          |
|                                                                                      |
| const \[sortCol, setSortCol\] = React.useState(\"\");                                |
|                                                                                      |
| const \[sortAsc, setSortAsc\] = React.useState(true);                                |
|                                                                                      |
| // ── Fluent Selection ─────────────────────────────────────────                     |
|                                                                                      |
| // Selection tracks checked rows and fires onSelectionChanged                        |
|                                                                                      |
| const selection = React.useMemo(() =\> new Selection({                               |
|                                                                                      |
| onSelectionChanged: () =\> {                                                         |
|                                                                                      |
| const selected = selection.getSelection() as typeof rows\[0\]\[\];                   |
|                                                                                      |
| onSelectionChange(selected.map(r =\> r.id));                                         |
|                                                                                      |
| }                                                                                    |
|                                                                                      |
| }), \[\]);                                                                           |
|                                                                                      |
| // ── Client-side filter ───────────────────────────────────────                     |
|                                                                                      |
| const filteredRows = React.useMemo(() =\>                                            |
|                                                                                      |
| rows.filter(r =\>                                                                    |
|                                                                                      |
| !filterText \|\|                                                                     |
|                                                                                      |
| r.accountname.toLowerCase().includes(filterText.toLowerCase())                       |
|                                                                                      |
| ), \[rows, filterText\]                                                              |
|                                                                                      |
| );                                                                                   |
|                                                                                      |
| // ── Column definitions ───────────────────────────────────────                     |
|                                                                                      |
| const detailColumns: IColumn\[\] = columns.map(col =\> ({                            |
|                                                                                      |
| key: col.name,                                                                       |
|                                                                                      |
| name: col.displayName,                                                               |
|                                                                                      |
| fieldName: col.name,                                                                 |
|                                                                                      |
| minWidth: 80,                                                                        |
|                                                                                      |
| maxWidth: col.name === \"accountname\" ? 300 : 160,                                  |
|                                                                                      |
| isSorted: sortCol === col.name,                                                      |
|                                                                                      |
| isSortedDescending: !sortAsc,                                                        |
|                                                                                      |
| // Column header click: update sort and re-fetch from Dataverse                      |
|                                                                                      |
| onColumnClick: (\_ev, column) =\> {                                                  |
|                                                                                      |
| const newAsc = sortCol === column.fieldName ? !sortAsc : true;                       |
|                                                                                      |
| setSortCol(column.fieldName!);                                                       |
|                                                                                      |
| setSortAsc(newAsc);                                                                  |
|                                                                                      |
| onSort(column.fieldName!, newAsc);                                                   |
|                                                                                      |
| },                                                                                   |
|                                                                                      |
| // Cell renderer: double-click opens the Dataverse record form                       |
|                                                                                      |
| onRender: (item) =\> (                                                               |
|                                                                                      |
| \<span                                                                               |
|                                                                                      |
| onDoubleClick={() =\> onOpenRecord(item.id)}                                         |
|                                                                                      |
| style={{                                                                             |
|                                                                                      |
| cursor: \"pointer\",                                                                 |
|                                                                                      |
| display: \"block\",                                                                  |
|                                                                                      |
| overflow: \"hidden\",                                                                |
|                                                                                      |
| textOverflow: \"ellipsis\",                                                          |
|                                                                                      |
| whiteSpace: \"nowrap\"                                                               |
|                                                                                      |
| }}                                                                                   |
|                                                                                      |
| \>                                                                                   |
|                                                                                      |
| {item\[col.name\]}                                                                   |
|                                                                                      |
| \</span\>                                                                            |
|                                                                                      |
| ),                                                                                   |
|                                                                                      |
| }));                                                                                 |
|                                                                                      |
| // ── Command bar items ────────────────────────────────────────                     |
|                                                                                      |
| const commandItems: ICommandBarItemProps\[\] = \[                                    |
|                                                                                      |
| {                                                                                    |
|                                                                                      |
| key: \"refresh\", text: \"Refresh\",                                                 |
|                                                                                      |
| iconProps: { iconName: \"Refresh\" },                                                |
|                                                                                      |
| onClick: () =\> dataset.refresh(),                                                   |
|                                                                                      |
| },                                                                                   |
|                                                                                      |
| {                                                                                    |
|                                                                                      |
| key: \"export\", text: \"Export CSV\",                                               |
|                                                                                      |
| iconProps: { iconName: \"Download\" },                                               |
|                                                                                      |
| onClick: () =\> exportToCsv(filteredRows),                                           |
|                                                                                      |
| },                                                                                   |
|                                                                                      |
| \];                                                                                  |
|                                                                                      |
| // ── Loading state ────────────────────────────────────────────                     |
|                                                                                      |
| if (dataset.loading) {                                                               |
|                                                                                      |
| return \<Spinner size={SpinnerSize.large} label=\"Loading records...\" /\>;          |
|                                                                                      |
| }                                                                                    |
|                                                                                      |
| // ── Render ───────────────────────────────────────────────────                     |
|                                                                                      |
| return (                                                                             |
|                                                                                      |
| \<Stack className={gridStyles.root}\>                                                |
|                                                                                      |
| {/\* Toolbar \*/}                                                                    |
|                                                                                      |
| \<Stack className={gridStyles.toolbar} horizontal                                    |
|                                                                                      |
| verticalAlign=\"center\" tokens={{ childrenGap: 8 }}\>                               |
|                                                                                      |
| \<CommandBar                                                                         |
|                                                                                      |
| items={commandItems}                                                                 |
|                                                                                      |
| styles={{ root: { padding: 0 } }}                                                    |
|                                                                                      |
| /\>                                                                                  |
|                                                                                      |
| \<SearchBox                                                                          |
|                                                                                      |
| placeholder=\"Filter by name...\"                                                    |
|                                                                                      |
| value={filterText}                                                                   |
|                                                                                      |
| onChange={(\_e, v) =\> setFilterText(v ?? \"\")}                                     |
|                                                                                      |
| styles={{ root: { width: 220 } }}                                                    |
|                                                                                      |
| /\>                                                                                  |
|                                                                                      |
| \</Stack\>                                                                           |
|                                                                                      |
| {/\* Data grid \*/}                                                                  |
|                                                                                      |
| \<Stack.Item grow className={gridStyles.listArea}\>                                  |
|                                                                                      |
| {filteredRows.length === 0 ? (                                                       |
|                                                                                      |
| \<Stack className={gridStyles.empty}                                                 |
|                                                                                      |
| horizontalAlign=\"center\" verticalAlign=\"center\"\>                                |
|                                                                                      |
| \<Text variant=\"large\"\>No records found\</Text\>                                  |
|                                                                                      |
| \</Stack\>                                                                           |
|                                                                                      |
| ) : (                                                                                |
|                                                                                      |
| \<ShimmeredDetailsList                                                               |
|                                                                                      |
| items={filteredRows}                                                                 |
|                                                                                      |
| columns={detailColumns}                                                              |
|                                                                                      |
| layoutMode={DetailsListLayoutMode.fixedColumns}                                      |
|                                                                                      |
| selectionMode={SelectionMode.multiple}                                               |
|                                                                                      |
| selection={selection}                                                                |
|                                                                                      |
| enableShimmer={dataset.loading}                                                      |
|                                                                                      |
| ariaLabelForGrid=\"Accounts Grid\"                                                   |
|                                                                                      |
| /\>                                                                                  |
|                                                                                      |
| )}                                                                                   |
|                                                                                      |
| \</Stack.Item\>                                                                      |
|                                                                                      |
| {/\* Footer / pager \*/}                                                             |
|                                                                                      |
| \<Stack className={gridStyles.footer} horizontal                                     |
|                                                                                      |
| verticalAlign=\"center\" horizontalAlign=\"space-between\"\>                         |
|                                                                                      |
| \<Text variant=\"small\" style={{ color: \"#605e5c\" }}\>                            |
|                                                                                      |
| {filteredRows.length} of {dataset.paging.totalResultCount} records                   |
|                                                                                      |
| \</Text\>                                                                            |
|                                                                                      |
| \<Stack horizontal tokens={{ childrenGap: 4 }}\>                                     |
|                                                                                      |
| \<button                                                                             |
|                                                                                      |
| className={gridStyles.pageButton}                                                    |
|                                                                                      |
| onClick={onPrevPage}                                                                 |
|                                                                                      |
| disabled={!dataset.paging.hasPreviousPage}                                           |
|                                                                                      |
| \>                                                                                   |
|                                                                                      |
| Previous                                                                             |
|                                                                                      |
| \</button\>                                                                          |
|                                                                                      |
| \<button                                                                             |
|                                                                                      |
| className={gridStyles.pageButton}                                                    |
|                                                                                      |
| onClick={onNextPage}                                                                 |
|                                                                                      |
| disabled={!dataset.paging.hasNextPage}                                               |
|                                                                                      |
| \>                                                                                   |
|                                                                                      |
| Next                                                                                 |
|                                                                                      |
| \</button\>                                                                          |
|                                                                                      |
| \</Stack\>                                                                           |
|                                                                                      |
| \</Stack\>                                                                           |
|                                                                                      |
| \</Stack\>                                                                           |
|                                                                                      |
| );                                                                                   |
|                                                                                      |
| };                                                                                   |
|                                                                                      |
| // Utility: export visible filtered rows as a CSV file                               |
|                                                                                      |
| function exportToCsv(rows: any\[\]) {                                                |
|                                                                                      |
| const headers = \[\"Account Name\", \"Phone\", \"Revenue\"\];                        |
|                                                                                      |
| const csvRows = rows.map(r =\> \[r.accountname, r.telephone1, r.revenueFormatted\]); |
|                                                                                      |
| const csv = \[headers, \...csvRows\].map(r =\> r.join(\",\")).join(\"\\n\");         |
|                                                                                      |
| const blob = new Blob(\[csv\], { type: \"text/csv\" });                              |
|                                                                                      |
| const url = URL.createObjectURL(blob);                                               |
|                                                                                      |
| const a = document.createElement(\"a\");                                             |
|                                                                                      |
| a.href = url;                                                                        |
|                                                                                      |
| a.download = \"accounts.csv\";                                                       |
|                                                                                      |
| a.click();                                                                           |
|                                                                                      |
| }                                                                                    |
+--------------------------------------------------------------------------------------+

## Step 9: Styles with mergeStyleSets

+-------+----------------------------------------------------------------+
| **9** | **Scoped Styling with Fluent UI merge-styles**                 |
|       |                                                                |
|       | *Estimated time: 20 minutes*                                   |
+-------+----------------------------------------------------------------+

+--------------------------------------------------------------------------------+
| **Do NOT use external .css files in PCF**                                      |
|                                                                                |
| External .css files and styled-components do not work correctly inside         |
|                                                                                |
| PCF\'s virtual DOM sandbox. They may bleed into the host Power Apps page       |
|                                                                                |
| or fail to load entirely.                                                      |
|                                                                                |
| Always use Fluent UI\'s mergeStyleSets / mergeStyles for all component styles. |
|                                                                                |
| They generate unique class names scoped to your component.                     |
+--------------------------------------------------------------------------------+

**9.1 Create styles.ts**

Create a styles.ts file. Use getTheme() to access the active Fluent theme tokens rather than hardcoding hex values. This ensures your styles adapt automatically to any custom Dynamics 365 theme.

+---------------------------------------------------------------------------------------+
| **AccountsGrid/styles.ts**                                                            |
+---------------------------------------------------------------------------------------+
| import { mergeStyleSets, getTheme, FontSizes, FontWeights } from \"@fluentui/react\"; |
|                                                                                       |
| // getTheme() returns the tokens from the nearest ThemeProvider.                      |
|                                                                                       |
| // Use palette.\* tokens instead of hardcoded hex values.                             |
|                                                                                       |
| const theme = getTheme();                                                             |
|                                                                                       |
| export const gridStyles = mergeStyleSets({                                            |
|                                                                                       |
| // Outer wrapper: fills the PCF container                                             |
|                                                                                       |
| root: {                                                                               |
|                                                                                       |
| display: \"flex\",                                                                    |
|                                                                                       |
| flexDirection: \"column\",                                                            |
|                                                                                       |
| height: \"100%\",                                                                     |
|                                                                                       |
| minHeight: \"300px\",                                                                 |
|                                                                                       |
| background: theme.palette.white,                                                      |
|                                                                                       |
| border: \`1px solid \${theme.palette.neutralLight}\`,                                 |
|                                                                                       |
| borderRadius: \"2px\",                                                                |
|                                                                                       |
| fontFamily: theme.fonts.medium.fontFamily,                                            |
|                                                                                       |
| },                                                                                    |
|                                                                                       |
| // Toolbar (CommandBar + SearchBox)                                                   |
|                                                                                       |
| toolbar: {                                                                            |
|                                                                                       |
| display: \"flex\",                                                                    |
|                                                                                       |
| alignItems: \"center\",                                                               |
|                                                                                       |
| justifyContent: \"space-between\",                                                    |
|                                                                                       |
| padding: \"4px 12px\",                                                                |
|                                                                                       |
| borderBottom: \`1px solid \${theme.palette.neutralLight}\`,                           |
|                                                                                       |
| background: theme.palette.neutralLighterAlt,                                          |
|                                                                                       |
| gap: \"8px\",                                                                         |
|                                                                                       |
| },                                                                                    |
|                                                                                       |
| // Scrollable list area                                                               |
|                                                                                       |
| listArea: {                                                                           |
|                                                                                       |
| flex: 1,                                                                              |
|                                                                                       |
| overflowY: \"auto\",                                                                  |
|                                                                                       |
| overflowX: \"hidden\",                                                                |
|                                                                                       |
| },                                                                                    |
|                                                                                       |
| // Footer / pager bar                                                                 |
|                                                                                       |
| footer: {                                                                             |
|                                                                                       |
| display: \"flex\",                                                                    |
|                                                                                       |
| alignItems: \"center\",                                                               |
|                                                                                       |
| justifyContent: \"space-between\",                                                    |
|                                                                                       |
| padding: \"6px 16px\",                                                                |
|                                                                                       |
| borderTop: \`1px solid \${theme.palette.neutralLight}\`,                              |
|                                                                                       |
| background: theme.palette.neutralLighterAlt,                                          |
|                                                                                       |
| fontSize: FontSizes.small,                                                            |
|                                                                                       |
| color: theme.palette.neutralSecondary,                                                |
|                                                                                       |
| },                                                                                    |
|                                                                                       |
| // Pagination buttons                                                                 |
|                                                                                       |
| pageButton: {                                                                         |
|                                                                                       |
| background: \"transparent\",                                                          |
|                                                                                       |
| border: \`1px solid \${theme.palette.neutralTertiary}\`,                              |
|                                                                                       |
| borderRadius: \"2px\",                                                                |
|                                                                                       |
| padding: \"4px 12px\",                                                                |
|                                                                                       |
| cursor: \"pointer\",                                                                  |
|                                                                                       |
| fontSize: FontSizes.small,                                                            |
|                                                                                       |
| color: theme.palette.neutralPrimary,                                                  |
|                                                                                       |
| fontFamily: theme.fonts.medium.fontFamily,                                            |
|                                                                                       |
| \":hover:not(:disabled)\": {                                                          |
|                                                                                       |
| background: theme.palette.neutralLighter,                                             |
|                                                                                       |
| borderColor: theme.palette.neutralSecondary,                                          |
|                                                                                       |
| },                                                                                    |
|                                                                                       |
| \":disabled\": {                                                                      |
|                                                                                       |
| opacity: 0.4,                                                                         |
|                                                                                       |
| cursor: \"not-allowed\",                                                              |
|                                                                                       |
| },                                                                                    |
|                                                                                       |
| },                                                                                    |
|                                                                                       |
| // Empty state (no records or no filter matches)                                      |
|                                                                                       |
| empty: {                                                                              |
|                                                                                       |
| flex: 1,                                                                              |
|                                                                                       |
| display: \"flex\",                                                                    |
|                                                                                       |
| alignItems: \"center\",                                                               |
|                                                                                       |
| justifyContent: \"center\",                                                           |
|                                                                                       |
| color: theme.palette.neutralTertiary,                                                 |
|                                                                                       |
| padding: \"60px 24px\",                                                               |
|                                                                                       |
| },                                                                                    |
|                                                                                       |
| // Optional: currency badge for revenue column                                        |
|                                                                                       |
| revenueBadge: {                                                                       |
|                                                                                       |
| display: \"inline-block\",                                                            |
|                                                                                       |
| background: theme.palette.themeLighterAlt,                                            |
|                                                                                       |
| color: theme.palette.themeDark,                                                       |
|                                                                                       |
| padding: \"2px 8px\",                                                                 |
|                                                                                       |
| borderRadius: \"10px\",                                                               |
|                                                                                       |
| fontSize: FontSizes.small,                                                            |
|                                                                                       |
| fontWeight: FontWeights.semibold,                                                     |
|                                                                                       |
| },                                                                                    |
|                                                                                       |
| });                                                                                   |
+---------------------------------------------------------------------------------------+

## Step 10: Local Testing with the Test Harness

+--------+----------------------------------------------------------------+
| **10** | **Run the PCF Test Harness**                                   |
|        |                                                                |
|        | *Estimated time: 15 minutes*                                   |
+--------+----------------------------------------------------------------+

Before deploying to Dataverse, test your component locally using the PCF test harness. It provides a mock dataset, column definitions, and paging controls in the browser.

**10.1 Start the Harness**

+-----------------------------------------------------------------------+
| **Terminal**                                                          |
+-----------------------------------------------------------------------+
| \# Start the local dev server                                         |
|                                                                       |
| npm start                                                             |
|                                                                       |
| \# Opens http://localhost:8181 in your default browser                |
+-----------------------------------------------------------------------+

**10.2 What to Test**

-   Columns appear with correct display names from the manifest

-   Rows show formatted values (currency, phone number formatting)

-   Column header click changes sort order (ascending/descending indicator)

-   Search box filters the visible rows by account name

-   Selecting rows highlights them and the selection count updates

-   Next / Previous Page buttons are enabled or disabled correctly

-   Refresh button triggers a dataset reload

-   No console errors in the browser DevTools

+-------------------------------------------------------------------------------+
| **Mock Data in the Harness**                                                  |
|                                                                               |
| The test harness generates mock records automatically based on your manifest  |
|                                                                               |
| property-set declarations. You can adjust the mock page size and record count |
|                                                                               |
| from the configuration panel on the right side of the harness page.           |
+-------------------------------------------------------------------------------+

## Step 11: Build and Deploy to Dataverse

+--------+----------------------------------------------------------------+
| **11** | **Build, Package & Deploy**                                    |
|        |                                                                |
|        | *Estimated time: 30 minutes*                                   |
+--------+----------------------------------------------------------------+

**11.1 Production Build**

+-----------------------------------------------------------------------+
| **Terminal**                                                          |
+-----------------------------------------------------------------------+
| \# Compile TypeScript and bundle for production                       |
|                                                                       |
| npm run build                                                         |
|                                                                       |
| \# Output goes to AccountsGrid/generated/bundle.js                    |
+-----------------------------------------------------------------------+

**11.2 Fast Push to Dataverse (Development)**

For rapid iteration during development, use pac pcf push. It compiles and deploys the component directly to your authenticated Dataverse environment without creating a solution file.

+-----------------------------------------------------------------------+
| **Terminal**                                                          |
+-----------------------------------------------------------------------+
| \# Push directly to the authenticated Dataverse environment           |
|                                                                       |
| pac pcf push \--publisher-prefix cnt                                  |
|                                                                       |
| \# The \--publisher-prefix must match the prefix in your D365 org     |
+-----------------------------------------------------------------------+

**11.3 Create and Build a Solution (Production)**

For production deployments, package the PCF control inside a Dataverse solution so it can be transported between environments.

+-----------------------------------------------------------------------+
| **Terminal**                                                          |
+-----------------------------------------------------------------------+
| \# Create a solution project in a sibling directory                   |
|                                                                       |
| mkdir AccountsGridSolution                                            |
|                                                                       |
| cd AccountsGridSolution                                               |
|                                                                       |
| pac solution init \\                                                  |
|                                                                       |
| \--publisher-name Contoso \\                                          |
|                                                                       |
| \--publisher-prefix cnt                                               |
|                                                                       |
| \# Add the PCF component as a reference                               |
|                                                                       |
| pac solution add-reference \--path ../AccountsGrid                    |
|                                                                       |
| \# Build the solution (.zip file)                                     |
|                                                                       |
| msbuild /t:build /restore                                             |
|                                                                       |
| \# Output: bin/Debug/AccountsGridSolution.zip                         |
+-----------------------------------------------------------------------+

**11.4 Import Solution via Power Apps Portal**

To deploy to a production or UAT environment, import the solution zip through the Power Apps Portal:

1.  Open **make.powerapps.com** and select your target environment

2.  Navigate to **Solutions** in the left navigation

3.  Click **Import** and upload the AccountsGridSolution.zip file

4.  Click **Next** and then **Import** to complete the process

**11.5 Add the Component to a Model-Driven App**

After import, add the component to a sub-grid on a Model-Driven form:

1.  Open your **Model-Driven App** in the Power Apps editor

2.  Select a **Sub-grid** that shows Account records on a form

3.  In the sub-grid properties, switch to the **Controls** tab

4.  Click **Add a control** and select **Contoso.AccountsGrid**

5.  Map the **accountsDataSet** property to your Account view

6.  Enable **Web**, **Phone**, and **Tablet** for the control

7.  Save and **Publish** the form, then preview the app

## Step 12: Troubleshooting Reference

+--------+----------------------------------------------------------------+
| **12** | **Common Issues and Solutions**                                |
|        |                                                                |
|        | *Reference*                                                    |
+--------+----------------------------------------------------------------+

  ------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Issue**                                   **Cause**                                **Solution**
  ------------------------------------------- ---------------------------------------- -----------------------------------------------------------------------
  Icons not rendering                         initializeIcons() not called             Call initializeIcons() once at module scope, outside any component

  TS2305 module not found                     Wrong React type package version         Match \@types/react version to your react version exactly

  Invalid manifest error on import            of-type value is incorrect               Check the property-set of-type against the Dataverse column data type

  Bundle too large (\>1 MB)                   All of \@fluentui/react imported         Use named imports: import { DetailsList } from \'@fluentui/react\'

  Component not showing in Add Control list   Publisher prefix mismatch                Ensure pac pcf push \--publisher-prefix matches your org publisher

  dataset.records is empty after load         Page size set to 0                       Call paging.setPageSize(500) in init() before the first updateView()

  Styles bleed into host page                 Using global .css or styled-components   Replace all styles with mergeStyleSets from \@fluentui/react

  Sort not working server-side                dataset.refresh() not called             After setting dataset.sorting, always call dataset.refresh()
  ------------------------------------------------------------------------------------------------------------------------------------------------------------

## Appendix: Complete File Reference

## File Summary

  ---------------------------------------------------------------------------------------------------------------
  **File**                    **Purpose**                                                   **Created In Step**
  --------------------------- ------------------------------------------------------------- ---------------------
  ControlManifest.Input.xml   Dataset schema, column declarations, input properties         Step 3

  index.ts                    PCF lifecycle class (init, updateView, getOutputs, destroy)   Step 4

  useDatasetRows.ts           React hooks: converts PCF dataset to typed rows/columns       Step 5

  AccountsGridComponent.tsx   Root React component: ThemeProvider wrapper                   Step 7

  AccountsGridInner.tsx       Full Fluent UI grid: DetailsList, SearchBox, CommandBar       Step 8

  styles.ts                   Scoped CSS-in-JS styles using mergeStyleSets                  Step 9
  ---------------------------------------------------------------------------------------------------------------

## Data Flow Summary

  -------------------------------------------------------------------------------------------------------------------------
  **Direction**                         **Mechanism**
  ------------------------------------- -----------------------------------------------------------------------------------
  Dataverse to React                    context.parameters.accountsDataSet passed as prop to React component

  Read rows                             dataset.sortedRecordIds.map(id =\> dataset.records\[id\].getFormattedString(col))

  Read columns                          dataset.columns.map(c =\> ({ name, displayName, dataType }))

  React to Power Apps (selection)       dataset.setSelectedRecordIds(selectedIds)

  React to Power Apps (sort)            dataset.sorting = \[\...\]; dataset.refresh()

  React to Power Apps (paging)          dataset.paging.moveToNextPage() or moveToPreviousPage()

  React to Power Apps (open record)     dataset.openDatasetItem(record.getNamedReference())

  React to Power Apps (scalar output)   this.notifyOutputChanged() then getOutputs() returns value
  -------------------------------------------------------------------------------------------------------------------------

## Useful Commands Reference

  ---------------------------------------------------------------------------------------------------
  **Command**                                           **Purpose**
  ----------------------------------------------------- ---------------------------------------------
  pac pcf init \--template dataset \--framework react   Scaffold a new PCF dataset project

  npm start                                             Launch local test harness at localhost:8181

  npm run build                                         Compile TypeScript and bundle

  pac pcf push \--publisher-prefix cnt                  Deploy directly to Dataverse (dev only)

  pac solution init                                     Create a Dataverse solution wrapper

  pac solution add-reference \--path ../MyPCF           Add a PCF project to a solution

  msbuild /t:build /restore                             Build the solution zip for import

  pac auth create \--url https://org.crm.dynamics.com   Authenticate CLI to a Dataverse org
  ---------------------------------------------------------------------------------------------------

+----------------------------------------------------------------------------+
| **Lab Complete!**                                                          |
|                                                                            |
| You have successfully built a production-grade PCF Dataset Component with: |
|                                                                            |
| \- Dataverse data binding through the PCF Dataset API                      |
|                                                                            |
| \- Bidirectional communication between React and Power Apps                |
|                                                                            |
| \- Fluent UI v8 ShimmeredDetailsList with sorting, search, and paging      |
|                                                                            |
| \- Scoped styles using mergeStyleSets                                      |
|                                                                            |
| \- Deployment to Dataverse via pac pcf push and solution import            |
+----------------------------------------------------------------------------+
