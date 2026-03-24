# Lab 3 — Portfolio Management System

**Understanding useState()**

**Context:** We're continuing from Lab 2.

> *This lab has two parts. Part A builds understanding of useState in isolation using a simple counter example with no portfolio context. Part B then applies the same concepts inside the Portfolio Dashboard, without using any forms.*

By the end of this lab you will understand what state is, why a plain variable cannot replace it, how useState works mechanically, and how to use it inside a real component.

---

## Table of Contents

**PART A**
1. [useState — The Simple Version](#1-usestate--the-simple-version)
2. [useState Syntax](#2-usestate-syntax)
3. [Building the Counter](#3-building-the-counter)
4. [Flow onClick](#4-flow-onclick)
5. [useState — Multiple State Variables](#5-usestate--multiple-state-variables)
6. [useState — With Boolean and String](#6-usestate--with-boolean-and-string)
7. [String state — active tab \[EXTRA\]](#7-string-state--active-tab-extra)

**PART B**

8. [useState in the Portfolio Dashboard](#8-usestate-in-the-portfolio-dashboard)
9. [New Component — PortfolioSummary with Expandable Stats \[EXTRA\]](#9-new-component--portfoliosummary-with-expandable-stats-extra)
10. [Using PortfolioSummary in App](#10-using-portfoliosummary-in-app)
11. [Common Mistakes and How to Avoid Them](#11-common-mistakes-and-how-to-avoid-them)
12. [Summary](#12-summary)

---

# PART A

## 1. useState — The Simple Version

State is data that belongs to a component and can change over time. When state changes, React automatically re-renders the component so the screen always shows the latest value.

A plain JavaScript variable does not do this. If you change a regular variable, the screen stays the same because React has no way of knowing anything changed. This is the single most important distinction to understand.

<table>
<thead>
<tr>
<th>❌ Plain variable — screen never updates</th>
<th>✅ useState — screen updates on every change</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
function Counter() {

  let count = 0

  const increment = () => {

    count = count + 1

    // count changes in memory...
    // but the screen stays at 0
    console.log(count);

  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>
        Add
      </button>
    </div>
  )
}

export default Counter;
```

</td>
<td>

```tsx
function Counter() {

  const [count, setCount] =
    useState(0)

  const increment = () => {

    setCount(count + 1)

    // React re-renders the component
    // screen now shows the new value

  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>
        Add
      </button>
    </div>
  )
}

export default Counter;
```

</td>
</tr>
</tbody>
</table>

> 💡 **The mental model**
>
> Think of useState as a special variable that comes with an alarm. When you update it through the setter function, the alarm goes off and tells React to redraw the component with the new value. A plain variable has no alarm.

---

## 2. useState Syntax

useState always follows the same structure. Before writing any logic, make sure you understand each part of this one line:

```
const [count, setCount] = useState<number>(0)

  │       │                         │      │
  │       │                         │      └─ initial value (0)
  │       │                         └─ TypeScript type annotation
  │       └─ the setter function — the only way to update state
  └─ the current value — use this to read and display state
```

The square brackets are **array destructuring**. useState returns an array of exactly two things: the current value and the setter function. You can name them anything, but the convention is <mark>value</mark> and <mark>setValue</mark>.

The TypeScript type annotation is optional — TypeScript can infer it from the initial value — but being explicit is good practice, especially when the initial value is null or the type is complex.

```ts
// TypeScript can infer these — both are valid
const [count, setCount] = useState(0)           // inferred as number
const [name, setName] = useState("default")     // inferred as string

// Be explicit when the initial value is null
const [selected, setSelected] = useState<string | null>(null)

// Be explicit with arrays — initial [] gives type never[]
const [items, setItems] = useState<string[]>([])
```

---

## 3. Building the Counter

Create a new file: <mark>src/components/Counter.tsx</mark>

### Step 3.1 — Import useState

useState is not globally available. You import it from React at the top of the file. This is the import you will write at the top of every component that needs state.

```tsx
import { useState } from 'react'
```

### Step 3.2 — Declare the state variable

This line goes inside the function body, before the return statement. The initial value of `0` means the counter starts at zero the first time the component renders.

```tsx
function Counter() {

  const [count, setCount] = useState<number>(0)

  // ...

}
```

### Step 3.3 — Write functions that update state

Every state update must go through the setter function. You never modify <mark>count</mark> directly. Think of <mark>count</mark> as read-only — you only ever read from it. To write, you always use <mark>setCount</mark>.

```tsx
const increment = () => setCount(count + 1)
const decrement = () => setCount(count - 1)
const reset     = () => setCount(0)
```

### Step 3.4 — Use state in JSX

Display <mark>count</mark> in JSX using curly braces, and wire up each button's <mark>onClick</mark> to the appropriate function.

### Step 3.5 — The complete Counter component

```tsx
import { useState } from 'react'

function Counter() {

  const [count, setCount] = useState<number>(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset     = () => setCount(0)

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Simple Counter</h2>
      <p style={{ fontSize: "48px", fontWeight: "bold", margin: "1rem 0" }}>
        {count}
      </p>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  )
}

export default Counter
```

Then use it in <mark>src/App.tsx</mark>:

```tsx
import Counter from './components/Counter'

function App() {
  return <Counter />
}
```

---

## 4. Flow onClick

Walking through the sequence of events when the + button is clicked helps build a clear mental model of how React re-rendering works.

| Step | What happens |
|---|---|
| **1** | User clicks the + button |
| **2** | React calls the onClick handler — the `increment` function |
| **3** | `increment` calls `setCount(count + 1)` |
| **4** | React schedules a re-render of the Counter component |
| **5** | React calls the Counter function again from the top |
| **6** | `useState` now returns the new value (e.g. 1 instead of 0) |
| **7** | React builds a new virtual DOM with `{count}` = 1 |
| **8** | React diffs old vs new virtual DOM — only the number changed |
| **9** | React updates just that text node in the real DOM |
| **10** | Screen shows 1. The whole process takes milliseconds. |

> 💡 **Key insight**
>
> React calls your component function again from scratch on every render. This is why you write `const [count, setCount] = useState(0)` at the top every time — but the `0` only applies on the very first render. After that, React ignores the initial value and returns the current stored state.

---

## 5. useState — Multiple State Variables

A single component can have as many state variables as it needs. Each call to useState manages a completely independent piece of state.

```tsx
// Extending Counter to also track how many times reset was pressed

function Counter() {

  const [count, setCount]           = useState<number>(0)
  const [resetCount, setResetCount] = useState<number>(0)

  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)

  const reset = () => {
    setCount(0)
    setResetCount(resetCount + 1)  // update a second, independent state
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Counter</h2>
      <p style={{ fontSize: "48px", fontWeight: "bold" }}>{count}</p>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
      <p style={{ marginTop: "1rem", color: "#888", fontSize: "13px" }}>
        Reset pressed {resetCount} time(s)
      </p>
    </div>
  )
}
```

Each useState call is completely independent. Calling `setCount` does not affect `resetCount` and vice versa. React tracks them separately.

---

## 6. useState — With Boolean and String

State is not limited to numbers. Any JavaScript value can be stored in state: booleans, strings, arrays, objects. Here are two short examples before moving to the portfolio.

### Boolean state — show / hide a panel

```tsx
function HelpPanel() {

  const [isVisible, setIsVisible] = useState<boolean>(false)

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Hide Help" : "Show Help"}
      </button>

      {isVisible && (
        <p>This is the help text. It only renders when isVisible is true.</p>
      )}
    </div>
  )
}
```

The <mark>!isVisible</mark> flips the boolean on every click. The <mark>{isVisible && (...)}</mark> pattern is conditional rendering — the paragraph only appears when <mark>isVisible</mark> is true.

---

## 7. String state — active tab [ EXTRA]

```tsx
type Tab = 'overview' | 'details' | 'history'

function TabBar() {

  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div>
      <div style={{ display: "flex", gap: "8px" }}>
        {(['overview', 'details', 'history'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontWeight: activeTab === tab ? "bold" : "normal",
              color:      activeTab === tab ? "blue"  : "black",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <p>You are on: {activeTab}</p>
    </div>
  )
}
```

The TypeScript type <mark>Tab = 'overview' | 'details' | 'history'</mark> is a union type — it restricts the value to only those three strings. If you try to call <mark>setActiveTab('xyz')</mark>, TypeScript gives a compile error immediately.

---

# PART B

## 8. useState in the Portfolio Dashboard

In Lab 2 we introduced <mark>handleSelectManager</mark> in `App.tsx` to show an alert when a ProfileCard button was clicked. Let's update that code now that you understand useState properly.

<pre><code class="language-tsx">import { useState } from 'react'
import ProfileCard from './components/ProfileCard'
import { profiles } from './data/profiles';

function App() {

  // State: which manager is currently selected (null = none)
<mark>  const [selectedManager, setSelectedManager] = useState&lt;string | null&gt;(null)</mark>

  const handleSelectManager = (name: string) =&gt; {
<mark>    setSelectedManager(name); // remove alert</mark>
  }

  return (
    &lt;div style={{ padding: "2rem" }}&gt;
      &lt;h1&gt;Portfolio Dashboard&lt;/h1&gt;

      {/* Conditional banner — only renders when a manager is selected */}
<mark>      {selectedManager &amp;&amp; (
        &lt;div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: "8px", padding: "12px 16px",
          color: "#166534", marginBottom: "1rem" }}&gt;
          Viewing: &lt;strong&gt;{selectedManager}&lt;/strong&gt;
        &lt;/div&gt;
      )}</mark>

      {profiles.map(profile =&gt; (
        &lt;ProfileCard
          key={profile.id}
          name={profile.name}
          role={profile.role}
          skills={profile.skills}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
          featured={profile.featured}
          isActive={profile.isActive}
          onSelect={handleSelectManager}
        /&gt;
      ))}

    &lt;/div&gt;
  )
}
</code></pre>

The initial value <mark>null</mark> means nothing is selected. <mark>string | null</mark> tells TypeScript this value can be either a name string or null — a very common pattern for "nothing selected yet".

---

## 9. New Component — PortfolioSummary with Expandable Stats [EXTRA]

We will now build a component that did not exist in the previous labs. `PortfolioSummary` shows a portfolio owner's total value and a list of holdings. It uses boolean state to expand and collapse the holdings list — no form involved.

<b>Update</b> data/profiles.ts and add below code in the last

```tsx
  export type Holding = {
    ownerName:string|null, holdings:{
    ticker: string
    name: string
    value: number
    change: number  // percentage, can be negative
  }[]
  }

  export type PortfolioSummaryProps = {
    ownerName: string
    holdings: Holding[]
    onClose: () => void;
  }

  export const holdings:Holding[] = [
               {ownerName: "Ananya Iyer", holdings: [
                        { ticker: "AAPL", name: "Apple",     value: 8200,  change:  2.4 },
                        { ticker: "AMZN", name: "Amazon",     value: 7200,  change:  -2.4 },
                        { ticker: "NVDA", name: "Nvidia",     value: 4200,  change:  2.1 }
                      ]},
                {ownerName: "Alex Chan", holdings:[
                      { ticker: "MSFT", name: "Microsoft", value: 6500,  change: -0.8 },
                      { ticker: "NVDA", name: "Apple",     value: 4200,  change:  1.4 },
                      { ticker: "TCS", name: "Tata",     value: 5200,  change:  2.3 },
                      { ticker: "RELIANCE", name: "Reliance",     value: 5400,  change:  2.5 },
                ]},
                {ownerName: "Riya Mehta", holdings:[
                      { ticker: "INFY", name: "Infosys",    value: 10550, change:  5.2 },
                      { ticker: "AAPL", name: "Apple",     value: 6700,  change:  2.2},
                      { ticker: "GOOG", name: "GOOGLE",     value: 5500,  change:  -0.5 }
                ]},
          ]
```

Create a new file: <mark>src/components/PortfolioSummary.css</mark>

```CSS
/* Sidebar panel */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  height: 100vh;
  background: white;
  color: rgb(12, 116, 50);
  padding: 1.5rem;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  box-shadow: -4px 0 12px rgba(0,0,0,0.25);

  animation: slideIn 0.3s ease-in-out;
}

/* Slide animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Backdrop */
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 999;
}

/* Close button */
.close-btn {
  align-self: flex-end;
  border: none;
  background: transparent;
  color: rgb(12, 116, 50);;
  font-size: 1.2rem;
  cursor: pointer;
}
```

Create a new file: <mark>src/components/PortfolioSummary.tsx</mark>

```tsx
import { useState } from 'react'
import type { PortfolioSummaryProps } from '../data/profiles';

import './PortfolioSummary.css'


function PortfolioSummary({ ownerName, holdings , onClose}: PortfolioSummaryProps) {

  // State 1: are the holdings expanded or collapsed?
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const ownerHoldings = holdings.find(owner => owner.ownerName === ownerName)?.holdings;
  

  // Derived value (not state) — computed from holdings on every render
  const totalValue = ownerHoldings?.reduce((sum, h) => sum + h.value, 0)

  return (
     <>
      {/* Backdrop */}
      <div className="backdrop" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="sidebar">

        {/* Close button */}
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>{ownerName}</h2>

        <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>
          ${totalValue?.toLocaleString()}
        </p>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "rgb(12, 116, 50)",
            border: "none",
            color: "white",
            borderRadius: "8px",
            padding: "6px 14px",
            cursor: "pointer",
            marginTop: "8px"
          }}
        >
          {isExpanded ? "Hide Holdings" : "Show Holdings"}
        </button>

        {isExpanded && (
          <div style={{ marginTop: "1rem" }}>
            {ownerHoldings?.map((holding) => (
              <div
                key={holding.ticker}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <span>
                  <strong>{holding.ticker}</strong> — {holding.name}
                </span>
                <span>
                  ${holding.value.toLocaleString()}
                  <span
                    style={{
                      color: holding.change >= 0 ? "rgb(12, 116, 50)" : "#fca5a5",
                      marginLeft: "8px"
                    }}
                  >
                    {holding.change >= 0 ? "+" : ""}
                    {holding.change}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default PortfolioSummary
```

**Points to note in this component:**

- **Derived value vs state** — `totalValue` is computed from `holdings` on every render. It is not stored in state because it is always calculable from data we already have. A common mistake is to put derived values into `useState`, which creates sync issues.
- **Conditional rendering with `&&`** — `{isExpanded && (...)}` only mounts the holdings list when needed. When `isExpanded` becomes `false`, React removes those DOM nodes entirely, not just hides them with CSS.
- **Dynamic colour from state** — the change percentage colour uses a ternary: `holding.change >= 0 ? green : red`. This reads from the holdings data, not from state, but the same ternary pattern works with state values too.
- **`key` on mapped elements** — we use `holding.ticker` as the key because it is a unique, stable identifier — exactly the pattern from the Lab 1 deep-dive on keys.

---

## 10. Using PortfolioSummary in App

Now wire <mark>PortfolioSummary</mark> into <mark>App.tsx</mark> alongside the existing ProfileCard usage:

<pre><code class="language-tsx">import { useState } from 'react'
import ProfileCard from './components/ProfileCard';
import { profiles, type Holding, holdings } from './data/profiles';
import PortfolioSummary from "./components/PortfolioSummary";

function App() {

  const [selectedManager, setSelectedManager] = useState&lt;string | null&gt;(null)


  return (
    &lt;div style={{ padding: "2rem", maxWidth: "680px", margin: "0 auto" }}&gt;
      &lt;h1&gt;Portfolio Dashboard&lt;/h1&gt;

      {selectedManager &amp;&amp; (
        &lt;div style={{ background: "#f0fdf4", borderRadius: "8px",
          padding: "12px 16px", color: "#166534",
          marginBottom: "1rem" }}&gt;
          Viewing: &lt;strong&gt;{selectedManager}&lt;/strong&gt;
        &lt;/div&gt;
      )}

      {profiles.map(profile =&gt; (
        &lt;ProfileCard
          key={profile.id}
          name={profile.name}
          role={profile.role}
          skills={profile.skills}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
          featured={profile.featured}
          isActive={profile.isActive}
<mark>          onSelect={setSelectedManager}</mark>
        /&gt;
      ))}

<mark>      {/* Only show summary when Alex is selected */}

       {selectedManager  &amp;&amp; (
            &lt;PortfolioSummary
              ownerName={selectedManager}
              holdings={holdings}
              onClose={() => setSelectedManager(null)}
            /&gt;
          )}
      </mark>

    &lt;/div&gt;
  )
}
</code></pre>

Notice <mark>onSelect={setSelectedManager}</mark> passes the setter function directly as a prop instead of wrapping it in a named handler. This is a valid shortcut when the prop signature matches the setter signature exactly — both accept a <mark>string</mark>.

---

## 11. Common Mistakes and How to Avoid Them

### Mistake 1 — Modifying state directly

<table>
<thead>
<tr>
<th>❌ Wrong</th>
<th>✅ Correct</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
// Mutating state directly
// React will NOT re-render

const add = () => {
  count = count + 1
}
```

</td>
<td>

```tsx
// Always use the setter
// React will re-render

const add = () => {
  setCount(count + 1)
}
```

</td>
</tr>
</tbody>
</table>

### Mistake 2 — Calling the function immediately on onClick

<table>
<thead>
<tr>
<th>❌ Wrong — calls on render</th>
<th>✅ Correct — calls on click</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
<button onClick={setCount(count + 1)}>
  +
</button>

// setCount runs immediately
// when the component renders,
// causing an infinite loop
```

</td>
<td>

```tsx
<button onClick={() => setCount(count + 1)}>
  +
</button>

// Arrow function wraps the call.
// setCount only runs when
// the button is clicked.
```

</td>
</tr>
</tbody>
</table>

### Mistake 3 — Storing derived data in state

<table>
<thead>
<tr>
<th>❌ Wrong — redundant state</th>
<th>✅ Correct — compute it</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
const [holdings, setHoldings]
  = useState(initialHoldings)

// This duplicates data and
// can get out of sync:
const [total, setTotal]
  = useState(0)
```

</td>
<td>

```tsx
const [holdings, setHoldings]
  = useState(initialHoldings)

// Compute total every render.
// Always accurate, no sync needed:
const total = holdings.reduce(
  (sum, h) => sum + h.value, 0)
```

</td>
</tr>
</tbody>
</table>

> 💡 **Rule of thumb**
>
> If a value can be calculated from existing state or props, do not put it in `useState`. Only store the minimum data needed, and compute everything else from it.

---

## 12. Summary

| Concept | Key point |
|---|---|
| **useState returns** | A pair: `[currentValue, setterFunction]` |
| **Initial value** | Only used on the very first render |
| **Updating state** | Always call the setter — never mutate directly |
| **Re-rendering** | Calling the setter triggers an automatic re-render |
| **Boolean state** | Use for toggling visibility, active states |
| **String \| null state** | Use for "nothing selected yet" patterns |
| **Derived values** | Compute from state — do not store in useState |
| **TypeScript types** | Be explicit when initial value is `null` or an empty array |
