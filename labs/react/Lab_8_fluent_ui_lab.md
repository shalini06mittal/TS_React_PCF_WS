# Fluent UI — Developer Lab Guide
### React · Vite · TypeScript · PCF

---

| **Who this is for** | **What you will learn** | **Prerequisites** |
|---|---|---|
| Developers new to Fluent UI who will build PCF controls for Power Apps. | Design tokens, components, props, slots, React setup, and PCF integration. | Basic JavaScript / TypeScript. Node.js installed. VS Code recommended. |

---

## Table of Contents

- [Module 1 — What is Fluent UI?](#module-1--what-is-fluent-ui)
  - [Versions — Which One to Use?](#versions--which-one-to-use)
- [Module 2 — Core Fluent UI Concepts & Terminology](#module-2--core-fluent-ui-concepts--terminology)
  - [Design Tokens](#design-tokens)
  - [Token Categories](#token-categories)
  - [FluentProvider — The Root Wrapper](#fluentprovider--the-root-wrapper)
  - [Available Built-in Themes](#available-built-in-themes)
  - [Props](#props)
  - [Common Prop Patterns Across Fluent Components](#common-prop-patterns-across-fluent-components)
  - [Slots](#slots)
  - [Slots vs Props — Quick Comparison](#slots-vs-props--quick-comparison)
  - [makeStyles — Writing Your Own Styles](#makestyles--writing-your-own-styles)
  - [Compound Components](#compound-components)
  - [Other Compound Components in Fluent UI](#other-compound-components-in-fluent-ui)
- [Module 3 — Finding Components & Reading the Docs](#module-3--finding-components--reading-the-docs)
  - [Primary Resources](#primary-resources)
  - [How to Read a Component's Storybook Page](#how-to-read-a-components-storybook-page)
  - [Component Categories at a Glance](#component-categories-at-a-glance)
- [Module 4 — React + Vite + TypeScript Project Setup](#module-4--react--vite--typescript-project-setup)
  - [Step 1 — Scaffold the Project](#step-1--scaffold-the-project)
  - [Step 2 — Install Fluent UI](#step-2--install-fluent-ui)
  - [Step 3 — Project Structure](#step-3--project-structure)
  - [Step 4 — Wrap Your App with FluentProvider](#step-4--wrap-your-app-with-fluentprovider)
  - [Step 5 — Build a Component with Types](#step-5--build-a-component-with-types)
  - [Development Commands](#development-commands)
- [Quick Reference Card](#quick-reference-card)
  - [Glossary](#glossary)
  - [Essential Links](#essential-links)
  - [Install Commands Summary](#install-commands-summary)

---

# Module 1 — What is Fluent UI?

Fluent UI is Microsoft's open-source design system — the same component library used to build Office 365, Microsoft Teams, and the Azure Portal. Think of it as a professional LEGO kit: pre-built, accessible, and themeable building blocks that follow Microsoft's Fluent Design Language so you don't have to design from scratch.

> **Key idea:** Every Fluent UI component is accessible (WCAG 2.1), keyboard-navigable, and themeable out of the box. You get professional UI quality without building it yourself.

---

## Versions — Which One to Use?

| | **Fluent UI React v8** | **Fluent UI React v9 (recommended)** |
|---|---|---|
| **Style** | Class-based, older API | Hooks-based, modern React |
| **Status** | Legacy / maintenance | Current — use this for all new work |
| **Package** | `@fluentui/react` | `@fluentui/react-components` |

> **Note:** This entire lab focuses on Fluent UI v9 (`@fluentui/react-components`). All code examples and references use v9 unless explicitly stated otherwise.

---

# Module 2 — Core Fluent UI Concepts & Terminology

Before writing a single line of code, you need to understand the vocabulary of Fluent UI. These terms appear everywhere in the documentation, prop tables, and GitHub discussions.

---

## Design Tokens

A design token is a named variable that stores a visual decision — a color, a spacing value, a font size, a border radius. Instead of hardcoding `#0078D4` everywhere, the system uses a token like `colorBrandForeground1` which resolves to the correct value for the active theme.

> **Analogy:** Think of tokens like CSS custom properties (`--color-primary`). They are the single source of truth for every visual value. Change the theme, and all tokens update simultaneously — no find-and-replace needed.

---

### Token Categories

| **Token** | **Type / Value** | **Description** |
|---|---|---|
| `colorBrandForeground1` | Hex color | Primary brand blue — used for interactive text, links, active states |
| `colorNeutralBackground1` | Hex color | Main surface background — white in light theme, dark in dark theme |
| `colorNeutralForeground1` | Hex color | Primary body text color |
| `fontSizeBase300` | 14px | Default body text size across components |
| `fontWeightSemibold` | 600 | Semi-bold weight used in labels and headings |
| `spacingHorizontalM` | 12px | Medium horizontal spacing — gap between items |
| `spacingVerticalL` | 16px | Large vertical spacing — section padding |
| `borderRadiusMedium` | 4px | Default corner radius for inputs, cards, buttons |
| `shadow4` | CSS box-shadow | Elevation shadow used on floating elements like menus |

```ts
// Accessing tokens in your own styles with makeStyles
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  myBox: {
    backgroundColor: tokens.colorNeutralBackground2,
    color:           tokens.colorNeutralForeground1,
    padding:         tokens.spacingVerticalL,
    borderRadius:    tokens.borderRadiusMedium,
  }
});
```

> **Where to find all tokens:** Visit the Fluent UI token reference at [react.fluentui.dev](https://react.fluentui.dev) — search 'Design Tokens' in the left sidebar. The page lists every token with its light/dark/high-contrast values.

---

## FluentProvider — The Root Wrapper

All Fluent UI components must live inside a `FluentProvider`. This wrapper injects the theme tokens into the React context so every component below it can access colors, spacing, and typography automatically.

```tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

// Wrap your entire app (or a section of it)
export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      {/* All Fluent components go here */}
      <MyComponent />
    </FluentProvider>
  );
}
```

### Available Built-in Themes

| **Theme** | **Type** | **Description** |
|---|---|---|
| `webLightTheme` | Default | White backgrounds, Microsoft blue accents — standard web app |
| `webDarkTheme` | Default | Dark backgrounds — for dark mode web apps |
| `teamsLightTheme` | Teams | Matches Microsoft Teams light UI |
| `teamsDarkTheme` | Teams | Matches Microsoft Teams dark UI |
| `teamsHighContrastTheme` | Teams | High contrast for accessibility — required for Teams apps |

---

## Props

Props (properties) are inputs you pass to a component to control its appearance and behaviour — exactly like HTML attributes but typed in TypeScript.

```tsx
// These are all props on the Button component:
<Button
  appearance='primary'       // visual style
  size='medium'              // padding / font size
  disabled={false}           // boolean — disables interaction
  icon={<SaveRegular />}     // React element — icon before/after text
  onClick={() => save()}     // event handler function
>
  Save Record
</Button>
```

### Common Prop Patterns Across Fluent Components

| **Prop / Term** | **Type / Value** | **Description** |
|---|---|---|
| `appearance` | `'primary'` \| `'outline'` \| `'subtle'` \| `'transparent'` | Visual weight / fill style of the component |
| `size` | `'small'` \| `'medium'` \| `'large'` | Controls padding and font size |
| `disabled` | `boolean` | Disables the control; adds `aria-disabled` automatically |
| `shape` | `'rounded'` \| `'circular'` \| `'square'` | Corner shape — available on Button, Avatar, Badge |
| `checked` | `boolean` | Controlled checked state for Checkbox, Radio, Switch |
| `onChange` | `(ev, data) => void` | Fires when value changes — `data` contains the new value |
| `defaultValue` | `string \| number` | Uncontrolled initial value (Fluent manages state internally) |
| `value` | `string \| number` | Controlled value — you manage state with `useState` |
| `placeholder` | `string` | Hint text shown when the field is empty |

---

## Slots

A slot is a named sub-part of a component that you can customise independently. Instead of props that accept primitive values, slots accept React elements — giving you full control over a component's internal structure.

> **Analogy:** Imagine a Button as a container with labelled holes (slots): an `'icon'` hole on the left and a `'content'` hole in the centre. You drop your own React element into whichever hole you want to fill.

```tsx
// Button has an 'icon' slot
<Button icon={<AddCircleRegular />} iconPosition='before'>
  Add Item
</Button>

// Avatar has 'image', 'badge', and 'initials' slots
<Avatar
  name='Priya Sharma'
  badge={{ status: 'available' }}   // fills the 'badge' slot
  image={{ src: '/priya.jpg' }}     // fills the 'image' slot
/>

// Slots also accept style / className / children overrides:
<Input
  contentBefore={{ children: <SearchRegular /> }}   // fills contentBefore slot
  contentAfter={{ children: <DismissRegular /> }}   // fills contentAfter slot
/>
```

### Slots vs Props — Quick Comparison

| | **Props** | **Slots** |
|---|---|---|
| **Accept** | Primitive values — strings, booleans, numbers, functions | React elements and objects with `children` / `className` / `style` |
| **Used for** | Configuring behaviour and appearance from the outside | Replacing or extending a part of the component's rendered HTML |
| **Example** | `size='large'` `disabled={true}` | `icon={<SaveRegular />}` |

---

## makeStyles — Writing Your Own Styles

Fluent UI v9 uses **Griffel**, a CSS-in-JS engine that generates atomic CSS classes at build time. You write styles using the `makeStyles` hook — similar to Material UI's `sx`, but pre-compiled for performance.

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    padding:         tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius:    tokens.borderRadiusMedium,
    boxShadow:       tokens.shadow4,
    ':hover': { boxShadow: tokens.shadow8 },   // pseudo-selectors
  },
  title: {
    fontSize:   tokens.fontSizeBase400,         // 16px
    fontWeight: tokens.fontWeightSemibold,
    color:      tokens.colorNeutralForeground1,
  }
});

export function MyCard() {
  const classes = useStyles();
  return (
    <div className={classes.card}>
      <span className={classes.title}>Hello</span>
    </div>
  );
}
```

> **Why not just use `className` with a CSS file?** You can — Fluent UI doesn't prevent it. But `makeStyles` integrates directly with the theme token system, meaning your custom styles automatically respect theme changes (light/dark/high-contrast) without any extra work.

---

## Compound Components

Some Fluent components are too complex for a single JSX tag. They split into named sub-components that you compose together. This is called the **compound components pattern**.

```tsx
// Dialog is a compound component — it has named parts:
import {
  Dialog, DialogTrigger, DialogSurface,
  DialogTitle, DialogBody, DialogActions, Button
} from '@fluentui/react-components';

<Dialog>
  <DialogTrigger disableButtonEnhancement>
    <Button>Open</Button>          {/* anything that triggers open */}
  </DialogTrigger>

  <DialogSurface>                  {/* the floating panel */}
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogBody>Are you sure? This cannot be undone.</DialogBody>

    <DialogActions>
      <DialogTrigger>
        <Button appearance='secondary'>Cancel</Button>
      </DialogTrigger>
      <Button appearance='primary' onClick={handleDelete}>Delete</Button>
    </DialogActions>
  </DialogSurface>
</Dialog>
```

### Other Compound Components in Fluent UI

- `Menu` / `MenuTrigger` / `MenuPopover` / `MenuList` / `MenuItem`
- `Accordion` / `AccordionItem` / `AccordionHeader` / `AccordionPanel`
- `Tabs` / `Tab` / `TabList`
- `Popover` / `PopoverTrigger` / `PopoverSurface`
- `Drawer` / `DrawerHeader` / `DrawerBody` / `DrawerFooter`

---

# Module 3 — Finding Components & Reading the Docs

## Primary Resources

| Resource | URL | Description |
|---|---|---|
| **Storybook** | [react.fluentui.dev](https://react.fluentui.dev) | Live component demos, interactive controls panel, full prop reference. Your first stop for any component. |
| **GitHub** | [github.com/microsoft/fluentui](https://github.com/microsoft/fluentui) | Source code, TypeScript types, issue tracker, migration guides, and changelogs. |
| **Design Docs** | [fluent2.microsoft.design](https://fluent2.microsoft.design) | Design principles, Figma kits, motion specifications, accessibility guidelines, and token reference. |
| **Icon Catalog** | [react.fluentui.dev/icons-catalog](https://react.fluentui.dev/?path=/docs/icons-catalog--docs) | Browse 2,500+ icons, get the import name, choose Regular vs Filled. |

> **Quick tip:** In Storybook, press the `/` key to open search. Type any component name and you'll jump directly to its docs page.

---

## How to Read a Component's Storybook Page

1. **Usage tab** — Shows the import statement and a minimal working example. Always start here.
2. **Stories (sidebar items)** — Each story is one variant. Click through them to see Default, Primary, Outline, Disabled, With Icon etc. The code is shown below the preview.
3. **Controls panel (bottom)** — Every prop becomes an interactive knob. Toggle, type, or select values to see the preview update live — no code required.
4. **Docs tab** — Lists every prop with its TypeScript type, default value, and description. Click a complex type to see its definition.
5. **Accessibility section** — Shows which ARIA attributes are applied automatically, and when you need to add your own (e.g. `aria-label` for icon-only buttons).

---

## Component Categories at a Glance

| **Actions** | **Input & Selection** | **Layout & Display** |
|---|---|---|
| Button | Input / Textarea | DataGrid / Table |
| SplitButton | Dropdown / Combobox | Card / Divider |
| ToggleButton | Checkbox / Radio | Dialog / Drawer |
| Menu | Switch / Slider | Toast / Spinner |
| Toolbar | DatePicker / TimePicker | Avatar / Badge / Tag |

> **Icons package:** Install separately: `npm install @fluentui/react-icons`. Import by name — e.g. `import { SaveRegular, DeleteFilled } from '@fluentui/react-icons'`. The suffix `Regular` = outline, `Filled` = solid.

---

# Module 4 — React + Vite + TypeScript Project Setup

Vite is a modern build tool that starts instantly (no bundling on start), uses ES modules natively, and produces lean production builds. It replaces the older Create React App workflow.

---

## Step 1 — Scaffold the Project

```bash
# In your terminal — creates a new project folder
npm create vite@latest my-fluent-app -- --template react-ts

cd my-fluent-app

npm install
```

The `react-ts` template gives you React 18 + TypeScript pre-configured. No extra setup needed.

---

## Step 2 — Install Fluent UI

```bash
npm install @fluentui/react-components

npm install @fluentui/react-icons   # optional but recommended
```

---

## Step 3 — Project Structure

```
my-fluent-app/
├── src/
│   ├── main.tsx           ← React root mount point
│   ├── App.tsx            ← Wrap with FluentProvider here
│   └── components/        ← Your Fluent UI components live here
│       ├── MyForm.tsx
│       └── MyTable.tsx
├── index.html             ← Entry HTML
├── vite.config.ts         ← Vite config (rarely needs changes)
└── tsconfig.json          ← TypeScript config
```

---

## Step 4 — Wrap Your App with FluentProvider

<pre><code class="language-tsx">// src/App.tsx
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { MyForm } from './components/MyForm';

export default function App() {
  return (
<mark>    // FluentProvider MUST be an ancestor of every Fluent component
    &lt;FluentProvider theme={webLightTheme}&gt;
      &lt;MyForm /&gt;
    &lt;/FluentProvider&gt;</mark>
  );
}
</code></pre>

---

## Step 5 — Build a Component with Types

<pre><code class="language-tsx">// src/components/MyForm.tsx
import { useState } from 'react';
import {
<mark>  Button, Field, Input, Combobox, Option,
  makeStyles, tokens</mark>
} from '@fluentui/react-components';
import { SaveRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
<mark>  form: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalL },</mark>
});

export function MyForm() {
  const classes = useStyles();
  const [name,   setName]   = useState&lt;string&gt;('');
  const [status, setStatus] = useState&lt;string&gt;('');

  return (
    &lt;div className={classes.form}&gt;

<mark>      &lt;Field label='Full Name' required&gt;
        &lt;Input value={name} onChange={(_, d) =&gt; setName(d.value)} /&gt;
      &lt;/Field&gt;

      &lt;Field label='Status'&gt;
        &lt;Combobox value={status} onOptionSelect={(_, d) =&gt; setStatus(d.optionText ?? '')}&gt;
          &lt;Option&gt;Active&lt;/Option&gt;
          &lt;Option&gt;Inactive&lt;/Option&gt;
          &lt;Option&gt;Pending&lt;/Option&gt;
        &lt;/Combobox&gt;
      &lt;/Field&gt;

      &lt;Button appearance='primary' icon={&lt;SaveRegular /&gt;}&gt;
        Save
      &lt;/Button&gt;</mark>

    &lt;/div&gt;
  );
}
</code></pre>

---

## Development Commands

| **Command** | **Output** | **Description** |
|---|---|---|
| `npm run dev` | `localhost:5173` | Start dev server with hot module replacement (HMR) |
| `npm run build` | `/dist` folder | Build optimised production bundle |
| `npm run preview` | `localhost:4173` | Preview the production build locally before deploying |

> **Vite vs PCF bundler:** Vite is only for local development speed. When you deploy to PCF, the Power Platform CLI uses its own webpack-based bundler. Your Vite config does not affect the PCF build.

---

# Quick Reference Card

## Glossary

| Term | Definition |
|---|---|
| **Design Token** | A named variable (e.g. `colorBrandForeground1`) that stores a visual value. Changes with the theme. Never hardcode colors — always use tokens. |
| **FluentProvider** | The required wrapper component that injects the theme token context into all child Fluent components. |
| **Props** | Inputs you pass to a component (`<Button size='large' disabled>`). Control behaviour and appearance. |
| **Slots** | Named sub-parts of a component that accept React elements (`<Button icon={<SaveRegular />}>`). Let you replace internal parts. |
| **makeStyles** | A hook that creates Griffel-powered CSS-in-JS style rules using design tokens. The Fluent-native way to write custom styles. |
| **Compound Component** | A component split into named sub-components composed together (e.g. `Dialog` + `DialogTrigger` + `DialogSurface` + `DialogActions`). |

---

## Essential Links

| **Resource** | **URL** |
|---|---|
| Fluent UI Storybook (v9) | [react.fluentui.dev](https://react.fluentui.dev) |
| Fluent UI GitHub | [github.com/microsoft/fluentui](https://github.com/microsoft/fluentui) |
| Fluent 2 Design Site | [fluent2.microsoft.design](https://fluent2.microsoft.design) |
| Icon Catalog | [react.fluentui.dev/icons-catalog](https://react.fluentui.dev/?path=/docs/icons-catalog--docs) |

---

## Install Commands Summary

```bash
# New React + Vite + TypeScript project
npm create vite@latest my-app -- --template react-ts

# Fluent UI
npm install @fluentui/react-components
npm install @fluentui/react-icons
```

---

> **End of Lab — Happy Building!**
