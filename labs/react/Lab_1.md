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
  - [7. Event Handling in React](#7-event-handling-in-react)
  - [8. ProfileCard Component](#8-profilecard-component)
  - [8. LISTS IN REACT JSX](#8-lists-in-react-jsx)

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
## 7. Event Handling in React

Inside a component function, you can call functions just like regular Javascript on click of a button. To use them in JSX, wrap them in curly braces `{ }`.

If you want to call convertUpper function since it takes no parameters : just wrap the function name in `{ }`. Do not call the function else it will execute infinitely.

If you want to call formatCurrency on click of the button add a <button> tag and handle the onClick, since it takes parameter, 
wrap the function call around arrow function. Here when you click the button arrow function gets invoked that internally calls the formatCurrency() function passing the value

**`src/App.tsx`**

```tsx
function App() {
  // 1. A plain variable (typed with TypeScript)
  const portfolioOwner: string = "Alex Chen"

  // 2. A number variable
  const totalValue: number = 24850.75

  const convertUpper = () =&gt; portfolioOwner.toUpperCase()
  // 3. A function that formats currency
  const formatCurrency = (amount: number): string =&gt; {
    return `$${amount.toLocaleString()}`
  }

  // ↓ Use {} to embed JS expressions in JSX
  return (
    <div>
      <h1>{portfolioOwner}&apos;s Portfolio</h1>
      <div> &lt;button onClick={convertUpper}</button></div>
      <div> Total Value: &lt;button onClick={()=&gt;formatCurrency(totalValue)}</button>
      </div>
      <p>Raw number: {totalValue}</p>
    </div>
  )
}
```

## 8. ProfileCard Component

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


## 8. LISTS IN REACT JSX

The Problem: JSX Can't Render Arrays Directly

You might think you could just drop an array into JSX like this:

```tsx
const skills = ["Equities", "Fixed Income", "ETFs"]

return <div>{skills}</div>
```

This actually works in a limited way — React will render the strings squished together with no spaces: `EquitiesFixed IncomeETFs`. There's no structure, no styling, no way to treat each item individually. What we really want is to transform each item in the array into its own JSX element. That's exactly what `.map()` does.

---

How `.map()` Works in This Context

`.map()` is a standard JavaScript array method. It takes every item in an array, runs it through a function you provide, and returns a new array of the results. In JSX, if that result is an array of JSX elements, React knows how to render them one after another.

```tsx
const skills = ["Equities", "Fixed Income", "ETFs"]

// Plain JavaScript — map returns a new array
const result = skills.map((skill) => "I know " + skill)
// result is now: ["I know Equities", "I know Fixed Income", "I know ETFs"]
```

The same idea in JSX — return a JSX element instead of a string:

```tsx
{skills.map((skill) => (
  <span key={skill}>{skill}</span>
))}
```

Each call to the arrow function receives one item from the array (`skill`) and returns a `<span>` wrapping it. React receives the resulting array of three `<span>` elements and renders them in order. The parentheses around `(...)` are just for readability when the returned JSX spans multiple lines — they have no functional effect.

---

What Exactly is `key` and Why Does React Need It?

When React renders a list, it doesn't just paint it on screen and forget about it. Every time your data changes — say a new skill is added, or one is removed — React needs to re-render the list. The question is: **how does React know which item changed?**

Without `key`, React has no way to match the old list against the new one. It falls back to comparing items purely by their position in the array. This causes subtle but serious bugs.

Consider this scenario. You have three skills rendered in order:

```
Position 0 → "Equities"
Position 1 → "Fixed Income"
Position 2 → "ETFs"
```

Now "Equities" is removed. Without keys, React sees:

```
Position 0 → "Fixed Income"   (was "Equities" — React thinks this item changed)
Position 1 → "ETFs"           (was "Fixed Income" — React thinks this changed too)
Position 2 → nothing          (React deletes the last item)
```

React updated two items and deleted one, when really only one item was removed. With a stable key on each element, React knows `"the element with key Equities is gone, the others are untouched"` — it removes exactly one DOM node and leaves the rest alone.

---

What Makes a Good Key?

The key must be **unique among siblings** and **stable across re-renders**. It doesn't need to be globally unique — just unique within that particular list.

<table>
<thead>
<tr>
<th>✅ Good — use the data value itself</th>
<th>❌ Bad — don't use array index</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
// The skill name is unique in this list
// and doesn't change
{skills.map((skill) => (
  <span key={skill}>{skill}</span>
))}
```

</td>
<td>

```tsx
// index changes when the array order changes
{skills.map((skill, index) => (
  <span key={index}>{skill}</span>
))}
```

</td>
</tr>
</tbody>
</table>

Using the array index as a key is a common mistake. It looks harmless but breaks down the moment the array is sorted, filtered, or has items inserted in the middle. If "Fixed Income" moves from position `1` to position `0`, its key changes from `1` to `0` — React thinks it's a completely different element.

In our portfolio example, if you later build a sortable skills list and use index as the key, you'll see elements flash or lose their styles during a re-sort because React is treating every position shift as a destruction and recreation of an element.

**The safe rule:** use something that uniquely identifies the data itself, not its position. A name, an ID from a database, a ticker symbol — anything inherent to the item.

---

What Happens if You Forget `key`?

React will still render the list correctly in most cases, but it will print a warning in the browser console:

```
Warning: Each child in a list should have a unique "key" prop.
```

---

One More Pattern Worth Knowing

Sometimes your array contains objects rather than plain strings. This is more realistic for a real portfolio system:

```tsx
type Skill = {
  id: number
  label: string
}

const skills: Skill[] = [
  { id: 1, label: 'Equities' },
  { id: 2, label: 'Fixed Income' },
  { id: 3, label: 'ETFs' },
]

{skills.map((skill) => (
  <span key={skill.id}>{skill.label}</span>
))}
```

Here the `id` field from the data makes the perfect key — it's stable, unique, and has nothing to do with the item's position. This is the pattern you'll use in Lab 3 when we manage a full list of portfolio managers with add and remove functionality.