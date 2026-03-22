# Lab 1 — Portfolio Management System

**React + TypeScript Fundamentals**

*Step-by-step from project setup to your first component.*

---

## Table of Contents

- [Lab 1 — Portfolio Management System](#lab-1--portfolio-management-system)
  - [Table of Contents](#table-of-contents)
  - [1. Creating a React project](#1-creating-a-react-project)
    - [a) Using Vite](#a-using-vite)
    - [b) Using create-react-app](#b-using-create-react-app)
  - [2. Understanding the folder structure](#2-understanding-the-folder-structure)
  - [3. The Virtual DOM](#3-the-virtual-dom)
  - [4. JSX basics — single vs multiple tags](#4-jsx-basics--single-vs-multiple-tags)
  - [5. Variables \& functions in a component](#5-variables--functions-in-a-component)
  - [6. Styling](#6-styling)
  - [7. ProfileCard Component](#7-profilecard-component)

---

## 1. Creating a React project

### a) Using Vite

We use Vite instead of the older Create React App because it's much faster — it starts your dev server in under a second. Think of Vite like a high-speed desk for your portfolio project where you can instantly see every change you make. Run these commands in your terminal:

```bash
# 1. Create the project
npm create vite@latest portfolio-app -- --template react-ts

# 2. Move into the project folder
cd portfolio-app

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

After `npm run dev`, open [http://localhost:5173](http://localhost:5173) in your browser. You'll see a spinning React logo — that's your app running live!

### b) Using create-react-app

```bash
# 1. Create the project
npx create-react-app portfolio-app --template typescript

# 2. Move into the project folder
cd portfolio-app

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

After `npm start`, browser will automatically open at [http://localhost:3000](http://localhost:3000). You'll see a spinning React logo — that's your app running live!

> 💡 **Why TypeScript?**
>
> The `--template react-ts` flag gives us TypeScript. In our portfolio system, TypeScript will help catch bugs early — for example, it'll warn you if you accidentally pass a number where a stock name (string) is expected.
>
> **Vite:** The build tool. Serves your files during development and bundles them for production.
>
> **npm:** Node Package Manager. Installs the libraries (React, TypeScript, etc.) your app needs.

---

## 2. Understanding the folder structure

After setup, you'll see these files:

| Path | Description |
|---|---|
| 📁 `portfolio-app` | The root folder. Contains all project files. |
| 📁 `src/` | Everything you write lives here. React components, styles, and utilities all go inside. |
| 📄 `App.tsx` | Your main component. This is where the overall layout of your portfolio dashboard lives. We will heavily edit this. |
| 📄 `main.tsx` | The entry point. It finds the `<div id="root">` in index.html and renders your App component into it. You rarely edit this. |
| 📄 `App.css` | Styles scoped to the App component. In the styling lesson (Step 6), you'll add classes here. |
| 📄 `index.css` | Global styles applied to the whole app — resets, font imports, body background. |
| 📄 `index.html` | The HTML shell. Notice `<div id="root"></div>` — that's where React mounts your entire app. |
| 📄 `package.json` | Lists all dependencies (React, TypeScript, Vite) and scripts (`npm run dev`, `npm run build`). |
| 📄 `tsconfig.json` | TypeScript configuration. Tells the TS compiler which files to check and how strict to be. |
| 📄 `vite.config.ts` | Vite build settings. Out of the box it works fine — you'd only change this for advanced setups. |

> 🎯 **Rule of thumb**
>
> For the first few labs, you'll only ever touch files inside **`src/`**. Everything else is configuration that Vite manages for you.

---

## 3. The Virtual DOM

The browser has a real DOM — a tree of HTML elements. Updating it directly is slow. React solves this with a **Virtual DOM**: a lightweight copy of the real DOM kept in memory.

Imagine your portfolio dashboard showing stock prices. When Apple's price changes, React doesn't rebuild the whole page — it finds *only* the price element and updates just that.

| Virtual DOM (before) | Virtual DOM (after) |
|---|---|
| `<h1>My Portfolio</h1>` | `<h1>My Portfolio</h1>` |
| `<p>AAPL: $182</p>` | `<p>AAPL: $189 ✓</p>` |
| `<p>MSFT: $415</p>` | `<p>MSFT: $415</p>` |
| `<p>Total: $597</p>` | `<p>Total: $604 ✓</p>` |

**Step 1 — render**

React builds a new virtual DOM tree whenever data changes (e.g. new stock price arrives).

**Step 2 — diff**

React compares old vs new virtual DOM trees and finds the minimum set of changes.

**Step 3 — patch**

Only those changed elements get updated in the real browser DOM. Fast.

**Why it matters**

A portfolio page with 50 stocks can update smoothly without reloading any HTML.

---

## 4. JSX basics — single vs multiple tags

JSX looks like HTML but lives inside your TypeScript file. A React component is just a function that returns JSX. There's one key rule: **a component must return exactly one root element.**

<table>
<thead>
<tr>
<th>✅ Works</th>
<th>❌ Won't work</th>
<th>✅ Works — wrap in a div</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
function App() {
  return (
    // One root
    <h1>Portfolio</h1>
  )
}
```

</td>
<td>

```tsx
function App() {
  return (
    // Two roots = error!
    <h1>Portfolio</h1>
    <p>Welcome</p>
  )
}
```

</td>
<td>

```tsx
function App() {
  return (
    <div>
      <h1>Portfolio</h1>
      <p>Welcome</p>
    </div>
  )
}
```

</td>
</tr>
</tbody>
</table>

<table>
<thead>
<tr>
<th>✅ Works — use a Fragment (no extra div in DOM)</th>
<th>✅ Works — use a React.Fragment (no extra div in DOM)</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
function App() {
  return (
    <> {/* <></> is a Fragment, an invisible wrapper */}
      <h1>Portfolio</h1>
      <p>Welcome</p>
    </>
  )
}
```

</td>
<td>

```tsx
function App() {
  return (
    <React.Fragment>
      <h1>Portfolio</h1>
      <p>Welcome</p>
    </React.Fragment>
  )
}
```

</td>
</tr>
</tbody>
</table>

---

## 5. Variables & functions in a component

Inside a component function, you can declare variables and functions just like regular TypeScript. To use them in JSX, wrap them in curly braces `{ }`.

**`src/App.tsx`**

```tsx
function App() {
  // 1. A plain variable (typed with TypeScript)
  const portfolioOwner: string = "Alex Chen"

  // 2. A number variable
  const totalValue: number = 24850.75

  // 3. A function that formats currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`
  }

  // ↓ Use {} to embed JS expressions in JSX
  return (
    <div>
      <h1>{portfolioOwner}'s Portfolio</h1>
      <p>Total Value: {formatCurrency(totalValue)}</p>
      <p>Raw number: {totalValue}</p>
    </div>
  )
}
```

**Output in browser**

```
Alex Chen's Portfolio
Total Value: $24,850.75
Raw number: 24850.75
```

> *In JSX, `{}` means: "Evaluate this JavaScript expression and render the result." You can put any valid JS expression inside.*

> **TypeScript benefit:** If you write `formatCurrency("hello")`, TypeScript immediately flags an error — a string isn't a number.

---

## 6. Styling

Three ways to style components. React gives you multiple ways to style. Here's all three demonstrated in the same `App.tsx` file, then using an external stylesheet.

**`src/App.tsx`**

```tsx
import './App.css' // import the external stylesheet

function App() {
  // Method 2: style as a JS object (note camelCase)
  const cardStyle = {
    backgroundColor: '#1e3a5f',
    borderRadius: '12px',
    padding: '1rem',
    color: 'white'
  }

  return (
    <div>
      {/* Method 1: inline style attribute */}
      <h1 style={{ color: '#2563eb', fontSize: '24px' }}>My Portfolio</h1>

      {/* Method 2: style object (defined above) */}
      <div style={cardStyle}>Portfolio card with object style</div>

      {/* Method 3: className refers to App.css */}
      <button className="btn-primary">View Holdings</button>
    </div>
  )
}
```

**`src/App.css`**

```css
/* This class is referenced as className="btn-primary" */
.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
```

> **Key difference from HTML:** HTML uses `class=""` but JSX uses `className=""` because `class` is a reserved word in JavaScript.

> **CSS property names:** In a JS style object, CSS properties become camelCase: `background-color` → `backgroundColor`.

> **Which method to use?** Use **external CSS** for reusable styles, **className** for component-specific rules, and **inline style** sparingly for truly dynamic values (like a bar width based on a percentage).

---

## 7. ProfileCard Component

Creating your first component — ProfileCard

A component is a reusable piece of UI. Let's create a `ProfileCard` that shows a portfolio owner's info — no props yet, just hardcoded data inside the component itself.

**`src/components/ProfileCard.tsx`** *(create this file)*

<table>
<thead>
<tr>
<th>// Normal Function</th>
<th>// React typed function in TypeScript</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
function ProfileCard() {
  // Data lives inside the component for now
  const name = "Alex Chen"
  const role = "Portfolio Manager"
  const skills = ["Equities", "Fixed Income", "ETFs"]

  return (
    <div style={{
      background: '#1e3a5f',
      borderRadius: '12px',
      padding: '1.5rem',
      color: 'white'
    }}>
      <h2>{name}</h2>
      <p>{role}</p>
      <div>
        {skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  )
}

export default ProfileCard
```

</td>
<td>

```tsx
import type { FC } from "react";

const ProfileCard: FC = () => {
  // Data lives inside the component for now
  const name = "Alex Chen"
  const role = "Portfolio Manager"
  const skills = ["Equities", "Fixed Income", "ETFs"]

  return (
    <div style={{
      background: '#1e3a5f',
      borderRadius: '12px',
      padding: '1.5rem',
      color: 'white'
    }}>
      <h2>{name}</h2>
      <p>{role}</p>
      <div>
        {skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  )
}

export default ProfileCard
```

</td>
</tr>
</tbody>
</table>

**`src/App.tsx`** *(use the component here)*

```tsx
import ProfileCard from './components/ProfileCard'

function App() {
  return (
    <div>
      <h1>My Portfolio Dashboard</h1>

      {/* Use the component like an HTML tag */}
      <ProfileCard />

      {/* You can even use it multiple times! */}
      <ProfileCard />
    </div>
  )
}
```

**What it looks like**

```
┌─────────────────────────┐
│  AC                     │
│  Alex Chen              │
│  Portfolio Manager      │
│  Equities  Fixed Income  ETFs │
└─────────────────────────┘
```

---

> 🎯 **What's next**
>
> Right now the data is hardcoded inside `ProfileCard`. In the next lab, we'll add **props** so you can pass different names and roles to the same component — making it truly reusable across a whole team of portfolio managers.
