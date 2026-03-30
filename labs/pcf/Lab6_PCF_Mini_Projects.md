# ⚡ PCF Mini Projects
### Power Apps Component Framework
*Dynamic KPI • Threshold Color • Configurable Properties*

> Full source code with inline comments | TypeScript + React | Field & Dataset patterns

---

## Table of Contents

1. [Introduction](#introduction)
2. [Project 1 — Dynamic KPI Control](#project-1--dynamic-kpi-control)
   - 2.1 [Overview](#21-overview)
   - 2.2 [Component Structure](#22-component-structure)
   - 2.3 [ControlManifest.Input.xml](#23-controlmanifestinputxml)
   - 2.4 [index.ts — PCF Lifecycle](#24-indexts--pcf-lifecycle)
   - 2.5 [KPICard.tsx — React UI](#25-kpicarttsx--react-ui)
   - 2.6 [Manifest Properties Summary](#26-manifest-properties-summary)
3. [Project 2 — Color Change Based on Threshold](#project-2--color-change-based-on-threshold)
   - 3.1 [Overview](#31-overview)
   - 3.2 [ControlManifest.Input.xml](#32-controlmanifestinputxml)
   - 3.3 [index.ts — Threshold Logic](#33-indexts--threshold-logic)
   - 3.4 [Threshold Logic Chart](#34-threshold-logic-chart)
4. [Project 3 — Configurable Property Component](#project-3--configurable-property-component)
   - 4.1 [Overview](#41-overview)
   - 4.2 [Key Concepts: Dataset vs Field](#42-key-concepts-dataset-vs-field)
   - 4.3 [ControlManifest.Input.xml](#43-controlmanifestinputxml)
   - 4.4 [index.ts — Dataset Lifecycle](#44-indexts--dataset-lifecycle)
   - 4.5 [Manifest Properties Summary](#45-manifest-properties-summary)
   - 4.6 [Output Properties Explained](#46-output-properties-explained)

---

## Introduction

This document presents three Power Apps Component Framework (PCF) mini-projects. Each project includes a component type decision rationale, the full `ControlManifest.Input.xml`, and fully commented TypeScript source code. The projects progress from a simple read-only Field control through to a Dataset control that writes output properties back to the Power Platform.

| When to use Field PCF | When to use Dataset PCF |
|---|---|
| Control renders one CRM field | Control renders multiple records |
| No row iteration needed | Need paging, sort, or filter |
| KPIs, badges, pickers, gauges | Grids, timelines, card lists |
| Works on Canvas + Model-driven | Model-driven sub-grids / views |

| Project | Component Type | Primary Purpose |
|---|---|---|
| Dynamic KPI Control | Field | Rich numeric display with sparkline |
| Color Change on Threshold | Field | Conditional badge/text coloring |
| Configurable Property Component | Dataset | Maker-configurable data grid with output |

---

## Project 1 — Dynamic KPI Control

> **Power Apps Component Framework • Field Component • TypeScript / React**

> 📦 **Component Type: Field** — A Field PCF is used here because the KPI control binds to a single CRM column (e.g., Revenue, Score, Count). It reads one value, formats it richly, and does not need to iterate over a full dataset or manage multiple rows.

### 2.1 Overview

The Dynamic KPI Control replaces a plain numeric field on a Power Apps form with a visually rich Key Performance Indicator card. It automatically formats values (e.g., `1,250,000 → 1.25M`), shows a trend indicator (`↑ ↓ —`), and renders a mini sparkline bar — all driven by a single CRM field value plus configurable properties.

### 2.2 Component Structure

Below is the recommended folder layout after running `pac pcf init`:

```
DynamicKPIControl/
├── DynamicKPIControl/
│   ├── index.ts              ← PCF lifecycle methods
│   ├── KPICard.tsx           ← React component (UI)
│   └── css/
│       └── KPICard.css       ← Scoped styles
├── ControlManifest.Input.xml ← Properties & data-type declaration
└── package.json
```

### 2.3 ControlManifest.Input.xml

The manifest declares the component type, bound property, and all configuration parameters. The `type-group` named `'numeric'` ensures only number-type fields can be bound to this control.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<manifest>
  <control namespace="MyPCF" constructor="DynamicKPIControl"
           version="1.0.0" display-name-key="Dynamic_KPI_Control"
           description-key="Renders a KPI card for a numeric field"
           control-type="standard">

    <!-- Declare a type-group so only numeric fields can be bound -->
    <type-group name="numeric">
      <type>Whole.None</type>
      <type>Currency</type>
      <type>Decimal</type>
      <type>FP</type>
    </type-group>

    <!-- BOUND property — links this control to the CRM field value -->
    <property name="kpiValue" display-name-key="KPI_Value"
              description-key="The numeric field to display as KPI"
              of-type-group="numeric" usage="bound" required="true" />

    <!-- INPUT-ONLY properties — configurable, not bound to CRM columns -->
    <property name="kpiLabel" display-name-key="KPI_Label"
              description-key="Label shown above the value (e.g., Revenue)"
              of-type="SingleLine.Text" usage="input" />

    <property name="kpiUnit" display-name-key="Unit_Prefix_Suffix"
              description-key="Prefix or suffix e.g. $ or %"
              of-type="SingleLine.Text" usage="input" />

    <property name="sparklineValues" display-name-key="Sparkline_CSV"
              description-key="Comma-separated historical values for mini chart"
              of-type="SingleLine.Text" usage="input" />

    <resources>
      <code path="index.ts" order="1" />
      <css path="css/KPICard.css" order="1" />
    </resources>

  </control>
</manifest>
```

### 2.4 index.ts — PCF Lifecycle

The `index.ts` file implements the `StandardControl` interface. It is the bridge between the Power Platform runtime and the React component.

```typescript
import { IInputs, IOutputs } from './generated/ManifestTypes';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { KPICard } from './KPICard';

export class DynamicKPIControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;

  // init() is called once when the control is first rendered
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._container = container;
    this._context = context;
    this.renderControl(context);
  }

  // updateView() fires whenever the bound field value or any input property changes
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._context = context;
    this.renderControl(context);
  }

  // getOutputs() — not needed here; KPI is read-only (no data written back)
  public getOutputs(): IOutputs { return {}; }

  // destroy() cleans up React DOM to prevent memory leaks
  public destroy(): void {
    ReactDOM.unmountComponentAtNode(this._container);
  }

  private renderControl(context: ComponentFramework.Context<IInputs>): void {
    // Extract the bound field value; may be null if field is empty
    const value = context.parameters.kpiValue.raw ?? 0;
    const label = context.parameters.kpiLabel.raw ?? 'KPI';
    const unit  = context.parameters.kpiUnit.raw ?? '';
    const csv   = context.parameters.sparklineValues.raw ?? '';

    // Parse sparkline CSV into a number array for the mini-chart
    const sparkline = csv.split(',').map(Number).filter(n => !isNaN(n));

    ReactDOM.render(
      React.createElement(KPICard, { value, label, unit, sparkline }),
      this._container
    );
  }
}
```

### 2.5 KPICard.tsx — React UI

The React component handles all visual formatting. The `formatValue` helper auto-abbreviates large numbers and applies the unit prefix/suffix.

```typescript
import * as React from 'react';

interface KPICardProps {
  value:     number;
  label:     string;
  unit:      string;
  sparkline: number[];
}

// Abbreviate numbers: 1250000 → '1.25M', 5300 → '5.3K'
function formatValue(val: number, unit: string): string {
  if (Math.abs(val) >= 1_000_000) return unit + (val / 1_000_000).toFixed(2) + 'M';
  if (Math.abs(val) >= 1_000)     return unit + (val / 1_000).toFixed(1)     + 'K';
  return unit + val.toLocaleString();
}

export const KPICard: React.FC<KPICardProps> = ({ value, label, unit, sparkline }) => {

  // Determine trend direction by comparing current value to previous in sparkline
  const prev       = sparkline.length > 1 ? sparkline[sparkline.length - 2] : value;
  const trend      = value > prev ? '▲' : value < prev ? '▼' : '—';
  const trendColor = value > prev ? '#1E8449' : value < prev ? '#CB4335' : '#888';

  // Calculate bar heights for the mini sparkline (0–100% scale)
  const maxVal = Math.max(...sparkline, 1);
  const bars   = sparkline.map(v => (v / maxVal) * 40); // max height 40px

  return (
    <div className="kpi-card">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{formatValue(value, unit)}</span>
      <span className="kpi-trend" style={{ color: trendColor }}>{trend}</span>

      {/* Mini sparkline — rendered as flex bars */}
      <div className="kpi-spark">
        {bars.map((h, i) => (
          <div key={i} className="spark-bar" style={{ height: `${h}px`}} />
        ))}
      </div>
    </div>
  );
};
```

### 2.6 Manifest Properties Summary

| Property | Description |
|---|---|
| `kpiValue` | **Bound** — the numeric CRM field (Revenue, Score, etc.) |
| `kpiLabel` | **Input** — label text displayed above the value |
| `kpiUnit` | **Input** — prefix/suffix symbol e.g. `$` or `%` |
| `sparklineValues` | **Input** — comma-separated historical values for the mini bar chart |

> 💡 **Tip:** To test locally, run `npm start watch` after `pac pcf init`. The test harness at `localhost:8181` lets you mock the bound field value and all inputs without a Dataverse environment.

---

## Project 2 — Color Change Based on Threshold

> **Power Apps Component Framework • Field Component • TypeScript**

> 📦 **Component Type: Field** — A Field PCF is ideal here because the control is bound to one CRM column (a number or status field) and applies visual formatting purely based on that single value against configurable thresholds. A Dataset type would be overkill and would require read access to multiple rows.

### 3.1 Overview

This PCF control replaces the default field renderer with a dynamic, color-coded badge or pill. Makers configure up to three thresholds (warning and critical) — values below the warning level appear green, between warning and critical appear amber, and above critical appear red. All colors and labels are configurable via input properties so no code changes are needed when thresholds change.

### 3.2 ControlManifest.Input.xml

Three numeric threshold properties (`lowThreshold`, `midThreshold`) and two color override properties let makers fine-tune behaviour without rebuilding.

```xml
<manifest>
  <control namespace="MyPCF" constructor="ThresholdColorControl"
           version="1.0.0" display-name-key="Threshold_Color_Control"
           description-key="Changes color based on configured thresholds"
           control-type="standard">

    <!-- Numeric type-group: supports whole numbers, decimals, and currency -->
    <type-group name="numbers">
      <type>Whole.None</type>
      <type>Decimal</type>
      <type>FP</type>
      <type>Currency</type>
    </type-group>

    <!-- BOUND: the field value to evaluate against thresholds -->
    <property name="fieldValue" display-name-key="Field_Value"
              description-key="Numeric field to evaluate"
              of-type-group="numbers" usage="bound" required="true" />

    <!-- Threshold at which color changes from green to amber -->
    <property name="warningThreshold" display-name-key="Warning_Threshold"
              description-key="Value at or above this shows amber"
              of-type="Whole.None" usage="input" />

    <!-- Threshold at which color changes from amber to red -->
    <property name="criticalThreshold" display-name-key="Critical_Threshold"
              description-key="Value at or above this shows red"
              of-type="Whole.None" usage="input" />

    <!-- Optional: flip logic for KPIs where lower is worse (e.g., customer score) -->
    <property name="invertLogic" display-name-key="Invert_Logic"
              description-key="Set true if lower value should show red"
              of-type="TwoOptions" usage="input" />

    <!-- Optional: display as badge pill (true) or plain colored text (false) -->
    <property name="showBadge" display-name-key="Show_As_Badge"
              of-type="TwoOptions" usage="input" />

    <resources>
      <code path="index.ts" order="1" />
    </resources>

  </control>
</manifest>
```

### 3.3 index.ts — Threshold Logic

All rendering happens inside `index.ts` using plain DOM manipulation — no React dependency needed for this simpler control. This keeps the bundle size small.

```typescript
import { IInputs, IOutputs } from './generated/ManifestTypes';

export class ThresholdColorControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  private _container: HTMLDivElement;
  private _badge: HTMLSpanElement;

  public init(
    context: ComponentFramework.Context<IInputs>,
    _notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._container = container;

    // Create the badge span once; updateView will style it on every change
    this._badge = document.createElement('span');
    this._badge.style.cssText = `
      padding: 4px 12px; border-radius: 12px; font-weight: 600;
      font-family: Segoe UI, sans-serif; font-size: 13px;
      display: inline-block; transition: background 0.3s;
    `;
    container.appendChild(this._badge);
    this.applyThreshold(context);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.applyThreshold(context);
  }

  public getOutputs(): IOutputs { return {}; }

  public destroy(): void { this._container.innerHTML = ''; }

  private applyThreshold(context: ComponentFramework.Context<IInputs>): void {
    const val       = context.parameters.fieldValue.raw        ?? 0;
    const warn      = context.parameters.warningThreshold.raw  ?? 50;
    const crit      = context.parameters.criticalThreshold.raw ?? 80;
    const invert    = context.parameters.invertLogic.raw       ?? false;
    const showBadge = context.parameters.showBadge.raw         ?? true;

    // Determine status level based on thresholds
    // Normal logic:   low=green, mid=amber, high=red
    // Inverted logic (e.g., satisfaction score): high=green, low=red
    let bg: string, fg: string, label: string;

    const isHigh = val >= crit;
    const isMid  = val >= warn && val < crit;

    if ((!invert && isHigh) || (invert && !isHigh && !isMid)) {
      bg = '#FADBD8'; fg = '#922B21'; label = `⚠ ${val}`;  // Red — critical
    } else if (isMid) {
      bg = '#FEF9E7'; fg = '#7D6608'; label = `◑ ${val}`;  // Amber — warning
    } else {
      bg = '#D5F5E3'; fg = '#1E8449'; label = `✓ ${val}`;  // Green — healthy
    }

    if (showBadge) {
      // Badge pill style
      this._badge.style.background = bg;
      this._badge.style.color      = fg;
      this._badge.textContent      = label;
    } else {
      // Plain colored text — no background
      this._badge.style.background = 'transparent';
      this._badge.style.color      = fg;
      this._badge.textContent      = String(val);
    }
  }
}
```

### 3.4 Threshold Logic Chart

| Condition | Display Color | Icon | Use Case |
|---|---|---|---|
| `val < warningThreshold` | Green (`#D5F5E3`) | ✓ | Healthy / On-track |
| `val >= warning & < critical` | Amber (`#FEF9E7`) | ◑ | Needs attention |
| `val >= criticalThreshold` | Red (`#FADBD8`) | ⚠ | Critical / Overdue |
| `invertLogic = true` | Colors reversed | ↕ | Satisfaction / Score KPIs |

> 💡 **Tip:** Set `warningThreshold` and `criticalThreshold` in the component properties panel on the form editor. No code rebuild is needed when thresholds change — the control re-evaluates on every form load.

---

## Project 3 — Configurable Property Component

> **Power Apps Component Framework • Dataset Component • TypeScript / React**

> 📦 **Component Type: Dataset** — A Dataset PCF is chosen here because the configurable property pattern is most powerful when demonstrated against a collection of records (e.g., a list of tasks, leads, or orders). The component reads column definitions from the dataset, allows makers to map display columns, toggle features, and set page size — all without changing code. For a single field, a Field PCF with input properties would suffice, but the Dataset pattern showcases the full power of configurable properties.

### 4.1 Overview

The Configurable Property Component is a reusable dataset viewer that makers can configure entirely through the component properties panel. A maker can choose which columns to show, how many rows per page, whether to show a search bar, and what accent color to apply — all without any developer involvement. This pattern is the foundation of any customizable PCF grid.

### 4.2 Key Concepts: Dataset vs Field

| Field PCF | Dataset PCF |
|---|---|
| Binds to one CRM column | Binds to a view / sub-grid |
| Reads a single raw value | Reads multiple rows and columns |
| Ideal for badges, KPIs, pickers | Ideal for grids, timelines, cards |
| `init → updateView` per field change | `updateView` on paging / filter / sort |
| No pagination built-in | Built-in paging via `context.parameters.<dataset>.paging` |

### 4.3 ControlManifest.Input.xml

For a dataset component, the manifest uses a `<data-set>` node instead of a `<property>` node for the primary data source. All other configurable properties remain as regular `<property>` inputs.

```xml
<manifest>
  <control namespace="MyPCF" constructor="ConfigurableGrid"
           version="1.0.0" display-name-key="Configurable_Grid"
           description-key="A maker-configurable dataset component"
           control-type="standard">

    <!-- DATASET: links to a Dataverse view or sub-grid -->
    <!-- The name "gridData" is the key used in context.parameters.gridData -->
    <data-set name="gridData" display-name-key="Grid_Data">
      <!-- Columns are mapped by the maker in the properties panel -->
    </data-set>

    <!-- Configurable display columns — comma-separated logical names -->
    <property name="visibleColumns" display-name-key="Visible_Columns"
              description-key="Comma-separated list of column logical names to show"
              of-type="SingleLine.Text" usage="input" />

    <!-- Number of rows to show per page -->
    <property name="pageSize" display-name-key="Page_Size"
              description-key="Rows per page (default 10)"
              of-type="Whole.None" usage="input" />

    <!-- Toggle the search bar on/off -->
    <property name="showSearch" display-name-key="Show_Search_Bar"
              of-type="TwoOptions" usage="input" />

    <!-- Accent color (hex) for header and hover states -->
    <property name="accentColor" display-name-key="Accent_Color"
              description-key="Hex color e.g. #1E3A5F"
              of-type="SingleLine.Text" usage="input" />

    <!-- Emit the selected record ID back to the form (output property) -->
    <property name="selectedRecordId" display-name-key="Selected_Record_ID"
              description-key="ID of the row clicked by the user"
              of-type="SingleLine.Text" usage="output" />

    <resources>
      <code path="index.ts" order="1" />
    </resources>

  </control>
</manifest>
```

### 4.4 index.ts — Dataset Lifecycle

Dataset controls have the same lifecycle methods as Field controls but interact with the `context.parameters` dataset object to read records, columns, and paging state.

```typescript
import { IInputs, IOutputs } from './generated/ManifestTypes';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ConfigurableGrid } from './ConfigurableGrid';

export class ConfigurableGridControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  private _container: HTMLDivElement;
  private _notifyOutputChanged: () => void;
  private _selectedId: string = '';

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._container          = container;
    this._notifyOutputChanged = notifyOutputChanged;

    // Request the page size from properties; set paging before first render
    const pageSize = context.parameters.pageSize.raw ?? 10;
    context.parameters.gridData.paging.setPageSize(pageSize);

    this.renderGrid(context);
  }

  // updateView fires on: initial render, data refresh, paging, sort, filter
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.renderGrid(context);
  }

  // getOutputs returns the selected record ID to the form / Power Automate
  public getOutputs(): IOutputs {
    return { selectedRecordId: this._selectedId };
  }

  public destroy(): void {
    ReactDOM.unmountComponentAtNode(this._container);
  }

  private renderGrid(context: ComponentFramework.Context<IInputs>): void {
    const dataset      = context.parameters.gridData;
    const visibleCols  = (context.parameters.visibleColumns.raw ?? '').split(',');
    const showSearch   = context.parameters.showSearch.raw   ?? true;
    const accentColor  = context.parameters.accentColor.raw  ?? '#1E3A5F';

    // Map dataset records into plain objects for the React component
    // dataset.sortedRecordIds preserves the view's current sort order
    const rows = dataset.sortedRecordIds.map(id => {
      const record = dataset.records[id];
      const row: Record<string, string> = { _id: id };
      visibleCols.forEach(col => {
        // getFormattedValue returns the display-friendly string
        row[col] = record.getFormattedValue(col.trim());
      });
      return row;
    });

    // Column headers: use display name from dataset columns map
    const columns = visibleCols.map(col => ({
      key:  col.trim(),
      name: dataset.columns.find(c => c.name === col.trim())?.displayName ?? col,
    }));

    const onRowClick = (id: string) => {
      this._selectedId = id;
      // Notify the platform that output has changed
      this._notifyOutputChanged();
    };

    ReactDOM.render(
      React.createElement(ConfigurableGrid, {
        rows, columns, showSearch, accentColor,
        paging: dataset.paging,
        onRowClick,
      }),
      this._container
    );
  }
}
```

### 4.5 Manifest Properties Summary

| Property | Description |
|---|---|
| `gridData` | **Dataset** — the bound Dataverse view or sub-grid (multiple records) |
| `visibleColumns` | **Input** — comma-separated logical column names to render |
| `pageSize` | **Input** — rows per page; passed to `dataset.paging.setPageSize()` |
| `showSearch` | **Input** — toggles a client-side search/filter bar |
| `accentColor` | **Input** — hex color for header row and hover highlight |
| `selectedRecordId` | **Output** — ID of the row the user clicked; usable in Power Automate |

### 4.6 Output Properties Explained

Unlike Field controls that are usually read-only (`getOutputs` returns `{}`), this component writes back the selected record ID via an output property. This enables Power Apps makers to trigger flows, open forms, or update other controls when a row is clicked — all without custom JavaScript outside the PCF.

```typescript
// When a row is clicked:
// 1. this._selectedId is updated
// 2. this._notifyOutputChanged() signals the platform
// 3. Platform calls getOutputs() and reads selectedRecordId
// 4. The value is now available as a property in Power Apps formulas
//    e.g. If(ConfigurableGrid.selectedRecordId <> '', ...)
```

> ⚠️ **Important:** Dataset controls are **NOT** supported on Canvas Apps entity forms — they work in Model-driven App sub-grids and views only. For Canvas Apps, use a Field PCF or a custom page component instead.

---

> All three projects are deployable via `pac pcf push` or solution import. Each control is independently versioned and can be combined on the same form.
