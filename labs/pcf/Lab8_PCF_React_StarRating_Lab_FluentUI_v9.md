# Power Apps Component Framework (PCF)
## Building a Star Rating Control with React
### *Complete Lab Guide — Fluent UI v9*

---

## Table of Contents

1. [Lab Overview](#1-lab-overview)
2. [What You'll Build](#2-what-youll-build)
3. [Prerequisites](#3-prerequisites)
4. [Understanding PCF-React Integration](#4-understanding-pcf-react-integration)
   - 4.1 [Architecture Overview](#41-architecture-overview)
   - 4.2 [PCF Lifecycle Methods and When They're Called](#42-pcf-lifecycle-methods-and-when-theyre-called)
   - 4.3 [Data Flow: Platform → PCF → React → PCF → Platform](#43-data-flow-platform--pcf--react--pcf--platform)
5. [Lab Setup](#5-lab-setup)
   - 5.1 [Step 1: Create the PCF Project](#51-step-1-create-the-pcf-project)
   - 5.2 [Step 2: Install React and Fluent UI Dependencies](#52-step-2-install-react-and-fluent-ui-dependencies)
   - 5.3 [Step 3: Configure the Control Manifest](#53-step-3-configure-the-control-manifest)
6. [Exercise 1: Basic Star Rating Display](#6-exercise-1-basic-star-rating-display)
   - 6.1 [Step 1: Create the Star Rating React Component](#61-step-1-create-the-star-rating-react-component)
   - 6.2 [Step 2: Integrate React with PCF Lifecycle](#62-step-2-integrate-react-with-pcf-lifecycle)
   - 6.3 [Step 3: Build and Test](#63-step-3-build-and-test)
7. [Exercise 2: User Clicks and Data Output](#7-exercise-2-user-clicks-and-data-output)
   - 7.1 [Step 1: Add Click Handling to React Component](#71-step-1-add-click-handling-to-react-component)
   - 7.2 [Step 2: Update PCF to Handle Output](#72-step-2-update-pcf-to-handle-output)
   - 7.3 [Step 3: Test the Interaction](#73-step-3-test-the-interaction)
8. [Exercise 3: Adding Hover Effects](#8-exercise-3-adding-hover-effects)
   - 8.1 [Step 1: Add Hover State to React Component](#81-step-1-add-hover-state-to-react-component)
   - 8.2 [Step 2: Test Hover Effects](#82-step-2-test-hover-effects)
9. [Summary and Key Takeaways](#9-summary-and-key-takeaways)
   - 9.1 [PCF Lifecycle Method Summary](#91-pcf-lifecycle-method-summary)
   - 9.2 [Key Concepts to Remember](#92-key-concepts-to-remember)
   - 9.3 [Fluent UI v8 vs v9 Migration Reference](#93-fluent-ui-v8-vs-v9-migration-reference)
10. [Next Steps and Challenges](#10-next-steps-and-challenges)
11. [Additional Resources](#11-additional-resources)

---

## 1. Lab Overview

In this comprehensive lab, you will learn how to integrate React with the Power Apps Component Framework (PCF) by building a Star Rating control from scratch. This lab covers the complete lifecycle of PCF-React integration, data flow between PCF and React components, and implementing interactive features with **Fluent UI v9** — the modern, standalone component library with full tree-shaking support and design token-based theming.

> **📌 Note on Fluent UI v9 and PCF**
>
> Fluent UI v9 (`@fluentui/react-components`) is the current recommended library for standalone React applications and custom PCF controls built **outside** of model-driven apps or Dynamics 365 embedded forms. If deploying into Dynamics 365 or model-driven apps that ship their own Fluent UI v8 bundle, use v8 instead to avoid version conflicts. For standalone canvas apps and custom portals, v9 is the modern choice.

---

## 2. What You'll Build

A fully functional Star Rating control that:

- Displays 5 stars with the current rating highlighted
- Receives input from Dataverse through PCF lifecycle methods
- Sends user selections back to Dataverse via PCF output methods
- Implements hover effects for better user experience
- Uses Fluent UI v9 (`@fluentui/react-components`) with design tokens and `makeStyles`

---

## 3. Prerequisites

- Node.js (v16 or higher) installed
- Power Platform CLI (`pac`) installed
- Basic knowledge of TypeScript and React
- Code editor (VS Code recommended)
- Access to a Power Apps environment

---

## 4. Understanding PCF-React Integration

Before we start coding, it's essential to understand how React integrates with PCF and when each lifecycle method is called.

### 4.1 Architecture Overview

PCF controls follow a specific architecture where the PCF lifecycle methods act as a bridge between the Power Apps platform and your React components:

| Layer | Responsibility |
|---|---|
| **Power Apps Platform** | Hosts the control, manages data binding, triggers lifecycle methods |
| **PCF Lifecycle Methods** | Bridge between platform and React: `init()`, `updateView()`, `getOutputs()`, `destroy()` |
| **React Components** | Render UI, handle user interactions, manage component state |

> **🆕 Fluent UI v9 Change: `FluentProvider` wrapper**
>
> Unlike v8, Fluent UI v9 requires all components to be wrapped in a `<FluentProvider theme={...}>` context provider. In PCF, this provider is rendered once in `init()` and wraps the entire component tree.

---

### 4.2 PCF Lifecycle Methods and When They're Called

#### 1. `init()` — Initialization

| Aspect | Detail |
|---|---|
| **Called** | Once when the control is first loaded on a form or screen. |
| **Purpose** | Initialize your React app, set up the container, create initial state. |
| **React Integration (v9)** | Use `ReactDOM.createRoot()` (React 18 API) to create a root, then call `root.render()` wrapping your component tree in `<FluentProvider>`. Store the root instance for later updates. |

---

#### 2. `updateView()` — Data Refresh

| Aspect | Detail |
|---|---|
| **Called** | Whenever the platform detects a change in bound data (e.g., when a user changes the rating value, or when the form loads with existing data). |
| **Purpose** | Receive updated data from the platform and pass it to your React components. |
| **React Integration (v9)** | Call `root.render()` on the stored root instance with updated props. React's reconciliation handles efficient re-rendering. |

---

#### 3. `getOutputs()` — Send Data Back

| Aspect | Detail |
|---|---|
| **Called** | When the platform needs to retrieve the current value from your control (typically after a user interaction that you notify via `notifyOutputChanged()`). |
| **Purpose** | Return the current value that should be saved to Dataverse. |
| **React Integration (v9)** | No change from v8 — maintain the current value in a class variable (updated by React callbacks), and return it when the platform calls this method. |

---

#### 4. `destroy()` — Cleanup

| Aspect | Detail |
|---|---|
| **Called** | When the control is removed from the DOM (form closed, navigation away, etc.). |
| **Purpose** | Clean up resources, unmount React components. |
| **React Integration (v9)** | Call `root.unmount()` on the stored React 18 root (replaces the v8 `ReactDOM.unmountComponentAtNode()`). |

---

### 4.3 Data Flow: Platform → PCF → React → PCF → Platform

Understanding the complete data flow is critical for building PCF controls with React:

1. **Platform → `init()`:** Platform initializes control with initial data
2. **`init()` → React:** PCF creates a React root and renders component inside `<FluentProvider>`
3. **Platform → `updateView()`:** Platform sends updated data when bound field changes
4. **`updateView()` → React:** PCF calls `root.render()` again with new props
5. **User clicks star → React:** React component handles click event
6. **React → PCF callback:** React calls `onChange` prop (passed from PCF)
7. **PCF → `notifyOutputChanged()`:** PCF tells platform data has changed
8. **Platform → `getOutputs()`:** Platform requests current value
9. **`getOutputs()` → Platform:** PCF returns value to save to Dataverse

---

## 5. Lab Setup

### 5.1 Step 1: Create the PCF Project

First, we'll create a new PCF project using the Power Platform CLI.

**Open your terminal and run:**

```bash
mkdir StarRatingControl
cd StarRatingControl
pac pcf init --namespace Contoso --name StarRating --template field
```

**What this does:**

- `--namespace Contoso` — Your publisher namespace
- `--name StarRating` — The control name
- `--template field` — Creates a field control (binds to a single data field)

---

### 5.2 Step 2: Install React and Fluent UI Dependencies

Now we'll install React 18, ReactDOM, and Fluent UI v9.

**Run the following command:**

```bash
npm install react@18 react-dom@18 @fluentui/react-components --save
```

**Install TypeScript type definitions:**

```bash
npm install @types/react@18 @types/react-dom@18 --save-dev
```

> **🆕 Fluent UI v9 — Key Package Differences vs v8**
>
> | v8 | v9 |
> |---|---|
> | `@fluentui/react` | `@fluentui/react-components` |
> | `import { Icon } from "@fluentui/react/lib/Icon"` | No `Icon` component — use inline SVG or `@fluentui/react-icons` |
> | `import { Stack } from "@fluentui/react/lib/Stack"` | No `Stack` — use CSS Flexbox or the `makeStyles` utility |
> | `styles={{ root: { ... } }}` prop pattern | `makeStyles()` hook with design tokens |
> | No provider needed | `<FluentProvider theme={...}>` required |
> | `ReactDOM.render()` | `ReactDOM.createRoot().render()` (React 18) |
> | `ReactDOM.unmountComponentAtNode()` | `root.unmount()` |

**Install Fluent UI icons (replaces the v8 `Icon` component):**

```bash
npm install @fluentui/react-icons --save
```

---

### 5.3 Step 3: Configure the Control Manifest

Open `ControlManifest.Input.xml` and update it to define our rating property. This is unchanged from the v8 version:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<manifest>
  <control namespace="Contoso" constructor="StarRating"
           version="1.0.0" display-name-key="StarRating"
           description-key="Star Rating Control">
    <property name="rating" display-name-key="Rating"
              description-key="Current rating value"
              of-type="Whole.None" usage="bound" required="true" />
    <resources>
      <code path="index.ts" order="1"/>
    </resources>
  </control>
</manifest>
```

**Key Configuration Points:**

- `name="rating"` — The property name that binds to your Dataverse field
- `of-type="Whole.None"` — Defines an integer property (ratings 1–5)
- `usage="bound"` — This property is bound to a field in Dataverse

---

## 6. Exercise 1: Basic Star Rating Display

### 6.1 Step 1: Create the Star Rating React Component

Create a new file `StarRating.tsx` in the `StarRating` folder (same level as `index.ts`).

In Fluent UI v9, we use:
- `@fluentui/react-icons` for the star icons (replaces the `Icon` component from v8)
- `makeStyles` for styling with design tokens (replaces the inline `styles={{ root: {...} }}` prop)
- A `div` with inline flex styles (replaces the `Stack` component from v8)

```tsx
import * as React from "react";
import { StarRegular, StarFilled } from "@fluentui/react-icons";
import { makeStyles, tokens } from "@fluentui/react-components";

// Styles using Fluent UI v9 makeStyles and design tokens
const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
  },
  starFilled: {
    fontSize: "24px",
    color: tokens.colorPaletteGoldBorder2,  // Fluent v9 gold token (~#FFB900)
    cursor: "pointer",
  },
  starEmpty: {
    fontSize: "24px",
    color: tokens.colorNeutralForegroundDisabled,  // Fluent v9 disabled grey token
    cursor: "pointer",
  },
});

interface IStarRatingProps {
  rating: number;      // Current rating from Dataverse
  maxStars?: number;   // Total stars to display
}

export const StarRating: React.FC<IStarRatingProps> = (props) => {
  const { rating, maxStars = 5 } = props;
  const styles = useStyles();

  // Render star icons using Fluent UI v9 icon components
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      const isFilled = i <= rating;
      stars.push(
        isFilled ? (
          <StarFilled
            key={i}
            className={styles.starFilled}
          />
        ) : (
          <StarRegular
            key={i}
            className={styles.starEmpty}
          />
        )
      );
    }
    return stars;
  };

  return <div className={styles.container}>{renderStars()}</div>;
};
```

**Understanding This Code:**

- **`makeStyles`** — Fluent UI v9's CSS-in-JS hook; generates scoped class names at runtime
- **`tokens`** — Design token object providing theme-aware colour values (auto-adjusts for light/dark themes)
- **`StarFilled` / `StarRegular`** — Named SVG icon components from `@fluentui/react-icons` (replaces the v8 `Icon` with `iconName` string)
- **`className` prop** — v9 icons accept standard React `className` instead of the v8 `styles` prop object
- **`div` with flex** — Replaces the v8 `Stack horizontal` layout component

---

### 6.2 Step 2: Integrate React with PCF Lifecycle

Now we'll connect the React component to the PCF lifecycle. Open `index.ts` and replace its contents.

In Fluent UI v9, the component tree must be wrapped in `<FluentProvider>`. We also use React 18's `createRoot` API instead of `ReactDOM.render()`.

```ts
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";   // React 18 client import
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { StarRating } from "./StarRating";

export class StarRating implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private _container: HTMLDivElement;
  private _root: ReactDOM.Root;  // React 18 root instance

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    // Store the container and create the React 18 root
    this._container = container;
    this._root = ReactDOM.createRoot(this._container);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    // Get the rating value from Dataverse
    const rating = context.parameters.rating.raw ?? 0;

    // Render the React component wrapped in FluentProvider
    this._root.render(
      React.createElement(
        FluentProvider,
        { theme: webLightTheme },
        React.createElement(StarRating, { rating: rating })
      )
    );
  }

  public getOutputs(): IOutputs {
    // No outputs yet - we will add this in Exercise 2
    return {};
  }

  public destroy(): void {
    // React 18: use root.unmount() instead of ReactDOM.unmountComponentAtNode()
    this._root.unmount();
  }
}
```

> **💡 Understanding the v9 PCF Integration**
>
> - `createRoot()` — React 18 API that replaces `ReactDOM.render()`; call it once in `init()` and store the root
> - `root.render()` — Called in every `updateView()` to re-render with new props; React reconciles efficiently
> - `<FluentProvider theme={webLightTheme}>` — Required v9 wrapper that injects design tokens into the component tree
> - `root.unmount()` — React 18 cleanup method that replaces `ReactDOM.unmountComponentAtNode()`

---

### 6.3 Step 3: Build and Test

**Build and start the test harness:**

```bash
npm run build
npm start watch
```

The test harness will open in your browser. Try changing the rating value in the input panel — you should see the stars update accordingly! The control receives data from the platform and renders it visually.

---

## 7. Exercise 2: User Clicks and Data Output

Now we'll make the control interactive. When a user clicks a star, we need to:

1. Capture the click in React
2. Notify PCF that the value changed
3. Return the new value via `getOutputs()`

### 7.1 Step 1: Add Click Handling to React Component

Update `StarRating.tsx` to handle clicks. We add an `onChange` callback prop and attach `onClick` handlers to each star icon:

```tsx
import * as React from "react";
import { StarRegular, StarFilled } from "@fluentui/react-icons";
import { makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
  },
  starFilled: {
    fontSize: "24px",
    color: tokens.colorPaletteGoldBorder2,
    cursor: "pointer",
  },
  starEmpty: {
    fontSize: "24px",
    color: tokens.colorNeutralForegroundDisabled,
    cursor: "pointer",
  },
});

interface IStarRatingProps {
  rating: number;
  maxStars?: number;
  onChange?: (newRating: number) => void;  // NEW: Callback prop
}

export const StarRating: React.FC<IStarRatingProps> = (props) => {
  const { rating, maxStars = 5, onChange } = props;
  const styles = useStyles();

  // NEW: Handle star click
  const handleStarClick = (starIndex: number) => {
    if (onChange) {
      onChange(starIndex);  // Call the callback with new rating
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      const isFilled = i <= rating;
      stars.push(
        isFilled ? (
          <StarFilled
            key={i}
            className={styles.starFilled}
            onClick={() => handleStarClick(i)}   // NEW: Click handler
          />
        ) : (
          <StarRegular
            key={i}
            className={styles.starEmpty}
            onClick={() => handleStarClick(i)}   // NEW: Click handler
          />
        )
      );
    }
    return stars;
  };

  return <div className={styles.container}>{renderStars()}</div>;
};
```

> **💡 Understanding React Callbacks in v9**
>
> - `onChange` is a callback prop — PCF will provide a function here
> - `handleStarClick` receives the star number (1–5) and calls `onChange`
> - Fluent UI v9 icon components accept standard React event props like `onClick` directly
> - PCF handles the platform communication (`notifyOutputChanged`, `getOutputs`)

---

### 7.2 Step 2: Update PCF to Handle Output

Update `index.ts` to store the rating and communicate with the platform:

```ts
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { StarRating } from "./StarRating";

export class StarRating implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private _container: HTMLDivElement;
  private _root: ReactDOM.Root;
  private _notifyOutputChanged: () => void;  // NEW: Store callback
  private _currentRating: number;            // NEW: Store current value

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._container = container;
    this._root = ReactDOM.createRoot(this._container);
    this._notifyOutputChanged = notifyOutputChanged;          // NEW: Store
    this._currentRating = context.parameters.rating.raw ?? 0;
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    const rating = context.parameters.rating.raw ?? 0;
    this._currentRating = rating;   // NEW: Update stored value

    this._root.render(
      React.createElement(
        FluentProvider,
        { theme: webLightTheme },
        React.createElement(StarRating, {
          rating: rating,
          onChange: this.onRatingChange.bind(this)  // NEW: Pass callback
        })
      )
    );
  }

  // NEW: React calls this when user clicks a star
  private onRatingChange(newRating: number): void {
    this._currentRating = newRating;      // Store new value
    this._notifyOutputChanged();          // Tell platform data changed
  }

  public getOutputs(): IOutputs {
    // NEW: Return current rating to platform
    return {
      rating: this._currentRating
    };
  }

  public destroy(): void {
    this._root.unmount();
  }
}
```

> **💡 Understanding the Complete Flow**
>
> 1. User clicks star 4 → React's `handleStarClick(4)` fires
> 2. `handleStarClick` calls `onChange(4)` → PCF's `onRatingChange(4)` executes
> 3. `onRatingChange` stores `4` and calls `notifyOutputChanged()` → Platform is notified
> 4. Platform calls `getOutputs()` → PCF returns `{ rating: 4 }`
> 5. Platform saves `4` to Dataverse → Platform calls `updateView()` with new value
> 6. `updateView` calls `root.render()` with `rating: 4` → UI updates to show 4 filled stars

---

### 7.3 Step 3: Test the Interaction

**Rebuild and test:**

```bash
npm run build
npm start watch
```

Now click on different stars. You should see the rating update in the test harness output panel, confirming that `getOutputs()` is being called and returning the correct value!

---

## 8. Exercise 3: Adding Hover Effects

Let's enhance the user experience by showing a preview when hovering over stars. We'll use React state to track the hover position, and extend `makeStyles` with a hover style class.

### 8.1 Step 1: Add Hover State to React Component

Update `StarRating.tsx` to use React's `useState` hook for hover tracking, and add a hover style using Fluent UI v9 tokens:

```tsx
import * as React from "react";
import { StarRegular, StarFilled } from "@fluentui/react-icons";
import { makeStyles, tokens, mergeClasses } from "@fluentui/react-components";

// NEW: mergeClasses utility used to combine style classes conditionally
const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
  },
  starFilled: {
    fontSize: "24px",
    color: tokens.colorPaletteGoldBorder2,
    cursor: "pointer",
    transitionProperty: "color",          // NEW: Smooth transition
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  starEmpty: {
    fontSize: "24px",
    color: tokens.colorNeutralForegroundDisabled,
    cursor: "pointer",
    transitionProperty: "color",          // NEW: Smooth transition
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
  // NEW: Hover preview — slightly brighter gold
  starHover: {
    color: tokens.colorPaletteGoldForeground2,
  },
});

interface IStarRatingProps {
  rating: number;
  maxStars?: number;
  onChange?: (newRating: number) => void;
}

export const StarRating: React.FC<IStarRatingProps> = (props) => {
  const { rating, maxStars = 5, onChange } = props;
  const styles = useStyles();

  // NEW: Track hover state
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const handleStarClick = (starIndex: number) => {
    if (onChange) {
      onChange(starIndex);
    }
  };

  // NEW: Mouse enter handler
  const handleMouseEnter = (starIndex: number) => {
    setHoverRating(starIndex);
  };

  // NEW: Mouse leave handler
  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      // NEW: Use hover rating if hovering, otherwise use actual rating
      const displayRating = hoverRating !== null ? hoverRating : rating;
      const isFilled = i <= displayRating;
      const isHovering = hoverRating !== null && i <= hoverRating;

      // NEW: mergeClasses combines base style with conditional hover style
      const starClass = mergeClasses(
        isFilled ? styles.starFilled : styles.starEmpty,
        isHovering && styles.starHover
      );

      stars.push(
        isFilled ? (
          <StarFilled
            key={i}
            className={starClass}
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}  // NEW
            onMouseLeave={handleMouseLeave}            // NEW
          />
        ) : (
          <StarRegular
            key={i}
            className={starClass}
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}  // NEW
            onMouseLeave={handleMouseLeave}            // NEW
          />
        )
      );
    }
    return stars;
  };

  return <div className={styles.container}>{renderStars()}</div>;
};
```

> **💡 Understanding Fluent UI v9 Styling in PCF**
>
> - **`makeStyles`** — Generates atomic CSS class names; styles are injected once and reused
> - **`mergeClasses`** — The v9 equivalent of `cx()` / `classnames`; correctly merges Fluent atomic classes (do not use string concatenation)
> - **`tokens.durationNormal` / `tokens.curveEasyEase`** — Motion design tokens for consistent animations across the theme
> - **`useState` hook** — Creates internal React state that doesn't flow back to PCF; hover is UI-only and never written to Dataverse
> - **Two states** — `rating` (from PCF/Dataverse) and `hoverRating` (React internal UI preview)

---

### 8.2 Step 2: Test Hover Effects

**Rebuild and test:**

```bash
npm run build
npm start watch
```

Hover over the stars to see the preview effect. Notice how the stars fill as you hover, but only commit when you click. The token-driven transition makes the interaction feel polished and consistent with the Fluent design system.

---

## 9. Summary and Key Takeaways

Congratulations! You've built a complete PCF control with React 18 and Fluent UI v9 integration. Let's review the critical concepts:

### 9.1 PCF Lifecycle Method Summary

| Method | When Called | React Action (v9) | Data Flow |
|---|---|---|---|
| `init()` | Once at load | `createRoot()` — store root instance | None |
| `updateView()` | Data changes | `root.render()` with `<FluentProvider>` wrapper | Platform → PCF → React |
| `getOutputs()` | After `notifyOutputChanged()` | None (returns stored value) | React → PCF → Platform |
| `destroy()` | Control removed | `root.unmount()` | Cleanup |

---

### 9.2 Key Concepts to Remember

#### 1. Platform is Source of Truth

Dataverse holds the actual data. PCF and React are just UI layers. Always get data from `context.parameters` in `updateView()`, and return data via `getOutputs()`.

#### 2. `root.render()` is Idempotent

Calling `root.render()` multiple times on the same root is safe. React's reconciliation efficiently updates only what changed.

#### 3. Two Types of State

- **PCF state** — Stored in class variables, persisted to Dataverse via `getOutputs()`
- **React state** — Managed by `useState`, used for UI-only concerns (like hover)

#### 4. `FluentProvider` is Required in v9

Every Fluent UI v9 component tree must be wrapped in `<FluentProvider theme={...}>`. Without it, design tokens will not resolve and components will render without styles. In PCF, render the provider in `updateView()` as the root element.

#### 5. Use `mergeClasses`, Not String Concatenation

Fluent UI v9 generates atomic CSS classes. Concatenating class name strings can produce incorrect specificity. Always use `mergeClasses(classA, condition && classB)` to combine them.

---

### 9.3 Fluent UI v8 vs v9 Migration Reference

| Concern | v8 | v9 |
|---|---|---|
| **Package** | `@fluentui/react` | `@fluentui/react-components` |
| **Icons** | `Icon` component with `iconName` string | Named SVG components from `@fluentui/react-icons` |
| **Layout** | `Stack`, `StackItem` | CSS Flexbox via `makeStyles` |
| **Styling** | `styles={{ root: { color: "red" } }}` prop | `makeStyles()` hook + `className` prop |
| **Colour tokens** | Inline hex strings (`"#FFB900"`) | `tokens.colorPaletteGoldBorder2` etc. |
| **Theme context** | Not required | `<FluentProvider theme={webLightTheme}>` required |
| **Class merging** | `mergeStyles()` | `mergeClasses()` |
| **React mount** | `ReactDOM.render()` | `ReactDOM.createRoot().render()` |
| **React unmount** | `ReactDOM.unmountComponentAtNode()` | `root.unmount()` |
| **React version** | React 16/17 | React 17/18 (18 recommended) |

---

## 10. Next Steps and Challenges

**Challenge yourself with these enhancements:**

1. **Add half-star support** — Modify to allow ratings like 3.5
2. **Add read-only mode** — Use `context.mode.isControlDisabled` to disable clicks and set `cursor: "default"` via `makeStyles`
3. **Add a label** — Display "3 out of 5 stars" below the rating using the Fluent UI v9 `Text` component
4. **Support dark theme** — Pass `webDarkTheme` from `@fluentui/react-components` to `FluentProvider` based on system preference
5. **Deploy to your environment** — Use `pac solution` to package and deploy

---

## 11. Additional Resources

- **PCF Documentation:** <https://aka.ms/PowerAppsPCF>
- **Fluent UI v9 Documentation:** <https://react.fluentui.dev>
- **Fluent UI v9 Icons:** <https://react.fluentui.dev/?path=/docs/icons-catalog--docs>
- **Fluent UI v8 → v9 Migration Guide:** <https://react.fluentui.dev/?path=/docs/concepts-migration-from-v8-component-mapping--docs>
- **React 18 `createRoot` API:** <https://react.dev/reference/react-dom/client/createRoot>
- **React Documentation:** <https://react.dev>
- **Power Platform CLI:** <https://aka.ms/PowerPlatformCLI>

---

*You now have a solid foundation in PCF-React integration using the modern Fluent UI v9 design system. The `makeStyles`, design tokens, and `FluentProvider` patterns covered in this lab reflect current best practices for building Fluent-styled controls in React.*
