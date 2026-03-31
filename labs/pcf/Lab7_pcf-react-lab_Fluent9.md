# PCF React Component Lab: Text Input with Button

> **Lab Level:** Beginner–Intermediate  
> **Duration:** ~60 minutes  
> **Goal:** Build a Power Apps Component Framework (PCF) field component that renders a **Fluent UI v9** (`@fluentui/react-components`) text box and button in React. The PCF control passes a bound field value into React via props, and React emits the updated value back to PCF when the button is clicked.

---

## Table of Contents

1. [Overview & Architecture](#1-overview--architecture)
2. [Prerequisites](#2-prerequisites)
3. [Scaffold the PCF Project](#3-scaffold-the-pcf-project)
4. [Install Dependencies](#4-install-dependencies)
5. [Define the Control Manifest](#5-define-the-control-manifest)
6. [Create the React Component](#6-create-the-react-component)
7. [Wire React into the PCF Index](#7-wire-react-into-the-pcf-index)
8. [Run the Harness](#8-run-the-harness)
9. [Deploy to Power Apps](#9-deploy-to-power-apps)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Overview & Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Power Apps / Model-Driven               │
│                                                         │
│   Bound Field (text)  ──►  PCF Index.ts                │
│                              │                          │
│                         props passed down               │
│                              │                          │
│                         ▼                               │
│                   React Component                       │
│              ┌──────────────────────┐                  │
│              │  [ TextField  ] [Go] │  ◄── Fluent UI v9  │
│              └──────────────────────┘                  │
│                              │                          │
│                    Button onClick callback               │
│                              │                          │
│                         ▲                               │
│                    notifyOutputChanged()                 │
│                    → new value sent to Power Apps        │
└─────────────────────────────────────────────────────────┘
```

**Key contract:**

| Direction | Mechanism |
|-----------|-----------|
| PCF → React | Props (`value`, `disabled`, `onChange` callback) |
| React → PCF | `onChange(newValue)` callback → `notifyOutputChanged()` |

---

## 2. Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18 LTS | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Bundled with Node |
| Power Platform CLI (`pac`) | Latest | `npm install -g @microsoft/powerapps-cli` |
| TypeScript | 4.x or 5.x | Installed by scaffold |
| Git | Any | Optional but recommended |

Verify your environment before starting:

```bash
node -v        # e.g. v18.20.0
npm -v         # e.g. 9.8.0
pac --version  # e.g. 1.30.x
```

---

## 3. Scaffold the PCF Project

### 3.1 Create a working folder

```bash
mkdir pcf-text-button
cd pcf-text-button
```

### 3.2 Initialize the PCF control

Use the `pac pcf init` command. We create a **field** control (binds to a single column) using the **React** framework template.

```bash
pac pcf init \
  --namespace MyOrg \
  --name TextButtonControl \
  --template field \
  --framework React \
  --run-npm-install
```

> **`--framework React`** scaffolds the project with a `ReactDOM` entry point and installs `react` and `react-dom` automatically. We will upgrade to **React 18** (`createRoot`) in Step 7 to align with Fluent UI v9 requirements.

### 3.3 Inspect the generated structure

```
pcf-text-button/
├── TextButtonControl/
│   ├── index.ts          ← PCF lifecycle (init, updateView, getOutputs)
│   ├── ControlManifest.Input.xml   ← Declare properties & resources
│   └── HelloWorld.tsx    ← Auto-generated sample React component
├── package.json
└── tsconfig.json
```

We will replace `HelloWorld.tsx` with our own component in Step 6.

---

## 4. Install Dependencies

Fluent UI v9 ships as a single unified package and requires **React 18**.

### 4.1 Install Fluent UI v9

```bash
npm install @fluentui/react-components
```

### 4.2 Upgrade React to v18

The PAC scaffold installs React 17 by default. Fluent UI v9 requires React 18 for full support.

```bash
npm install react@18 react-dom@18
npm install --save-dev @types/react@18 @types/react-dom@18
```

### 4.3 Verify `package.json`

After both steps, confirm your dependencies look like this:

```json
"dependencies": {
  "@fluentui/react-components": "^9.x.x",
  "react": "^18.x.x",
  "react-dom": "^18.x.x"
}
```

> **Why a separate package?** Fluent UI v9 (`@fluentui/react-components`) is a complete rewrite from v8 (`@fluentui/react`). It uses the **Griffel** CSS-in-JS engine, a new `FluentProvider` theming system, and composable slot-based components. The two packages can coexist but should not be mixed in the same component tree.

> **Bundle size note:** Fluent v9 is fully tree-shakeable. Only the components you import are included in the final bundle.

---

## 5. Define the Control Manifest

Open `TextButtonControl/ControlManifest.Input.xml` and replace its contents with the following:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<manifest>
  <control namespace="MyOrg"
           constructor="TextButtonControl"
           version="0.0.1"
           display-name-key="TextButtonControl"
           description-key="TextButtonControl_Desc"
           control-type="standard">

    <!-- ① Bound property: the field value coming in from Power Apps -->
    <property name="sampleText"
              display-name-key="Property_Display_Key"
              description-key="Property_Desc_Key"
              of-type="SingleLine.Text"
              usage="bound"
              required="true" />

    <resources>
      <code path="index.ts" order="1" />
    </resources>

  </control>
</manifest>
```

**Key attributes explained:**

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `of-type` | `SingleLine.Text` | Maps to a text column in Dataverse |
| `usage` | `bound` | Two-way binding — PCF can read AND write the value |
| `required` | `true` | The column must be mapped when the control is added |

---

## 6. Create the React Component

### 6.1 Delete the sample file

```bash
# Windows
del TextButtonControl\HelloWorld.tsx

# macOS / Linux
rm TextButtonControl/HelloWorld.tsx
```

### 6.2 Understand Fluent UI v9 key differences

Before writing the component, note how v9 differs from v8:

| Concept | Fluent UI v8 | Fluent UI v9 |
|---------|-------------|-------------|
| Package | `@fluentui/react` | `@fluentui/react-components` |
| Text input | `<TextField>` | `<Input>` + `<Field>` |
| Primary button | `<PrimaryButton>` | `<Button appearance="primary">` |
| Layout | `<Stack>` | Native CSS flexbox / `makeStyles` |
| Theming | `<ThemeProvider>` | `<FluentProvider theme={...}>` |
| Styling | `styles` prop (merge styles) | `makeStyles` (Griffel) |
| onChange | `(event, newValue?) => void` | `(event, data) => void` where `data.value` holds the string |

### 6.3 Create `TextButtonControl/TextInput.tsx`

Create a new file at `TextButtonControl/TextInput.tsx`:

```tsx
import * as React from "react";
import {
  FluentProvider,
  webLightTheme,
  Input,
  Button,
  Field,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

// ─── Styles (Griffel / makeStyles) ───────────────────────────────────────────
const useStyles = makeStyles({
  // Outer wrapper rendered inside FluentProvider
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: tokens.spacingHorizontalS,  // 8 px from the Fluent token scale
  },
  input: {
    minWidth: "200px",
  },
});

// ─── Props Interface ──────────────────────────────────────────────────────────
export interface ITextInputProps {
  /** Current value received from PCF (bound field) */
  value: string;
  /** Called when the user clicks the button; passes the committed input value */
  onChange: (newValue: string) => void;
  /** Disable controls when PCF is in read-only mode */
  disabled?: boolean;
}

// ─── Inner component (must live inside FluentProvider) ────────────────────────
const TextInputInner: React.FC<ITextInputProps> = ({ value, onChange, disabled }) => {
  const styles = useStyles();

  // Local state — tracks what the user types before clicking Submit
  const [inputValue, setInputValue] = React.useState<string>(value ?? "");

  // Sync local state when the PCF bound value changes externally
  React.useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  // v9 Input onChange: second arg is { value: string }
  const handleInputChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    data: { value: string }
  ): void => {
    setInputValue(data.value);
  };

  // Notify PCF only on button click
  const handleButtonClick = (): void => {
    onChange(inputValue);
  };

  return (
    <div className={styles.root}>
      {/* Field wraps Input and provides the label + validation slot */}
      <Field label="Enter value">
        <Input
          className={styles.input}
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="Type something…"
        />
      </Field>

      {/* appearance="primary" replaces PrimaryButton from v8 */}
      <Button
        appearance="primary"
        onClick={handleButtonClick}
        disabled={disabled}
        aria-label="Submit value to Power Apps"
      >
        Submit
      </Button>
    </div>
  );
};

// ─── Exported component: wraps inner in FluentProvider ───────────────────────
//
// FluentProvider MUST wrap any Fluent v9 component tree.
// We keep it here (not in index.ts) so the provider is co-located
// with the components that need it and is easily swappable to a dark theme.
//
const TextInput: React.FC<ITextInputProps> = (props) => (
  <FluentProvider theme={webLightTheme}>
    <TextInputInner {...props} />
  </FluentProvider>
);

export default TextInput;
```

**What each Fluent v9 piece does:**

| Import | Role |
|--------|------|
| `FluentProvider` | Injects the design token theme into the component tree via React context |
| `webLightTheme` | Built-in token set (light mode). Swap to `webDarkTheme` or `teamsLightTheme` as needed |
| `Input` | Unstyled-by-default text input; pair with `Field` for label/validation |
| `Field` | Layout wrapper that adds a label, required marker, and validation message slot |
| `Button` | Polymorphic button; `appearance="primary"` applies the filled brand colour |
| `makeStyles` | Griffel-based atomic CSS; classes are created once and cached |
| `tokens` | Design token references (spacing, colour, typography) — always prefer over hard-coded values |

**Component flow at a glance:**

```
User types in <Input>
       │
       ▼
 handleInputChange(event, { value })   ← v9 signature; data.value holds string
       │
 setInputValue(data.value)             ← local state only, PCF not yet notified
       │
User clicks <Button appearance="primary">
       │
       ▼
  handleButtonClick()
       │
  onChange(inputValue)                 ← calls the prop callback
       │
       ▼
  index.ts → notifyOutputChanged()     ← Power Apps receives new value
```

---

## 7. Wire React into the PCF Index

Open `TextButtonControl/index.ts` and replace its full contents.

> **React 18 change:** The legacy `ReactDOM.render()` is replaced by `createRoot().render()`. This is required to avoid the deprecation warning and to align with how Fluent UI v9's internal concurrent-mode features work.

```typescript
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import TextInput from "./TextInput";

export class TextButtonControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  // ── Private fields ────────────────────────────────────────────────────────
  private _root: Root;                        // React 18 createRoot handle
  private _notifyOutputChanged: () => void;
  private _currentValue: string;
  private _disabled: boolean;

  // ── init ─────────────────────────────────────────────────────────────────
  /**
   * Called once when the control is loaded.
   * Create the React root here; rendering happens in updateView.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._notifyOutputChanged = notifyOutputChanged;
    this._currentValue = context.parameters.sampleText.raw ?? "";
    this._disabled = context.mode.isControlDisabled;

    // React 18: create the root once in init, render in updateView
    this._root = createRoot(container);
  }

  // ── updateView ───────────────────────────────────────────────────────────
  /**
   * Called whenever the bound property or context changes.
   * Re-render the React tree with updated props.
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._currentValue = context.parameters.sampleText.raw ?? "";
    this._disabled = context.mode.isControlDisabled;

    // Props are the sole channel for PCF → React data flow
    const props = {
      value: this._currentValue,
      disabled: this._disabled,
      onChange: this._onReactChange.bind(this),
    };

    this._root.render(React.createElement(TextInput, props));
  }

  // ── getOutputs ───────────────────────────────────────────────────────────
  /**
   * Called by Power Apps after notifyOutputChanged() to collect new values.
   */
  public getOutputs(): IOutputs {
    return {
      sampleText: this._currentValue,
    };
  }

  // ── destroy ──────────────────────────────────────────────────────────────
  /**
   * Clean up when the control is removed from the page.
   */
  public destroy(): void {
    // React 18 cleanup — unmounts the component tree and frees resources
    this._root.unmount();
  }

  // ── Private callback ─────────────────────────────────────────────────────
  /**
   * Receives the committed value from React and signals Power Apps.
   */
  private _onReactChange(newValue: string): void {
    this._currentValue = newValue;
    this._notifyOutputChanged(); // triggers getOutputs()
  }
}
```

**Lifecycle summary:**

| PCF Method | When Called | What We Do |
|------------|-------------|------------|
| `init` | Once on load | `createRoot(container)` — store root + notifyOutputChanged |
| `updateView` | On every prop/context change | `this._root.render(...)` with fresh props |
| `getOutputs` | After `notifyOutputChanged()` | Return `{ sampleText: this._currentValue }` |
| `destroy` | On unmount | `this._root.unmount()` |

**React 17 vs React 18 rendering comparison:**

```typescript
// ❌ React 17 (legacy — avoid with Fluent v9)
import * as ReactDOM from "react-dom";
ReactDOM.render(React.createElement(TextInput, props), container);
// cleanup:
ReactDOM.unmountComponentAtNode(container);

// ✅ React 18 (use this)
import { createRoot } from "react-dom/client";
this._root = createRoot(container);          // in init()
this._root.render(React.createElement(...)); // in updateView()
this._root.unmount();                        // in destroy()
```

---

## 8. Run the Harness

The PCF tooling ships with a local test harness so you can develop without deploying to Power Apps.

### 8.1 Build and start

```bash
npm start watch
```

This command:
1. Compiles TypeScript → JavaScript
2. Starts a local webpack dev server at `http://localhost:8181`
3. Watches for file changes and hot-reloads

### 8.2 Use the harness

Open your browser at `http://localhost:8181`. You will see the **PCF Harness** UI:

```
┌─────────────────────────────────────────────────────────┐
│  PCF Test Harness                                       │
│                                                         │
│  Data Inputs                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ sampleText:  [ Hello World           ]           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Component Preview                                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Enter value                                      │  │
│  │ [ Hello World              ] [ Submit ]          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Test the data flow:**

1. **PCF → React:** Change the `sampleText` value in the *Data Inputs* panel on the left — the TextField should update automatically.
2. **React → PCF:** Type a new value in the TextField and click **Submit** — the *Data Inputs* panel shows the updated value, confirming `notifyOutputChanged()` fired.

### 8.3 Build for production

```bash
npm run build
```

Outputs a minified bundle to `out/controls/TextButtonControl/`.

---

## 9. Deploy to Power Apps

### 9.1 Create a solution package

```bash
# From the project root
mkdir Solution
cd Solution

pac solution init \
  --publisher-name MyOrg \
  --publisher-prefix myorg

pac solution add-reference --path ../
```

### 9.2 Build the solution

```bash
# Back in project root
cd ..
msbuild /t:build /restore
```

This produces `bin/Debug/TextButtonControl.zip` (or `Release` if you pass `/p:configuration=Release`).

### 9.3 Import to Power Apps

```bash
pac solution import --path bin/Debug/TextButtonControl.zip
```

Or import manually:

1. Go to [make.powerapps.com](https://make.powerapps.com)
2. **Solutions** → **Import solution**
3. Upload `TextButtonControl.zip`
4. Follow the wizard

### 9.4 Add the control to a form

1. Open a **Model-Driven App** form in the editor
2. Select a **Single line of text** column
3. In the properties panel → **Components** tab → **+ Component**
4. Find **TextButtonControl** and click **Add**
5. Map the `sampleText` property to your column
6. **Save and Publish**

---

## 10. Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `Cannot find module '@fluentui/react-components'` | Dependency not installed | Run `npm install @fluentui/react-components` |
| `Cannot find module 'react-dom/client'` | React still on v17 | Run `npm install react@18 react-dom@18` |
| TextField shows blank on load | `value` prop is `undefined` | Ensure `?? ""` fallback in `index.ts` and `useEffect` |
| Button click does nothing | Callback not wired | Confirm `onChange` prop is passed in `updateView` |
| `FluentProvider` missing — tokens/styles broken | Provider not wrapping tree | Ensure `<FluentProvider theme={webLightTheme}>` wraps all v9 components |
| Styles not applied / raw CSS class names visible | Griffel SSR mismatch | Do not server-render; PCF runs client-side only — no fix needed |
| Control shows in harness but not in app | Manifest version not incremented | Bump `version` in `ControlManifest.Input.xml` before reimporting |
| TypeScript error on `getOutputs` | Property name mismatch | Name in `getOutputs` must exactly match `ControlManifest.Input.xml` |
| `onChange` type error on `<Input>` | Using v8 handler signature | v9 signature is `(event, data: { value: string }) => void` — use `data.value` |
| `createRoot` not found | Wrong react-dom import | Import from `"react-dom/client"`, not `"react-dom"` |

---

## Summary

You have built a PCF field control that:

- ✅ Scaffolds with `pac pcf init --framework React`
- ✅ Upgrades to **React 18** (`createRoot`) and **Fluent UI v9** (`@fluentui/react-components`)
- ✅ Declares a `bound` text property in the manifest
- ✅ Passes data from PCF into React via **props** (`value`, `disabled`, `onChange`)
- ✅ Wraps the component tree in `<FluentProvider theme={webLightTheme}>` for v9 token theming
- ✅ Uses **Fluent v9** `<Field>` + `<Input>` for the text input and `<Button appearance="primary">` for the action
- ✅ Uses `makeStyles` + `tokens` for Griffel-based, atomic CSS styling
- ✅ Handles the v9 `onChange` signature: `(event, data: { value: string }) => void`
- ✅ Keeps local React state for in-progress text; notifies PCF only on button click
- ✅ Cleans up with `this._root.unmount()` on destroy

### File reference

```
TextButtonControl/
├── ControlManifest.Input.xml   ← property: sampleText (bound, SingleLine.Text)
├── index.ts                    ← init / updateView / getOutputs / destroy (React 18 createRoot)
└── TextInput.tsx               ← FluentProvider + Field + Input + Button (Fluent UI v9)
```

---

*Happy hacking! For the full PCF API reference see [docs.microsoft.com/power-apps/developer/component-framework](https://docs.microsoft.com/en-us/power-apps/developer/component-framework/reference/).*
