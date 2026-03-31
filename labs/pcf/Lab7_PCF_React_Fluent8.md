# Lab: Building a PCF Control with React and Fluent UI v8

---

## What You Will Build

A custom Power Apps Component Framework (PCF) control using React and Fluent UI v8. The control will display a text field that reads and writes a value back to Power Apps.

---

## Why Fluent

---

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (LTS version recommended) — https://nodejs.org
- **Power Platform CLI (pac)** — install via:

```bash
npm install -g @microsoft/powerplatform-cli
```

- **Visual Studio Code** — https://code.visualstudio.com
- Access to a **Power Apps environment** (trial or licensed)

Verify your installations:

```bash
node -v
pac --version
```

---

# Part 1 — Project Setup

---

## Step 1: Create a Project Folder

Open a terminal and run:

```bash
mkdir PCFReactLab
cd PCFReactLab
```

---

## Step 2: Initialise the PCF Project

Run the following command to scaffold a React-based PCF control:

```bash
pac pcf init --namespace LabNamespace --name RatingControl --template field --framework react
```

What each flag means:

| Flag | Value | Purpose |
| --- | --- | --- |
| `--namespace` | LabNamespace | Groups your control logically |
| `--name` | RatingControl | The name of your control |
| `--template` | field | Binds the control to a single field value |
| `--framework` | react | Scaffolds a React (virtual) control |

---

## Step 3: Install Dependencies

```bash
npm install
npm install @fluentui/react
```

This installs:

- All PCF base dependencies
- Fluent UI v8 (`@fluentui/react`) — the component library used in this lab

---

## Step 4: Open in VS Code

```bash
code .
```

---

# Part 2 — Understanding the Project Structure

---

Once the project is open, you will see this structure:

```
PCFReactLab/
    RatingControl/
        index.ts              <-- PCF lifecycle (init, updateView, getOutputs, destroy)
        HelloWorld.tsx        <-- React component (your UI lives here)
        css/
            RatingControl.css
    ControlManifest.Input.xml <-- Declares properties, control type
    package.json
    tsconfig.json
```

---

## How PCF and React Connect

This is the most important concept in the lab:

```
Power Apps Runtime
        |
        v
   index.ts  (PCF entry point)
        |
        | -- reads context (field value, formatting, etc.)
        | -- calls notifyOutputChanged() when value changes
        |
        v
   HelloWorld.tsx  (React component)
        |
        | -- receives props from index.ts
        | -- renders Fluent UI components
        | -- fires callbacks back to index.ts on user interaction
```

- **index.ts** is the bridge between Power Apps and React
- **HelloWorld.tsx** is a pure React component — it knows nothing about Power Apps
- Data flows DOWN as props, and changes flow UP via callback functions

---

# Part 3 — Editing the Manifest

---

## Step 5: Open ControlManifest.Input.xml

Find the `property` block and update it to define a text field called `sampleText`:

```xml
<property name="sampleText"
          display-name-key="Sample Text"
          description-key="A simple text value"
          of-type="SingleLine.Text"
          usage="bound"
          required="true" />
```

Key attributes:

| Attribute | Meaning |
| --- | --- |
| `of-type` | The Power Apps field type this binds to |
| `usage="bound"` | Control reads AND writes the value |
| `required="true"` | A value must be provided |

---

# Part 4 — Building the React Component

---

## Step 6: Update HelloWorld.tsx

Replace the contents of `HelloWorld.tsx` with the following:

```tsx
import * as React from "react";
import { TextField, PrimaryButton, Stack, Label } from "@fluentui/react";

export interface HelloWorldProps {
  name: string;
  onChange: (newValue: string) => void;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({ name, onChange }) => {
  const [inputValue, setInputValue] = React.useState(name);

  const handleChange = (_event: React.FormEvent, newValue?: string) => {
    setInputValue(newValue || "");
  };

  const handleSave = () => {
    onChange(inputValue);
  };

  return (
    <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: 10 } }}>
      <Label>Enter a value:</Label>
      <TextField
        value={inputValue}
        onChange={handleChange}
        placeholder="Type something..."
      />
      <PrimaryButton text="Save to Power Apps" onClick={handleSave} />
    </Stack>
  );
};
```

What this does:

- Uses Fluent UI v8 `TextField`, `PrimaryButton`, `Stack`, and `Label`
- Holds local state with `useState`
- Calls `onChange` (passed from index.ts) when the user clicks Save

---

# Part 5 — Wiring React to PCF in index.ts

---

## Step 7: Update index.ts

Replace the contents of `index.ts` with the following:

```typescript
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { HelloWorld, HelloWorldProps } from "./HelloWorld";
import * as React from "react";

export class RatingControl
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  private _value: string;
  private _notifyOutputChanged: () => void;

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void
  ): void {
    this._notifyOutputChanged = notifyOutputChanged;
  }

  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    const props: HelloWorldProps = {
      name: context.parameters.sampleText.raw ?? "",
      onChange: this.handleChange.bind(this),
    };

    return React.createElement(HelloWorld, props);
  }

  private handleChange(newValue: string): void {
    this._value = newValue;
    this._notifyOutputChanged();
  }

  public getOutputs(): IOutputs {
    return {
      sampleText: this._value,
    };
  }

  public destroy(): void {
    // Cleanup if needed
  }
}
```

How the integration works step by step:

1. Power Apps calls `init()` once — we store `notifyOutputChanged`
2. Power Apps calls `updateView()` whenever data changes — we pass the current field value as a prop to the React component
3. When the user clicks Save in React, `handleChange()` is called
4. `handleChange()` stores the new value and calls `notifyOutputChanged()` to tell Power Apps a value has changed
5. Power Apps calls `getOutputs()` to retrieve the updated value

---

# Part 6 — Running Locally

---

## Step 8: Build and Test

```bash
npm run build
npm start watch
```

This opens the PCF test harness at `http://localhost:8181`

In the test harness you can:

- Type a value into the TextField
- Click Save and see the output value update in the right-hand panel
- Change the input value in the panel and watch `updateView` re-render the component

---

# Part 7 — Packaging and Deploying

---

## Step 9: Create a Solution Project

Open a new terminal at the parent folder level (one level above `PCFReactLab`):

```bash
mkdir PCFSolution
cd PCFSolution
pac solution init --publisher-name LabPublisher --publisher-prefix lab
```

---

## Step 10: Link the PCF Project to the Solution

```bash
pac solution add-reference --path ../PCFReactLab
```

---

## Step 11: Build the Solution

```bash
msbuild /t:build /restore
```

This generates a `.zip` file inside `bin/debug/`.

---

## Step 12: Import to Power Apps

1. Go to https://make.powerapps.com
2. Select your environment
3. Go to **Solutions** and click **Import solution**
4. Upload the `.zip` file from `bin/debug/`
5. After import, click **Publish all customizations**

---

## Step 13: Add the Control to a Form (Model-Driven App)

1. Open your solution and navigate to a table (e.g., Account)
2. Open the main form and select the field you want to bind (e.g., Account Number)
3. In the field properties panel, click **+ Component**
4. Find **RatingControl** and add it
5. Save and publish the form

---

# Summary: How React and PCF Integrate

| Layer | File | Role |
| --- | --- | --- |
| Power Apps Runtime | — | Calls PCF lifecycle methods |
| PCF Entry Point | `index.ts` | Bridges Power Apps and React |
| React Component | `HelloWorld.tsx` | Renders UI using Fluent UI v8 |
| Component Library | `@fluentui/react` | Provides styled, accessible UI controls |
| Manifest | `ControlManifest.Input.xml` | Declares properties and control type |

---

# Key Concepts to Remember

**Props flow down** — `index.ts` passes field values to React as props via `updateView()`

**Callbacks flow up** — React calls `onChange` which triggers `notifyOutputChanged()` in `index.ts`

**Power Apps never touches React directly** — `index.ts` acts as the translator between the two worlds

**Fluent UI v8 is bundled into your control** — unlike virtual controls which use platform libraries, standard bundling includes Fluent UI in your package

---

# Lab Extension Challenges

Try these on your own to go further:

1. Replace `PrimaryButton` with a Fluent UI `Rating` component from `@fluentui/react`
2. Add a second property to the manifest (e.g., `placeholder`) and pass it as a prop
3. Add basic validation — disable the Save button if the input is empty
4. Style the control using `@fluentui/react` theme tokens
