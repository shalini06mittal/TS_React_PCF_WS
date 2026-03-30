# ⭐ Star Rating PCF Control
### Hands-On Lab Guide
*Power Apps Component Framework (PCF)*

> Build a fully interactive star rating control from scratch

**Lab Duration:** ~90 minutes &nbsp;|&nbsp; **Level:** Intermediate

*Prerequisites: Node.js 16+, VS Code, Power Platform CLI, Basic TypeScript knowledge*

---

## About This Lab

In this lab you will build a five-star rating PCF (Power Apps Component Framework) control from the ground up using TypeScript. By the end, the control will render interactive stars in any model-driven or canvas app, write its selected value back to a Dataverse field, and respond correctly to hover effects, disabled mode, and external value changes.

The lab is split into five exercises. Each exercise builds on the previous one, introducing a new concept. Code is provided at each stage so you can compare your work or catch up if needed.

| Exercise | Topic |
|---|---|
| **Exercise 1** | Project Setup & Scaffolding |
| **Exercise 2** | Rendering Star Labels in the DOM |
| **Exercise 3** | Click Event Handling & notifyOutputChanged |
| **Exercise 4** | Hover Effects & Visual Polish |
| **Exercise 5** | getOutputs, Disabled State & Cleanup |

---

## What is a PCF Control?

A PCF control is a reusable UI component that plugs directly into Power Apps. It is written in TypeScript, rendered as standard HTML/CSS, and communicates with the platform through a well-defined lifecycle API. The framework calls specific methods on your class at predictable times:

- **`init`** — called once when the control is first added to the page. Create all DOM elements here.
- **`updateView`** — called whenever the bound field value or context changes. Sync your UI to the new data here.
- **`getOutputs`** — called by the framework to read the value your control wants to write back to Dataverse.
- **`destroy`** — called when the control is removed. Clean up event listeners and references here.

> **ℹ️ Why This Matters**
>
> PCF controls do **NOT** manage their own state independently. The platform is the source of truth.
> Your control must always be ready to reflect whatever value `updateView` delivers — even if the user just changed it via a different form field or business rule.

---

## Table of Contents

- [Exercise 1 — Project Setup & Scaffolding](#exercise-1--project-setup--scaffolding)
  - [1.1 Prerequisites Check](#11-prerequisites-check)
  - [1.2 Create the PCF Project](#12-create-the-pcf-project)
  - [1.3 Understand the File Structure](#13-understand-the-file-structure)
  - [1.4 Declare Properties in the Manifest](#14-declare-properties-in-the-manifest)
  - [1.5 Verify the Build](#15-verify-the-build)
- [Exercise 2 — Rendering Stars in the DOM](#exercise-2--rendering-stars-in-the-dom)
  - [2.1 Class-Level Properties](#21-class-level-properties)
  - [2.2 Build the init Method](#22-build-the-init-method)
  - [2.3 Implement updateView for the Label](#23-implement-updateview-for-the-label)
  - [2.4 Add the Private Helper: _updateStarColors](#24-add-the-private-helper-_updatestarcolors)
  - [2.5 Test in the Harness](#25-test-in-the-harness)
- [Exercise 3 — Click Event Handling & notifyOutputChanged](#exercise-3--click-event-handling--notifyoutputchanged)
  - [3.1 How Values Flow Back to Dataverse](#31-how-values-flow-back-to-dataverse)
  - [3.2 Attach Click Handlers in init](#32-attach-click-handlers-in-init)
  - [3.3 Implement getOutputs](#33-implement-getoutputs)
  - [3.4 Test Click Behaviour](#34-test-click-behaviour)
- [Exercise 4 — Hover Effects & Visual Polish](#exercise-4--hover-effects--visual-polish)
  - [4.1 Add Hover Handlers in init](#41-add-hover-handlers-in-init)
  - [4.2 Review _updateStarColors With Hover Logic](#42-review-_updatestarcolors-with-hover-logic)
  - [4.3 Enhance the CSS Transitions](#43-enhance-the-css-transitions)
  - [4.4 Handle Disabled State Visually](#44-handle-disabled-state-visually)
  - [4.5 Test Hover Behaviour](#45-test-hover-behaviour)
- [Exercise 5 — getOutputs, Disabled State & Cleanup](#exercise-5--getoutputs-disabled-state--cleanup)
  - [5.1 The Complete getOutputs Implementation](#51-the-complete-getoutputs-implementation)
  - [5.2 The destroy Method](#52-the-destroy-method)
  - [5.3 The Complete index.ts](#53-the-complete-indexts)
  - [5.4 Deploy to Power Apps](#54-deploy-to-power-apps)
- [Summary & Key Concepts](#summary--key-concepts)
- [Challenge Extensions](#challenge-extensions)

---

## Exercise 1 — Project Setup & Scaffolding

In this exercise you will scaffold a new PCF project, install dependencies, and understand the generated file structure before writing a single line of custom code.

### 1.1 Prerequisites Check

Open a terminal and verify the following tools are installed:

```bash
node --version   # must be 16 or higher
pac --version    # Power Platform CLI
npm --version    # Node package manager
```

> **⚠️ Important**
>
> If `pac` is not found, install the Power Platform CLI first:
> ```bash
> npm install -g @microsoft/powerapps-cli
> ```
> Close and reopen your terminal after installation.

### 1.2 Create the PCF Project

Run the following commands to create a new folder and scaffold the control:

```bash
mkdir StarRatingControl
cd StarRatingControl
pac pcf init --namespace Contoso --name StarRating --template field
npm install
```

> **ℹ️ Why This Matters**
>
> - `--namespace`: A logical grouping prefix (your company name is a good choice).
> - `--name`: The component's unique identifier inside that namespace.
> - `--template field`: Tells the CLI you are building a control for a single field value.
> - Use `'dataset'` only when your control renders a full list/table of records.

> **✅ Best Practice**
>
> Always use PascalCase for `--name` and `--namespace`. Spaces and hyphens are not allowed and will cause import errors later.
> Example: `--namespace MyCompany --name StarRating`

### 1.3 Understand the File Structure

Open the folder in VS Code (`code .`). The key files are:

```
StarRatingControl/
├── ControlManifest.Input.xml   ← declares properties bound to Dataverse
├── index.ts                    ← your control class (all logic lives here)
├── generated/ManifestTypes.ts  ← auto-generated -- do NOT edit manually
├── package.json
└── tsconfig.json
```

> **✅ Best Practice**
>
> Never edit files inside the `generated/` folder. They are regenerated every time you run `'npm run refreshTypes'` and any manual changes will be lost.

### 1.4 Declare Properties in the Manifest

Open `ControlManifest.Input.xml` and replace the default property block with the two properties below. These tell the framework which Dataverse fields to bind to.

```xml
<property name="rating"
  display-name-key="Rating"
  description-key="The numeric 1-5 star value"
  of-type="Whole.None"
  usage="bound"
  required="false" />

<property name="label"
  display-name-key="Label"
  description-key="Text shown beside the stars"
  of-type="SingleLine.Text"
  usage="input"
  required="false" />
```

> **ℹ️ Why This Matters**
>
> - `usage='bound'` means the control can both **READ** and **WRITE** this field.
> - `usage='input'` means the control can only **READ** the value — it is configuration only.
> - Use `'bound'` for the rating value because we need `getOutputs` to write it back.
> - Use `'input'` for the label because the control never changes it.

After saving the manifest, regenerate the TypeScript types:

```bash
npm run refreshTypes
```

This updates `generated/ManifestTypes.ts` so that `context.parameters.rating` and `context.parameters.label` are fully typed and IntelliSense-aware.

### 1.5 Verify the Build

```bash
npm run build
```

You should see `'Build succeeded'` with 0 errors. If you see errors about unknown properties, double-check the spelling in the manifest — property names are case-sensitive.

> **💡 Tip**
>
> Keep a terminal running `'npm start watch'` during development. It rebuilds automatically on every save and reloads the test harness in your browser.

---

## Exercise 2 — Rendering Stars in the DOM

In this exercise you will implement the `init` method to create a container div and five star elements. You will also display a label beside the stars and understand why DOM creation belongs in `init` rather than `updateView`.

### 2.1 Class-Level Properties

Open `index.ts`. At the top of the class body (before the constructor), declare these instance variables:

```typescript
private _container: HTMLDivElement;
private _stars: HTMLSpanElement[] = [];
private _label: HTMLSpanElement;
private _value: number = 0;
private _hoverValue: number = 0;
private _notifyOutputChanged: () => void;
```

> **✅ Best Practice**
>
> Prefix private members with an underscore (`_`). This is a widely adopted TypeScript convention that makes it instantly clear at a glance that a variable is not part of the public API. It also prevents accidental name collisions with framework-provided properties.

### 2.2 Build the init Method

Replace the generated `init` method stub with the code below. Read each comment carefully — every decision is intentional.

```typescript
public init(
  context: ComponentFramework.Context<IInputs>,
  notifyOutputChanged: () => void,
  state: ComponentFramework.Dictionary,
  container: HTMLDivElement
): void {

  // Store the callback -- we call it after the user clicks a star
  this._notifyOutputChanged = notifyOutputChanged;

  // ── Container ──────────────────────────────────────────
  this._container = document.createElement('div');
  this._container.style.cssText = [
    'display: flex',
    'align-items: center',
    'gap: 6px',
    'padding: 4px 0',
    'font-family: Segoe UI, sans-serif',
  ].join(';');

  // ── Stars ───────────────────────────────────────────────
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.textContent = '★'; // Unicode filled star
    star.dataset.index = String(i); // store the rating value on the element
    star.style.cssText = [
      'font-size: 36px',
      'cursor: pointer',
      'color: #cccccc',
      'transition: color 0.15s ease, transform 0.1s ease',
      'user-select: none',
      'line-height: 1',
    ].join(';');

    this._stars.push(star);
    this._container.appendChild(star);
  }

  // ── Label ───────────────────────────────────────────────
  this._label = document.createElement('span');
  this._label.style.cssText = [
    'font-size: 13px',
    'font-weight: 600',
    'color: #333333',
    'margin-left: 4px',
  ].join(';');

  this._container.appendChild(this._label);
  container.appendChild(this._container);
}
```

> **ℹ️ Why This Matters**
>
> **Why create DOM elements in `init` instead of `updateView`?**
>
> `updateView` can fire dozens of times during a form's lifetime (field changes, saves, business rules, window resizes). Creating elements inside it would create thousands of duplicate nodes that accumulate in memory.
>
> `init` fires **exactly once**. Create the structure there, then use `updateView` to update only the data-dependent parts (colors, text). This is the **single most important performance rule** in PCF development.

> **✅ Best Practice**
>
> Use `star.dataset.index = String(i)` to embed the rating value on the element itself. This means click and hover handlers can read `event.currentTarget.dataset.index` instead of relying on a closure variable capturing `i`. Closures over loop variables are a classic JavaScript bug source — data attributes are safer and more explicit.

### 2.3 Implement updateView for the Label

Add the following implementation to the `updateView` method so the label text is always in sync with what Power Apps configures:

```typescript
public updateView(context: ComponentFramework.Context<IInputs>): void {
  // Sync the bound rating value from Dataverse
  this._value = context.parameters.rating.raw ?? 0;

  // Sync the label text; fall back gracefully if not configured
  const rawLabel = context.parameters.label.raw ?? '';
  this._label.textContent = rawLabel.trim() || 'Rate';

  // Refresh star colors to match the current value
  this._updateStarColors();
}
```

> **✅ Best Practice**
>
> Use the **nullish coalescing operator** (`??`) rather than the OR operator (`||`).
>
> `context.parameters.rating.raw` could legitimately be `0` (no rating yet).
> With `||`, `0` would be treated as falsy and replaced with your fallback — a subtle but real bug.
> With `??`, only `null` and `undefined` trigger the fallback.

### 2.4 Add the Private Helper: `_updateStarColors`

Add this private method to the class. It is called from `updateView` and later from the click and hover handlers:

```typescript
private _updateStarColors(): void {
  // Hover takes visual priority; fall back to the committed click value
  const activeValue = this._hoverValue || this._value;

  this._stars.forEach((star, index) => {
    const starNumber = index + 1;
    const isActive = starNumber <= activeValue;

    star.style.color = isActive ? '#FFB900' : '#CCCCCC';
    star.style.transform = isActive ? 'scale(1.15)' : 'scale(1)';
  });
}
```

> **💡 Tip**
>
> The `scale` transform on active stars gives a subtle 'pop' that makes the control feel premium without any images or extra libraries. CSS transitions (added in `init`) handle the animation automatically.

### 2.5 Test in the Harness

```bash
npm start watch
```

A browser window opens showing the test harness. You should see five grey stars followed by the label `'Rate'`. In the **Data Inputs** panel on the right, change the `rating` value to `3` and press Tab. Three stars should turn gold. If they do, proceed to Exercise 3.

---

## Exercise 3 — Click Event Handling & notifyOutputChanged

In this exercise you will wire up click events so the user can select a rating. You will also learn the role of `notifyOutputChanged` and `getOutputs` in the PCF data-writing pipeline.

### 3.1 How Values Flow Back to Dataverse

Before writing code, it is important to understand the data-write lifecycle:

| # | Who acts | What happens |
|---|---|---|
| **1** | Your code | User clicks star → you update `_value` → you call `notifyOutputChanged()` |
| **2** | Framework | Calls `getOutputs()` on your class to collect the new value |
| **3** | Framework | Writes the returned value to the bound Dataverse field |
| **4** | Framework | Calls `updateView()` with the updated context so your UI stays in sync |

> **⚠️ Important**
>
> **Never skip `notifyOutputChanged()`**. If you update `_value` but forget to call it, the framework never calls `getOutputs()`, the field value in Dataverse never changes, and your control will be silently out of sync with the form.

### 3.2 Attach Click Handlers in init

Inside the star-creation loop (before `this._stars.push(star)`), add the click handler:

```typescript
// ── Click handler ──────────────────────────────────────
star.addEventListener('click', () => {
  // Respect the disabled state set by Power Apps
  if (context.mode.isControlDisabled) return;

  // Read the rating from the element itself -- no closure needed
  this._value = parseInt(star.dataset.index!, 10);

  // Signal the framework that a new output is ready
  this._notifyOutputChanged();

  // Immediately update the UI for responsiveness
  this._updateStarColors();
});
```

> **✅ Best Practice**
>
> **Why call `_updateStarColors()` after `notifyOutputChanged()`?**
>
> `notifyOutputChanged` triggers a framework cycle that eventually calls `updateView`, but that round-trip can take a perceptible moment. Calling `_updateStarColors()` immediately gives the user **instant visual feedback** so the app feels snappy.
> When `updateView` arrives a moment later, it simply confirms the same state — no flicker.

### 3.3 Implement getOutputs

Replace the generated `getOutputs` stub with this implementation:

```typescript
public getOutputs(): IOutputs {
  return {
    rating: this._value,
  };
}
```

> **ℹ️ Why This Matters**
>
> `getOutputs` must return an object whose keys exactly match the `'bound'` property names declared in `ControlManifest.Input.xml`. In our case that is `'rating'`.
>
> The framework calls this method every time `notifyOutputChanged()` fires. Keep it **lean** — just return the current values. Do not call APIs or mutate state here.

> **⚠️ Important**
>
> Do **NOT** include `'label'` in `getOutputs`. It was declared as `usage='input'`, which means the control only reads it. Attempting to write an input property causes a runtime error.

### 3.4 Test Click Behaviour

Back in the test harness, click different stars. The following should happen:

1. The clicked star and all stars to its left turn gold.
2. The **Data Outputs** panel on the right shows the updated rating value.
3. Changing the rating input in **Data Inputs** to a different number updates the stars to match (simulating an external `updateView` call).

> **💡 Tip**
>
> The test harness simulates Data Inputs → `updateView` and Data Outputs ← `getOutputs` automatically. Use it to verify that your control handles both read and write paths before deploying to a real environment.

---

## Exercise 4 — Hover Effects & Visual Polish

In this exercise you will add hover behaviour so stars light up as the mouse moves over them, then reset to the committed value when the mouse leaves. You will also apply a small scale animation for a premium look.

### 4.1 Add Hover Handlers in init

Inside the star-creation loop, directly after the click handler, add:

```typescript
// ── Mouse enter: preview this star's rating ─────────────
star.addEventListener('mouseenter', () => {
  if (context.mode.isControlDisabled) return;
  this._hoverValue = parseInt(star.dataset.index!, 10);
  this._updateStarColors();
});

// ── Mouse leave: cancel preview, revert to committed value
star.addEventListener('mouseleave', () => {
  this._hoverValue = 0; // 0 means 'no hover active'
  this._updateStarColors();
});
```

> **ℹ️ Why This Matters**
>
> **Why use a separate `_hoverValue` instead of temporarily modifying `_value`?**
>
> `_value` is your ground truth — the number you return from `getOutputs`. If you mutate `_value` during hover and the framework calls `getOutputs` before the user clicks, a wrong value gets written to Dataverse.
> Keeping hover state in a separate field (`_hoverValue`) ensures the committed and preview states never collide.

### 4.2 Review `_updateStarColors` With Hover Logic

Your `_updateStarColors` method already handles hover correctly via this line:

```typescript
const activeValue = this._hoverValue || this._value;
```

When `_hoverValue` is `0` (non-zero is truthy, `0` is falsy), it falls back to `_value`. When the mouse is over star 3, `_hoverValue` is `3` and takes priority. This single line cleanly encodes the priority rule without any `if/else` branching.

> **✅ Best Practice**
>
> Keep helper methods like `_updateStarColors` small and single-purpose. Both the click handler and the hover handlers call it without needing to know its internals. If you ever need to change the color logic (e.g., support a custom accent color property), there is only **one place to update**.

### 4.3 Enhance the CSS Transitions

The transition style you added in Exercise 2 already animates color and scale. Verify it is correct:

```typescript
// Inside the star creation loop, inside star.style.cssText:
'transition: color 0.15s ease, transform 0.1s ease',
```

The `0.15s` on color gives a soft fade. The `0.1s` on transform gives a snappier scale pop. These different durations make the effect feel layered rather than mechanical.

> **💡 Tip**
>
> Keep transition durations short for interactive elements (100–200ms). Longer transitions feel sluggish and users often try clicking again before the animation finishes.

### 4.4 Handle Disabled State Visually

When Power Apps marks the control as disabled (read-only field, locked form), the stars should look muted. Update `updateView` to apply the disabled state:

```typescript
// Update the signature of updateView to pass disabled state:
public updateView(context: ComponentFramework.Context<IInputs>): void {
  this._value = context.parameters.rating.raw ?? 0;

  const rawLabel = context.parameters.label.raw ?? '';
  this._label.textContent = rawLabel.trim() || 'Rate';

  const isDisabled = context.mode.isControlDisabled;
  this._container.style.opacity = isDisabled ? '0.55' : '1';
  this._container.style.pointerEvents = isDisabled ? 'none' : 'auto';

  this._updateStarColors();
}
```

> **✅ Best Practice**
>
> Using `pointer-events: none` on the container is **safer** than adding `if (disabled) return` inside every event handler. One CSS property disables all mouse interaction at once. It also avoids bugs where a new event handler is added later without the disabled check.
> `opacity: 0.55` gives a visual hint without making the stars invisible.

### 4.5 Test Hover Behaviour

In the test harness, slowly move your mouse across the stars from left to right. Verify:

1. Stars light up progressively as you hover from star 1 to star 5.
2. Moving back left dims the stars on the right.
3. Moving the mouse off all stars entirely reverts to the previously clicked value.
4. Clicking star 3 then hovering over star 5 shows 5 lit stars, but only 3 are committed (check Data Outputs).
5. In the Data Inputs panel, set `isControlDisabled` to `true`. The stars should dim and not respond to mouse events.

---

## Exercise 5 — getOutputs, Disabled State & Cleanup

In this final exercise you will wire up the complete output pipeline, handle edge cases, and implement the `destroy` method to avoid memory leaks.

### 5.1 The Complete getOutputs Implementation

Here is the final `getOutputs` method with a guard for out-of-range values:

```typescript
public getOutputs(): IOutputs {
  // Clamp to valid range -- defensive coding against unexpected state
  const safeValue = Math.max(0, Math.min(5, Math.round(this._value)));

  return {
    rating: safeValue,
  };
}
```

> **✅ Best Practice**
>
> Always **clamp and round** output values before returning them. If `_value` somehow ends up as `4.7` due to an external `updateView` call with a decimal, `Math.round` gives `5`. `Math.max/min` prevents values like `-1` or `99` from reaching Dataverse.
> Defensive coding here saves hours of debugging data corruption issues later.

### 5.2 The destroy Method

The `destroy` method is called when the control is removed from the page. Because we attached event listeners to DOM elements that we created ourselves, the garbage collector can clean them up automatically when the elements are removed. However, if you use **global listeners** (e.g., `document.addEventListener`), they must be removed manually:

```typescript
// Store bound handler references so they can be removed later
private _boundKeyHandler: (e: KeyboardEvent) => void;

// In init:
this._boundKeyHandler = (e: KeyboardEvent) => this._handleKeyboard(e);
document.addEventListener('keydown', this._boundKeyHandler);

// In destroy:
public destroy(): void {
  document.removeEventListener('keydown', this._boundKeyHandler);
}
```

> **⚠️ Important**
>
> Forgetting to remove global event listeners is one of the **most common memory leak sources** in PCF controls. Each time the form reloads without destroying the old control properly, a new listener is added on top of the old one.
>
> In our control, local element listeners clean themselves up — but always audit any `document.addEventListener` or `window.addEventListener` calls.

### 5.3 The Complete index.ts

Below is the full, production-ready implementation combining all exercises. Use this as your reference to verify your work:

```typescript
import { IInputs, IOutputs } from './generated/ManifestTypes';

export class StarRating implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  private _container: HTMLDivElement;
  private _stars: HTMLSpanElement[] = [];
  private _label: HTMLSpanElement;
  private _value: number = 0;
  private _hoverValue: number = 0;
  private _notifyOutputChanged: () => void;

  constructor() {}

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {

    this._notifyOutputChanged = notifyOutputChanged;

    this._container = document.createElement('div');
    this._container.style.cssText = [
      'display:flex', 'align-items:center', 'gap:6px',
      'padding:4px 0', 'font-family:Segoe UI,sans-serif',
    ].join(';');

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = '★';
      star.dataset.index = String(i);
      star.style.cssText = [
        'font-size:36px', 'cursor:pointer', 'color:#cccccc',
        'transition:color 0.15s ease,transform 0.1s ease',
        'user-select:none', 'line-height:1',
      ].join(';');

      star.addEventListener('click', () => {
        if (context.mode.isControlDisabled) return;
        this._value = parseInt(star.dataset.index!, 10);
        this._notifyOutputChanged();
        this._updateStarColors();
      });

      star.addEventListener('mouseenter', () => {
        if (context.mode.isControlDisabled) return;
        this._hoverValue = parseInt(star.dataset.index!, 10);
        this._updateStarColors();
      });

      star.addEventListener('mouseleave', () => {
        this._hoverValue = 0;
        this._updateStarColors();
      });

      this._stars.push(star);
      this._container.appendChild(star);
    }

    this._label = document.createElement('span');
    this._label.style.cssText = [
      'font-size:13px', 'font-weight:600',
      'color:#333333', 'margin-left:4px',
    ].join(';');

    this._container.appendChild(this._label);
    container.appendChild(this._container);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._value = context.parameters.rating.raw ?? 0;

    const rawLabel = context.parameters.label.raw ?? '';
    this._label.textContent = rawLabel.trim() || 'Rate';

    const isDisabled = context.mode.isControlDisabled;
    this._container.style.opacity = isDisabled ? '0.55' : '1';
    this._container.style.pointerEvents = isDisabled ? 'none' : 'auto';

    this._updateStarColors();
  }

  private _updateStarColors(): void {
    const activeValue = this._hoverValue || this._value;

    this._stars.forEach((star, index) => {
      const n = index + 1;
      star.style.color = n <= activeValue ? '#FFB900' : '#CCCCCC';
      star.style.transform = n <= activeValue ? 'scale(1.15)' : 'scale(1)';
    });
  }

  public getOutputs(): IOutputs {
    const safeValue = Math.max(0, Math.min(5, Math.round(this._value)));
    return { rating: safeValue };
  }

  public destroy(): void {
    // Local element listeners are cleaned up by the GC with the DOM.
    // Add removeEventListener calls here for any global listeners.
  }
}
```

### 5.4 Deploy to Power Apps

When you are satisfied with the harness results, package and push the control:

```bash
# Build a release bundle
npm run build -- --buildMode production

# Create the solution zip
cd ..
mkdir Solution && cd Solution
pac solution init --publisher-name Contoso --publisher-prefix con
pac solution add-reference --path ../StarRatingControl
dotnet build
```

```bash
# Push to your environment (must be authenticated via pac auth create)
pac pcf push --publisher-prefix con
```

> **💡 Tip**
>
> `pac pcf push` deploys the control directly to the connected environment without creating a managed solution. Use it for rapid dev/test iteration. For production deployments, use the full solution build pipeline above.

---

## Summary & Key Concepts

Congratulations on completing the Star Rating PCF Lab! Here is a reference summary of every key concept covered:

| **Concept** | **Why It Matters** |
|---|---|
| **DOM creation in `init`** | Prevents performance-killing element accumulation on repeated `updateView` calls |
| **`??` vs `\|\|`** | Safely handles the value `0` — use `??` when `0` is a valid business value |
| **`_hoverValue` separation** | Keeps preview state separate from committed state; prevents silent data writes |
| **`dataset.index` on elements** | Eliminates risky closure-over-loop-variable bugs in event handlers |
| **`notifyOutputChanged()`** | The mandatory signal that triggers `getOutputs` → Dataverse write pipeline |
| **`getOutputs()`** | The single source of truth for what value the control wants to write back |
| **`pointer-events: none`** | One property disables all mouse interaction vs. per-handler if-checks |
| **`destroy()`** | Prevents memory leaks from global event listeners on long-lived forms |
| **`isControlDisabled` check** | Respects Power Apps security model; fields can be locked by business rules |
| **CSS transitions in `init`** | Declared once, applied automatically by the browser on every style change |

---

## Challenge Extensions

If you finish early, try these enhancements to deepen your understanding:

- **Half-star support:** Divide each star span into two halves using CSS. Track a fractional `_value` (e.g., `3.5`).
- **Custom star count:** Add a `'starCount'` input property to the manifest and loop to that number instead of hardcoding 5.
- **Keyboard navigation:** Add `ArrowLeft`/`ArrowRight` key handlers so the control is accessible without a mouse.
- **Color theming:** Add `'activeColor'` and `'inactiveColor'` input properties and use them in `_updateStarColors`.
- **Tooltip on hover:** Set `star.title = \`${i} out of 5 stars\`` in the creation loop to add browser-native tooltips.

---

*— End of Lab —*
