# Lab 4 — Portfolio Management System

**Understanding useEffect() and Lifecycle of the Components**

**Context:** We're continuing from Lab 3.

> *Two parts. Part A explains component lifecycle and useEffect from scratch using simple standalone examples. Part B applies every concept directly to your Portfolio Dashboard — ProfileCard, PortfolioSummary, and App.tsx — using your exact code.*

---

## Table of Contents

**PART A**
1. [Component Lifecycle — The Concepts](#1-component-lifecycle--the-concepts)
2. [Introducing useEffect](#2-introducing-useeffect)
3. [Mount — Running Once on Load](#3-mount--running-once-on-load)
4. [Update — Reacting to Changing Values](#4-update--reacting-to-changing-values)
5. [Unmount — Clean Up](#5-unmount--clean-up)
6. [Full Lifecycle in One Component](#6-full-lifecycle-in-one-component)

**PART B**

7. [Reacting to selectedManager in App](#7-reacting-to-selectedmanager-in-app)
8. [Simulating a Data Fetch with useEffect \[EXTRA\]](#8-simulating-a-data-fetch-with-useeffect-extra)
9. [Common Mistakes in Your Codebase](#9-common-mistakes-in-your-codebase)
10. [Summary](#10-summary)

---

# PART A

## 1. Component Lifecycle — The Concepts

Every React component goes through a predictable sequence of events from the moment it appears on screen to the moment it disappears. This sequence is called the **lifecycle**.

With functional components (the style you have been writing), the lifecycle has three phases:

| Phase | When | Plain English |
|---|---|---|
| **Mount** | Component appears in the DOM for the first time | React calls your function, builds JSX, paints the screen |
| **Update** | State or props change | React re-runs your function, diffs the output, patches the DOM |
| **Unmount** | Component is removed from the DOM | React removes the DOM nodes and runs any cleanup code |

> 💡 **TIP: Portfolio parallel**
>
> Think of `ProfileCard` mounting when a manager is loaded, updating when their active status changes, and unmounting when the dashboard is filtered to hide them.

---

## 2. Introducing useEffect

`useEffect` is the hook that lets you run code at specific points in the lifecycle. It takes two arguments: a function to run, and an optional dependency array that controls when it runs.

```tsx
import { useEffect } from 'react'

useEffect(() => {
  // code to run
}, [/* dependency array */])
```

The dependency array is the key. Its contents determine which lifecycle phase triggers the effect:

| Syntax | Runs when | Use for |
|---|---|---|
| `useEffect(() => { ... })` | Every render (mount + every update) | Rarely used — almost always too broad |
| `useEffect(() => { ... }, [])` | Mount only (once) | Fetch initial data, start a timer, add event listeners |
| `useEffect(() => { ... }, [x])` | Mount + whenever `x` changes | React to prop/state changes, fetch new data when selection changes |
| Return a cleanup function | Unmount (and before next run) | Clear timers, cancel requests, remove event listeners |

---

## 3. Mount — Running Once on Load

The empty dependency array `[]` tells React: run this effect after the very first render, and never again. This is the equivalent of "do this when the component loads."

### Simple example — log when a component appears

```tsx
import { useEffect } from 'react'

function WelcomeBanner() {

  useEffect(() => {
    console.log("WelcomeBanner mounted")
  }, []) // empty array = run once on mount

  return <h1>Welcome to the Dashboard</h1>
}
```

The `console.log` fires exactly once — when the component first appears. It does not fire again even if the parent re-renders.

### Practical example — document title

A common real-world use of mount-only effects is updating the browser tab title:

```tsx
function Dashboard() {

  useEffect(() => {
    document.title = 'Portfolio Dashboard'
  }, [])

  return <div>...</div>
}
```

> 💡 **TIP: Why not just write it outside useEffect?**
>
> Code outside `useEffect` runs on every render, including updates. If you set `document.title` directly in the function body, it re-runs every time any state changes. Wrapping it in `useEffect([])` guarantees it runs only once.

---

## 4. Update — Reacting to Changing Values

Adding values to the dependency array tells React: run this effect on mount, and again whenever any of these values change. This is how you respond to state or prop changes with side effects.

### Simple example — log whenever a value changes

```tsx
function Counter() {

  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log("Count changed to:", count)
  }, [count]) // runs on mount, then every time count changes

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

The effect runs once on mount (logging `0`), then again each time the `+` button is clicked. If <mark>count</mark> never changes, the effect never re-runs after the first time.

### Multiple dependencies

You can list as many dependencies as needed. The effect runs if any one of them changes:

```tsx
useEffect(() => {
  console.log("name or role changed:", name, role)
}, [name, role]) // runs when either name OR role changes
```

> ⚠️ **WARNING: Missing dependencies**
>
> If your effect uses a variable but you leave it out of the dependency array, the effect will run with a stale (old) value of that variable. ESLint with the `react-hooks` plugin will warn you about this. Always include every variable your effect reads.

---

## 5. Unmount — Clean Up

When a component is removed from the DOM, React runs any cleanup function you returned from `useEffect`. This is essential for anything that runs outside of React — timers, event listeners, subscriptions.

### The cleanup pattern

```tsx
useEffect(() => {

  // Setup: runs on mount (or when deps change)
  const id = setInterval(() => {
    console.log("tick")
  }, 1000)

  // Cleanup: returned function runs on unmount
  // (and before the next run if deps changed)
  return () => {
    clearInterval(id)
    console.log("interval cleared")
  }

}, [])
```

The function you return from `useEffect` is the cleanup. React calls it automatically when the component unmounts, so you never need to track it manually.

### What happens without cleanup

<table>
<thead>
<tr>
<th>❌ No cleanup — timer leaks</th>
<th>✅ With cleanup — timer stops on unmount</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
function Panel() {

  useEffect(() => {

    // Timer starts when Panel mounts.
    // When Panel unmounts, the timer
    // keeps running — no one stops it.
    // Memory leak + stale state updates.

    setInterval(() => {
      console.log("still running!")
    }, 1000)

  }, [])

  return <div>Panel</div>
}
```

</td>
<td>

```tsx
function Panel() {

  useEffect(() => {

    const id = setInterval(() => {
      console.log("tick")
    }, 1000)

    // Cleanup: React calls this when
    // Panel is removed from the DOM.
    return () => clearInterval(id)

  }, [])

  return <div>Panel</div>
}
```

</td>
</tr>
</tbody>
</table>

---

## 6. Full Lifecycle in One Component

Here is a single component that demonstrates all three phases together so you can see the complete picture before moving to the portfolio code:

```tsx
import { useState, useEffect } from 'react'

function LiveClock() {

  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {

    console.log('LiveClock MOUNTED')              // Phase 1: mount

    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString())    // Phase 2: causes update
    }, 1000)

    return () => {
      console.log('LiveClock UNMOUNTED')          // Phase 3: cleanup
      clearInterval(id)
    }

  }, []) // empty array: setup once, clean up once

  return <p>Current time: {time}</p>
}
```

**Mount:** the interval starts. **Update:** every second `setTime` triggers a re-render showing the new time. **Unmount:** when `LiveClock` is removed from the DOM, `clearInterval` stops the timer. Nothing leaks.

---

# PART B

## 7. Reacting to selectedManager in App

In <mark>App.tsx</mark>, the <mark>selectedManager</mark> state drives whether <mark>PortfolioSummary</mark> is shown. We can add a `useEffect` that reacts every time that selection changes — for example, to log an analytics event, update the document title, or (later) trigger an API call.

<pre><code class="language-tsx">import { useState, useEffect } from 'react'
import ProfileCard from './components/ProfileCard'
import PortfolioSummary from './components/PortfolioSummary'
import { profiles, holdings } from './data/profiles'

function App() {

  const [selectedManager, setSelectedManager] = useState&lt;string | null&gt;(null)

<mark>  // Runs on mount and every time selectedManager changes
  useEffect(() =&gt; {
    if (selectedManager) {
      // When a manager is selected: update the tab title
      document.title = `${selectedManager} — Portfolio Dashboard`
      console.log(`Analytics: opened portfolio for ${selectedManager}`)
    } else {
      // When the sidebar closes: restore the default title
      document.title = 'Portfolio Dashboard'
    }
  }, [selectedManager]) // dependency: re-run when selectedManager changes</mark>

  return (
    &lt;div style={{ padding:"2rem", display:"flex", flexDirection:"column", gap:"1rem" }}&gt;
      &lt;h1&gt;Portfolio Dashboard&lt;/h1&gt;

      {selectedManager &amp;&amp; (
        &lt;div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0",
          borderRadius:"8px", padding:"12px 16px", color:"#166534" }}&gt;
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

      {selectedManager &amp;&amp; (
        &lt;PortfolioSummary
          ownerName={selectedManager}
          holdings={holdings}
          onClose={() =&gt; setSelectedManager(null)}
        /&gt;
      )}

    &lt;/div&gt;
  )
}

export default App
</code></pre>

Notice <mark>onSelect={setSelectedManager}</mark> passes the setter function directly as a prop instead of wrapping it in a named handler. This is a valid shortcut when the prop signature matches the setter signature exactly — both accept a **string**.

Walk through what happens when you click "Select Manager" on Alex Chan's card:

- **Before click:** `selectedManager` is `null`. `document.title` is `"Portfolio Dashboard"`.
- **Click fires:** `onSelect={setSelectedManager}` calls `setSelectedManager("Alex Chan")`.
- **State updates:** React re-renders App. `selectedManager` is now `"Alex Chan"`.
- **useEffect runs:** The dependency `[selectedManager]` changed, so the effect fires. `document.title` becomes `"Viewing Alex Chan — Portfolio Dashboard"`. Console logs the analytics line.
- **PortfolioSummary mounts:** Because `selectedManager` is now truthy, `PortfolioSummary` renders. Its own mount `useEffect` fires, starting the interval.
- **Close clicked:** `onClose` calls `setSelectedManager(null)`. `useEffect` fires again — title resets. `PortfolioSummary` unmounts — its interval cleanup fires.

---

## 8. Simulating a Data Fetch with useEffect [EXTRA]

**Do only if you have done Portfolio Summary**

In a real portfolio application, the holdings data would come from an API, not a hardcoded array. `useEffect` with an empty dependency array is where that fetch lives. Here is how `PortfolioSummary` would look if it fetched its own data instead of receiving it as a prop — useful preparation for when you connect a real backend.

<pre><code class="language-tsx">import { useEffect, useState } from 'react'
import { <mark>portfolioHoldings</mark>, type Holding, type PortfolioSummaryProps, type Toggleable } from '../data/profiles';
import './PortfolioSummary.css'

<mark>type Props = Toggleable &amp; {
  ownerName: string
}</mark>

// type Props = PortfolioSummaryProps &amp; Toggleable;

// Remove holdings from function props
function PortfolioSummary(<mark>{ ownerName, onClose }</mark>: Props) {

  // State 1: are the holdings expanded or collapsed?
  const [isExpanded, setIsExpanded] = useState&lt;boolean&gt;(false)

<mark>  const [holdings,   setHoldings]   = useState&lt;Holding[] | undefined&gt;([])
  const [totalValue, settotalValue] = useState&lt;number | undefined&gt;(0)
  const [isLoading,  setIsLoading]  = useState&lt;boolean&gt;(true)
  const [error,      setError]      = useState&lt;string | null&gt;(null)

  useEffect(() =&gt; {
    setIsLoading(true)
    setError(null)

    // Simulate a network request
    // In a real app: fetch(`/api/holdings/${ownerName}`)
    const timer = setTimeout(() =&gt; {

      const data: Holding[] | undefined =
        portfolioHoldings?.find(owner =&gt; owner.ownerName === ownerName)?.holdings;

      console.log(data);
      setHoldings(data);

      const value = data?.reduce((sum, h) =&gt; sum + h.value, 0)
      settotalValue(value)
      setIsLoading(false);

    }, 3000) // 3 second simulated delay

    return () =&gt; clearTimeout(timer) // cleanup if component unmounts early

  }, [ownerName]) // re-fetch whenever a different manager is selected

  if (isLoading) return &lt;div className="sidebar"&gt;Loading...&lt;/div&gt;
  if (error)     return &lt;div className="sidebar"&gt;Error: {error}&lt;/div&gt;</mark>

  return (
    &lt;&gt;
      {/* Backdrop */}
      &lt;div className="backdrop" onClick={onClose}&gt;&lt;/div&gt;

      {/* Sidebar */}
      &lt;div className="sidebar"&gt;

        {/* Close button */}
        &lt;button className="close-btn" onClick={onClose}&gt;✖&lt;/button&gt;

        &lt;h2&gt;{ownerName}&lt;/h2&gt;
        &lt;p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}&gt;
          ${totalValue?.toLocaleString()}
        &lt;/p&gt;

        &lt;button
          onClick={() =&gt; setIsExpanded(!isExpanded)}
          style={{
            background: "rgb(12, 116, 50)",
            border: "none",
            color: "white",
            borderRadius: "8px",
            padding: "6px 14px",
            cursor: "pointer",
            marginTop: "8px"
          }}
        &gt;
          {isExpanded ? "Hide Holdings" : "Show Holdings"}
        &lt;/button&gt;

        {isExpanded &amp;&amp; (
          &lt;div style={{ marginTop: "1rem" }}&gt;
            {holdings?.map((holding) =&gt; (
              &lt;div
                key={holding.ticker}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)"
                }}
              &gt;
                &lt;span&gt;
                  &lt;strong&gt;{holding.ticker}&lt;/strong&gt; — {holding.name}
                &lt;/span&gt;
                &lt;span&gt;
                  ${holding.value.toLocaleString()}
                  &lt;span style={{ color: holding.change &gt;= 0 ? "rgb(12, 116, 50)" : "#fca5a5", marginLeft: "8px" }}&gt;
                    {holding.change &gt;= 0 ? "+" : ""}{holding.change}%
                  &lt;/span&gt;
                &lt;/span&gt;
              &lt;/div&gt;
            ))}
          &lt;/div&gt;
        )}

      &lt;/div&gt;
    &lt;/&gt;
  )
}

export default PortfolioSummary
</code></pre>

Three state variables work together here. <mark>isLoading</mark> starts `true` and flips to `false` when data arrives, giving you a loading state to render. <mark>error</mark> captures any failure. <mark>holdings</mark> holds the fetched data. This three-variable pattern — **loading / error / data** — is the standard structure for any component that fetches.

The dependency is <mark>[ownerName]</mark>, not <mark>[]</mark>. This means the fetch re-runs every time a different manager is selected. Close Alex's sidebar, open Riya's, and the effect fires again — fetching Riya's data. The cleanup <mark>clearTimeout(timer)</mark> cancels any in-flight fetch if the component unmounts before the data arrives, which prevents the classic "update on unmounted component" warning.

---

## 9. Common Mistakes in Your Codebase

### Mistake 1 — Missing dependencies

<table>
<thead>
<tr>
<th>❌ selectedManager used but not listed</th>
<th>✅ Dependency correctly listed</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
useEffect(() => {

  // Uses selectedManager...
  document.title =
    `Viewing ${selectedManager}`

  // ...but dep array is empty.
  // Title never updates after
  // first render. Stale value.

}, [])
```

</td>
<td>

```tsx
useEffect(() => {

  if (selectedManager) {
    document.title =
      `Viewing ${selectedManager}`
  }

  // selectedManager in the array.
  // Runs fresh on every change.

}, [selectedManager])
```

</td>
</tr>
</tbody>
</table>

### Mistake 2 — No cleanup when PortfolioSummary unmounts

Because <mark>PortfolioSummary</mark> is conditionally rendered in `App.tsx` — <mark>{selectedManager && \<PortfolioSummary ... />}</mark> — it mounts and unmounts on every open and close. Any effect that starts a subscription or timer must return a cleanup. Without it, closing the sidebar leaves the timer running against a component that no longer exists.

---

## 10. Summary

| Concept | Key point |
|---|---|
| **Mount (`[]` dependency)** | Runs once when the component first appears in the DOM |
| **Update (`[x]` dependency)** | Runs on mount and again whenever `x` changes |
| **Unmount (cleanup)** | Return a function from `useEffect` — React calls it on unmount |
| **Side effects in function body** | Always wrong — put them in `useEffect` to control when they run |
| **Missing dependencies** | Causes stale values — list every variable the effect reads |
| **PortfolioSummary fix** | Move `setInterval` into `useEffect([])` with `clearInterval` in cleanup |
| **selectedManager effect** | `useEffect([selectedManager])` in App — runs on every selection change |
| **Fetch pattern** | loading / error / data state + `useEffect([dependency])` + cleanup |
