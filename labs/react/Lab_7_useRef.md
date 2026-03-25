# React + TypeScript Lab Series — Lab 7: useRef

> **What it is · DOM refs · Value refs · Real examples · useRef vs useState**

*This lab is self-contained. You do not need the portfolio project to follow along.*
*Every example is a small standalone component you can drop into any React + TypeScript app.*
*The portfolio connection appears in Section 9 at the end.*

---

## Table of Contents

1. [What is useRef?](#1-what-is-useref)
2. [The Syntax](#2-the-syntax)
3. [Use 1 — DOM Refs](#3-use-1--dom-refs)
   - [3.1 — Auto-focus an input on mount](#example-31--auto-focus-an-input-on-mount)
   - [3.2 — Re-focus after submit](#example-32--re-focus-after-submit)
   - [3.3 — Measuring an element's size](#example-33--measuring-an-elements-size)
   - [3.4 — Controlling a video element](#example-34--controlling-a-video-element)
4. [Use 2 — Value Refs](#4-use-2--value-refs)
   - [4.1 — Storing a timer ID](#example-41--storing-a-timer-id)
   - [4.2 — Tracking the previous value](#example-42--tracking-the-previous-value)
   - [4.3 — Render counter (debugging)](#example-43--render-counter-debugging)
   - [4.4 — Ignoring a stale effect after unmount](#example-44--ignoring-a-stale-effect-after-unmount)
5. [Passing Refs to Child Components](#5-passing-refs-to-child-components)
6. [useRef vs useState](#6-useref-vs-usestate)
7. [Common Mistakes](#7-common-mistakes)
8. [Pattern Quick Reference](#8-pattern-quick-reference)
9. [Portfolio Dashboard — useRef in Practice](#9-portfolio-dashboard--useref-in-practice)
   - [9.1 — Auto-focus the name input in AddProfileForm](#91--auto-focus-the-name-input-in-addprofileform)
   - [9.2 — Track how many times App re-renders](#92--track-how-many-times-app-re-renders)
   - [9.3 — Storing the last-opened manager name](#93--storing-the-last-opened-manager-name)
10. [Summary](#summary)

---

## 1. What is useRef?

### The simplest explanation first

Every hook you have seen so far stores something and causes a re-render when that something changes. `useRef` is different in one important way: **it stores something but never causes a re-render.**

**`useRef` gives you a box.** That box has one property called `.current`. You can put anything inside it — a number, a string, a DOM element, a timer ID — and you can change it whenever you like. React will not notice, and nothing will re-render.

> 📦 **The sticky note on your desk**
>
> You can write on it, cross things out, and rewrite without telling anyone. The project board on the wall (your screen) stays exactly as it was. Only when you update the board does everyone see a change. `useRef` is the sticky note. `useState` is the board.

The two things you will use `useRef` for, in order of how often they appear in real code:

- **Accessing a DOM element directly** — for things React cannot do for you, like focusing an input, measuring an element's width, or playing a video.
- **Keeping a value between renders without triggering one** — timer IDs, previous state values, render counters, or anything that needs to persist but should not cause a re-render when it changes.

---

## 2. The Syntax

### One line to learn — read it in three parts

`useRef` has one of the simplest signatures in React:

```ts
import { useRef } from 'react'

// ┌─ the ref object    ┌─ the TypeScript type of .current
// │                    │
const inputRef = useRef<HTMLInputElement>(null)
//                                        │
//                                        └─ initial value of .current

// Reading the value:
console.log(inputRef.current) // the DOM node (or null before mount)

// Writing a value (does NOT cause a re-render):
inputRef.current = someNewValue
```

The generic type `<HTMLInputElement>` tells TypeScript what type `.current` will hold. For DOM refs use the element type. For value refs use the data type:

```ts
// DOM refs — type is the HTML element
const inputRef  = useRef<HTMLInputElement>(null)
const divRef    = useRef<HTMLDivElement>(null)
const videoRef  = useRef<HTMLVideoElement>(null)
const buttonRef = useRef<HTMLButtonElement>(null)

// Value refs — type is whatever you store
const countRef = useRef<number>(0)
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
const prevRef  = useRef<string>("")
```

> 💡 **`null` as initial value for DOM refs**
>
> DOM refs always start as `null` because the DOM element does not exist until after React mounts the component. You attach the ref with the `ref={}` attribute, and React sets `.current` to the element after mount. Always use `null` as the initial value for DOM refs.

---

## 3. Use 1 — DOM Refs

### Touching the DOM directly when React cannot

React manages the DOM for you. But some operations have no React equivalent — you must reach into the DOM directly. The `ref` attribute is how you do that safely.

### Example 3.1 — Auto-focus an input on mount

The most common DOM ref use case. When a modal or search bar opens, the input should already be focused so the user can start typing without clicking.

```tsx
// src/components/SearchBar.tsx

import { useRef, useEffect } from 'react'

function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null)

  // After the component mounts, focus the input
  useEffect(() => {
    inputRef.current?.focus() // ?. safely handles null
  }, []) // [] = run once on mount

  return (
    <input
      ref={inputRef}  // attach: React sets .current after mount
      type="text"
      placeholder="Search..."
      style={{ padding: "10px 14px", borderRadius: "8px",
               border: "1px solid #e2e8f0", fontSize: "14px" }}
    />
  )
}
```

Three steps every DOM ref follows:

- **Create:** `useRef<HTMLInputElement>(null)` — the ref starts as `null`
- **Attach:** `ref={inputRef}` on the JSX element — React sets `.current` to the DOM node after mount
- **Use:** `inputRef.current?.focus()` — inside `useEffect`, after mount, `.current` is the real DOM node

> ⚠️ **Never use `.current` during render**
>
> During the initial render, `.current` is still `null` — the DOM node does not exist yet. Only access `.current` inside `useEffect`, event handlers, or other callbacks that run after the component has mounted.

### Example 3.2 — Re-focus after submit

A common UX pattern: after submitting a form, the input clears and the cursor jumps back so the user can type the next item without clicking.

```tsx
// src/components/QuickAddInput.tsx

import { useState, useRef } from 'react'

function QuickAddInput() {
  const [items, setItems] = useState<string[]>([])
  const [text, setText]   = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setItems(prev => [...prev, text.trim()])
    setText("")
    // Re-focus so the user can type the next item immediately
    inputRef.current?.focus()
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type and press Enter"
          style={{ flex: 1, padding: "8px 12px",
                   border: "1px solid #e2e8f0", borderRadius: "6px" }}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}
```

Notice that `inputRef` and `useState` are used together here. `text` is in state because React needs to render it. `inputRef` is a ref because focusing the input is a DOM command, not a state change. They each do what they are best at.

### Example 3.3 — Measuring an element's size

Sometimes you need to know the actual pixel width or height of a rendered element — for custom tooltips, overflow detection, or canvas sizing. You cannot know this during render because the DOM does not exist yet. `useRef` gives you access after mount.

```tsx
// src/components/MeasuredBox.tsx

import { useRef, useState, useEffect } from 'react'

function MeasuredBox() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (boxRef.current) {
      // getBoundingClientRect() gives the actual rendered size
      setWidth(boxRef.current.getBoundingClientRect().width)
    }
  }, []) // measure once on mount

  return (
    <div
      ref={boxRef}
      style={{
        background: "#f0fdfa",
        padding: "1.5rem",
        borderRadius: "8px",
        border: "1px solid #0D9488"
      }}
    >
      <p>This box is <strong>{width}px</strong> wide.</p>
      <p>React cannot know this number during render —
         only the browser knows after it paints.</p>
    </div>
  )
}
```

### Example 3.4 — Controlling a video element

HTML media elements (`video`, `audio`) have imperative APIs — `play()`, `pause()`, `seek()` — that have no React equivalent. A DOM ref is the only way to call them.

```tsx
// src/components/VideoPlayer.tsx

import { useRef, useState } from 'react'

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  return (
    <div>
      <video
        ref={videoRef}
        src="/sample.mp4"
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <button onClick={toggle} style={{ marginTop: "8px" }}>
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  )
}
```

`playing` is in state because the button label needs to re-render when it changes. The video methods `play()` and `pause()` are called via the ref because they are imperative DOM commands — the DOM handles the actual video logic, React just triggers it.

---

## 4. Use 2 — Value Refs

### Persisting data without causing re-renders

The second use of `useRef` is storing data that needs to survive between renders but should not trigger one. The `.current` property persists across every render, just like state — but changing it is silent.

### Example 4.1 — Storing a timer ID

`setInterval` and `setTimeout` return an ID you need to cancel them later. Storing that ID in state would cause a pointless re-render. A ref is the right tool.

```tsx
// src/components/Stopwatch.tsx

import { useState, useRef } from 'react'

function Stopwatch() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    if (running) return
    setRunning(true)
    // Store the interval ID in a ref — no re-render needed
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
  }

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current) // use the stored ID
      intervalRef.current = null
    }
    setRunning(false)
  }

  const reset = () => {
    stop()
    setSeconds(0)
  }

  return (
    <div style={{ fontFamily: "monospace", fontSize: "2rem", textAlign: "center" }}>
      <p>
        {String(Math.floor(seconds / 60)).padStart(2, "0")}
        :{String(seconds % 60).padStart(2, "0")}
      </p>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", fontSize: "1rem" }}>
        <button onClick={start} disabled={running}>Start</button>
        <button onClick={stop}  disabled={!running}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
```

If you stored the interval ID in state, calling `setIntervalId()` would re-render the component — which would restart the effect and create a new interval. The ref avoids this entirely. `seconds` is in state because the display must update every second. The timer ID is in a ref because it is purely internal plumbing.

### Example 4.2 — Tracking the previous value

A common pattern: you need to know what a value was before it changed. `useRef` is the standard solution because it can be updated without triggering a re-render.

```tsx
// src/components/PreviousValue.tsx

import { useState, useRef, useEffect } from 'react'

function PreviousValue() {
  const [count, setCount] = useState(0)
  const prevCount = useRef<number>(0)

  // After every render, store the current count in the ref.
  // The ref update happens AFTER render, so during this render,
  // prevCount.current still holds the value from the PREVIOUS render.
  useEffect(() => {
    prevCount.current = count
  })

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p style={{ fontSize: "3rem", fontWeight: "bold" }}>{count}</p>
      <p style={{ color: "#94a3b8" }}>
        Previous value: {prevCount.current}
      </p>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        <button onClick={() => setCount(c => c - 1)}>−</button>
        <button onClick={() => setCount(c => c + 1)}>+</button>
      </div>
    </div>
  )
}
```

The timing is what makes this work. During a render, `prevCount.current` holds the value from the last render. After the render, the `useEffect` (with no dependency array) runs and updates `prevCount.current` to the new value — ready for the next render.

> 💡 **No dependency array on purpose**
>
> `useEffect(() => { prevRef.current = value })` — no `[]` — runs after every render. This is one of the few legitimate uses of an effect with no dependency array. It reads like *"after every render, sync the ref."*

### Example 4.3 — Render counter (debugging)

During development, you sometimes want to know how many times a component re-renders. A ref is the perfect tool: it increments on every render without causing one.

```tsx
// Drop this into any component to count its renders

import { useRef } from 'react'

function AnyComponent() {
  const renderCount = useRef(0)
  renderCount.current += 1 // runs every render, causes no re-render

  return (
    <div>
      <p style={{ fontSize: "11px", color: "#94a3b8" }}>
        Renders: {renderCount.current}
      </p>
      {/* rest of your component */}
    </div>
  )
}
```

If you used `useState` for this, incrementing the count would trigger a re-render, which would increment again, causing an infinite loop. The ref sidesteps this completely.

### Example 4.4 — Ignoring a stale effect after unmount

When a component unmounts while an async operation is still in flight, the callback might try to update state on an unmounted component. A ref can flag whether the component is still alive.

```tsx
// src/components/AsyncFetcher.tsx

import { useState, useEffect, useRef } from 'react'

function AsyncFetcher() {
  const [data, setData]       = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const isMounted = useRef(true) // tracks whether the component is alive

  useEffect(() => {
    isMounted.current = true

    // Simulate a slow API call
    setTimeout(() => {
      // Only update state if the component is still mounted
      if (isMounted.current) {
        setData("Data loaded successfully")
        setLoading(false)
      }
    }, 2000)

    return () => {
      // Cleanup: mark as unmounted so the callback above does nothing
      isMounted.current = false
    }
  }, [])

  if (loading) return <p>Loading...</p>
  return <p>{data}</p>
}
```

When the component unmounts (e.g. the user navigates away), the cleanup function sets `isMounted.current = false`. When the `setTimeout` fires two seconds later, it checks the ref before calling `setData`. If `false`, it does nothing — no warning, no error, no state update on a ghost component.

---

## 5. Passing Refs to Child Components

### `forwardRef` — when a parent needs to control a child's DOM node

By default, you cannot put a ref on a custom component. React will not know what DOM node you mean.

```tsx
// This does NOT work — CustomInput is a React component, not a DOM element
<CustomInput ref={inputRef} />  // ❌ ref is ignored

// This DOES work — input is a real HTML element
<input ref={inputRef} />        // ✅ ref points to the DOM node
```

If a parent component needs to focus, measure, or otherwise control a DOM node inside a child component, the child must explicitly forward the ref using `forwardRef`.

```tsx
// src/components/FancyInput.tsx

import { forwardRef } from 'react'

interface FancyInputProps {
  placeholder?: string
  label: string
}

// forwardRef wraps the component and gives it access to the ref from the parent
const FancyInput = forwardRef<HTMLInputElement, FancyInputProps>(
  ({ placeholder, label }, ref) => {
    return (
      <div>
        <label style={{ display: "block", fontWeight: "600", marginBottom: "4px" }}>
          {label}
        </label>
        <input
          ref={ref}  // forward the ref to the actual DOM input
          type="text"
          placeholder={placeholder}
          style={{ padding: "10px 14px", border: "1px solid #e2e8f0",
                   borderRadius: "8px", fontSize: "14px", width: "100%" }}
        />
      </div>
    )
  }
)

FancyInput.displayName = "FancyInput" // shows correctly in DevTools

export default FancyInput
```

```tsx
// Parent component — uses the ref exactly as if FancyInput were a plain <input>

import { useRef, useEffect } from 'react'
import FancyInput from './FancyInput'

function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailRef.current?.focus() // focuses the input inside FancyInput
  }, [])

  return (
    <form>
      <FancyInput
        ref={emailRef}           // parent passes the ref through
        label="Email address"
        placeholder="you@example.com"
      />
    </form>
  )
}
```

> 📝 **When do you need `forwardRef`?**
>
> Only when a parent needs to control something inside a child's DOM. For most components this is not needed. If you are building a reusable input, button, or modal component in a design system, `forwardRef` is worth adding.

---

## 6. useRef vs useState

### The definitive comparison — when to use which

This is the most important section. Most bugs involving refs come from using one when the other was needed. The rule is simple:

> 🖥️ **The single rule**
>
> If the user needs to **SEE** the value on screen, put it in `useState`. If React just needs to **REMEMBER** it behind the scenes, put it in `useRef`.

**Side-by-side comparison**

| Property | `useState` | `useRef` |
|---|---|---|
| **Triggers re-render on change?** | Yes — always | No — never |
| **Persists across renders?** | Yes | Yes |
| **Value accessible as** | `const [val, setVal]` | `ref.current` |
| **How to update** | `setVal(newValue)` | `ref.current = newValue` |
| **Updated synchronously?** | No — batched by React | Yes — immediate |
| **Read during render?** | Yes — always fresh | Avoid — may be null |
| **Primary use case** | Data the screen displays | DOM nodes, timers, stable values |

**Decision guide — which should I use?**

| Question | Use `useState` | Use `useRef` |
|---|---|---|
| Does the user see this value on screen? | ✅ | ❌ |
| Does changing it need to update the UI? | ✅ | ❌ |
| Is it a DOM node (input, div, video)? | ❌ | ✅ |
| Is it a timer or interval ID? | ❌ | ✅ |
| Is it a "previous value" tracker? | ❌ | ✅ |
| Is it a flag like `isMounted` or `isRunning`? | ❌ | ✅ |
| Is it a render counter for debugging? | ❌ | ✅ |
| Do you need the value immediately after setting? | ❌ (batched) | ✅ (immediate) |

**Classic mistakes and what they look like**

```tsx
// ❌ Wrong — using useRef when you need useState
// ref changes will NOT re-render the screen
function Counter() {
  const count = useRef(0)
  return (
    <div>
      <p>{count.current}</p>
      <button onClick={() => {
        count.current += 1
        // count changes in memory...
        // but the screen stays at 0. React has no idea.
      }}>
        +
      </button>
    </div>
  )
}

// ✅ Correct — useState for displayed values
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => {
        setCount(c => c + 1)
        // React re-renders. Screen shows the new number.
      }}>
        +
      </button>
    </div>
  )
}
```

```tsx
// ❌ Wrong — using useState when you need useRef
// Every setTimerId() causes a re-render, which may re-run effects
function TimedFetch() {
  const [timerId, setTimerId] = useState<number | null>(null)

  const start = () => {
    const id = setTimeout(fetch, 1000)
    setTimerId(id) // triggers re-render!
  }

  const cancel = () => {
    if (timerId) clearTimeout(timerId)
  }
}

// ✅ Correct — useRef for internal plumbing
function TimedFetch() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = () => {
    timerRef.current = setTimeout(fetch, 1000)
    // No re-render. Clean.
  }

  const cancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }
}
```

---

## 7. Common Mistakes

### The errors beginners make most often

### Mistake 1 — Reading `.current` during render

```tsx
// ❌ Wrong — reading a DOM ref during render
function BadComponent() {
  const divRef = useRef<HTMLDivElement>(null)

  // This runs DURING render — before the div exists in the DOM.
  // divRef.current is null here. The check below will never be true.
  const width = divRef.current?.getBoundingClientRect().width ?? 0

  return <div ref={divRef}>Width: {width}px</div>
}

// ✅ Correct — read .current inside useEffect
function GoodComponent() {
  const divRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.getBoundingClientRect().width)
    }
  }, [])

  return <div ref={divRef}>Width: {width}px</div>
}
```

### Mistake 2 — Expecting a ref update to re-render

```tsx
// ❌ Wrong — ref change is invisible to React
function SilentUpdate() {
  const nameRef = useRef("Alice")
  return (
    <div>
      <p>Hello, {nameRef.current}!</p>
      <button onClick={() => {
        nameRef.current = "Bob"
        // changes the ref...
        // ...but React does not re-render.
        // The screen still shows "Alice".
      }}>
        Change name
      </button>
    </div>
  )
}

// ✅ Correct — if the screen must show it, use state
function VisibleUpdate() {
  const [name, setName] = useState("Alice")
  return (
    <div>
      <p>Hello, {name}!</p>
      <button onClick={() => setName("Bob")}>
        Change name
      </button>
    </div>
  )
}
```

### Mistake 3 — Missing `forwardRef` on a custom component

```tsx
// ❌ Wrong — ref on a plain function component is silently dropped
function MyInput({ placeholder }: { placeholder: string }) {
  return <input type="text" placeholder={placeholder} />
}

// Parent:
const ref = useRef<HTMLInputElement>(null)
<MyInput ref={ref} placeholder="..." />  // ref is null — ignored

// ✅ Correct — use forwardRef
import { forwardRef } from 'react'

const MyInput = forwardRef<HTMLInputElement, { placeholder: string }>(
  ({ placeholder }, ref) => (
    <input ref={ref} type="text" placeholder={placeholder} />
  )
)
```

---

## 8. Pattern Quick Reference

### Copy-paste starting points

**DOM ref — focus on mount**

```tsx
const inputRef = useRef<HTMLInputElement>(null)
useEffect(() => { inputRef.current?.focus() }, [])
<input ref={inputRef} />
```

**DOM ref — measure element width**

```tsx
const boxRef = useRef<HTMLDivElement>(null)
const [width, setWidth] = useState(0)

useEffect(() => {
  if (boxRef.current)
    setWidth(boxRef.current.getBoundingClientRect().width)
}, [])

<div ref={boxRef}>...</div>
```

**Value ref — interval ID**

```tsx
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

// Start: intervalRef.current = setInterval(fn, 1000)
// Stop:  clearInterval(intervalRef.current!); intervalRef.current = null
```

**Value ref — previous value**

```tsx
const prevRef = useRef(value)
useEffect(() => { prevRef.current = value }) // no dep array

// prevRef.current holds the value from the last render
```

**Value ref — isMounted flag**

```tsx
const isMounted = useRef(true)

useEffect(() => {
  isMounted.current = true
  return () => { isMounted.current = false }
}, [])

// Inside async: if (isMounted.current) setState(...)
```

**Value ref — render counter**

```tsx
const renders = useRef(0)
renders.current += 1 // runs every render, causes no re-render

<p>Renders: {renders.current}</p>
```

**`forwardRef` — reusable input**

```tsx
const FancyInput = forwardRef<HTMLInputElement, { label: string }>(
  ({ label }, ref) => (
    <div>
      <label>{label}</label>
      <input ref={ref} type='text' />
    </div>
  )
)

FancyInput.displayName = 'FancyInput'
```

---

## 9. Portfolio Dashboard — useRef in Practice

### Applying the patterns to your existing project

Your portfolio dashboard already uses one `useRef` correctly (the render counter in `TodoList`). Here are three additional places where `useRef` makes the UX noticeably better.

### 9.1 — Auto-focus the name input in AddProfileForm

In `AddProfileForm.tsx`, the user has to click the Name field to start typing. A simple DOM ref fixes this:

```tsx
// src/components/AddProfileForm.tsx

import { useState, useRef, useEffect } from 'react'

function AddProfileForm({ onAdd, onCancel }: AddProfileFormProps) {
  const [form, setForm]     = useState<ProfileFormState>(init)
  const [errors, setErrors] = useState<ProfileFormErrors>({})

  // Focus the first field as soon as the form opens
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="name">Full name *</label>
      <input
        ref={nameRef}  // attach the ref
        id="name" name="name" type="text"
        value={form.name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {/* rest of form unchanged */}
    </form>
  )
}
```

Because the form re-mounts every time `showForm` becomes `true`, the `useEffect` runs fresh each time the modal opens — no extra reset logic needed.

### 9.2 — Track how many times App re-renders

Drop a render counter into `App.tsx` during development. This helps you notice if adding the form is causing unexpected extra renders:

```tsx
// src/App.tsx — add near the top of the function body

const renderCount = useRef(0)
renderCount.current += 1

// Somewhere visible in the JSX (remove before production):
<p style={{ fontSize: "10px", color: "#cbd5e1", textAlign: "right" }}>
  App renders: {renderCount.current}
</p>
```

Open the app and watch the counter. Click "+ Add Profile" — the counter increments once (`showForm` changes). Type in the name field — the counter does not move (form state lives inside `AddProfileForm`, not `App`). This confirms that `App` re-renders only when its own state changes.

### 9.3 — Storing the last-opened manager name

In `App.tsx`, when the user closes the `PortfolioSummary` sidebar, `selectedManager` resets to `null`. If they reopen it, they must click a card again. A ref can remember the last selection without affecting the UI:

```tsx
// src/App.tsx

const [selectedManager, setSelectedManager] = useState<string | null>(null)

// Ref: stores the last-selected name for logging / analytics.
// Does not cause a re-render when it changes.
const lastSelectedRef = useRef<string | null>(null)

const handleSelectManager = (name: string) => {
  lastSelectedRef.current = name  // update ref silently
  setSelectedManager(name)        // update state — triggers render
}

const handleClose = () => {
  // Log which profile was viewed (analytics, not displayed on screen)
  console.log("Closed portfolio for:", lastSelectedRef.current)
  setSelectedManager(null)
}
```

The ref stores the last-selected manager for analytics without causing any extra re-renders. The state drives what the screen shows. The ref drives what the analytics log records. Each does what it is best at.

---

## Summary

| Concept | Key point |
|---|---|
| **`useRef` returns** | An object `{ current: value }` that persists across renders |
| **Two uses** | 1) Hold a DOM node  2) Hold a value without triggering re-renders |
| **DOM ref — create** | `useRef<HTMLInputElement>(null)` — start `null`, attach with `ref={}` |
| **DOM ref — use** | Only inside `useEffect` or event handlers, after component has mounted |
| **Value ref — update** | `ref.current = newValue` — immediate, silent, no re-render |
| **Auto-focus pattern** | `useEffect(() => { ref.current?.focus() }, [])` |
| **Timer ID pattern** | `useRef<ReturnType<typeof setInterval> \| null>(null)` |
| **Previous value pattern** | `useEffect(() => { prevRef.current = value })` — no dep array |
| **`isMounted` pattern** | Set `true` on mount, `false` in cleanup — guards async callbacks |
| **Render counter** | `renderCount.current += 1` in body — never causes infinite loop |
| **`forwardRef`** | Needed when a parent ref must point inside a child component |
| **useRef vs useState — rule** | Screen sees it → `useState`. Internal plumbing → `useRef` |

---

> *Lab 8 will cover `useContext` and the Context API — sharing state across the component tree without prop drilling, and when to reach for it vs lifting state vs a state management library.*
