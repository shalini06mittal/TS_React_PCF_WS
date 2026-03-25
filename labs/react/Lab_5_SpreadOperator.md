# React + TypeScript Lab Series — Lab 8: The Spread Operator

> **Why React depends on it · Arrays · Objects · Props · State updates**

*This lab is about one operator: `...` (three dots). It appears in almost every React file you will ever write. Understanding it deeply will make every other React concept easier. No prior knowledge of the spread operator is assumed.*

---

## Table of Contents

1. [What is the Spread Operator?](#1-what-is-the-spread-operator)
2. [Why React Needs Immutability](#2-why-react-needs-immutability)
3. [Spread With Arrays](#3-spread-with-arrays)
   - [3.1 — Adding an item](#31--adding-an-item)
   - [3.2 — Removing an item](#32--removing-an-item)
   - [3.3 — Updating one item in an array](#33--updating-one-item-in-an-array)
   - [3.4 — Merging two arrays](#34--merging-two-arrays)
4. [Spread With Objects](#4-spread-with-objects)
   - [4.1 — Copying an object](#41--copying-an-object)
   - [4.2 — Updating one field in an object](#42--updating-one-field-in-an-object)
   - [4.3 — Updating a field with a computed key](#43--updating-a-field-with-a-computed-key)
   - [4.4 — Merging two objects](#44--merging-two-objects)
5. [Spread for Props in React](#5-spread-for-props-in-react)
   - [5.1 — Basic prop spread](#51--basic-prop-spread)
   - [5.2 — Spreading a Profile object directly](#52--spreading-a-profile-object-directly)
   - [5.3 — Overriding one prop while spreading the rest](#53--overriding-one-prop-while-spreading-the-rest)
6. [Spread in State Updates](#6-spread-in-state-updates)
   - [Pattern 1 — Add to array](#pattern-1--add-to-array)
   - [Pattern 2 — Remove from array](#pattern-2--remove-from-array)
   - [Pattern 3 — Update one item in array](#pattern-3--update-one-item-in-array)
   - [Pattern 4 — Update one field of an object state](#pattern-4--update-one-field-of-an-object-state)
7. [Common Mistakes](#7-common-mistakes)
8. [Full Example — Profile State with All Four Patterns](#8-full-example--profile-state-with-all-four-patterns)
9. [Summary — Every Pattern at a Glance](#summary--every-pattern-at-a-glance)

---

## 1. What is the Spread Operator?

### `...` — three dots that copy things

The spread operator is three dots written before an array or object. It means: **take everything inside this thing and pour it out.**

> 🧂 **Think of a salt shaker**
>
> The shaker contains many grains of salt. When you spread it, every grain comes out individually. The spread operator does the same: it takes everything packed inside an array or object and spreads each item out individually.

```ts
// arrays — with vs without spread

// A simple array
const numbers = [1, 2, 3]

// Without spread — the whole array goes in as one item
const a = [numbers, 4, 5]
// Result: [ [1, 2, 3], 4, 5 ]  ← nested array inside

// With spread — each item pours out individually
const b = [...numbers, 4, 5]
// Result: [ 1, 2, 3, 4, 5 ]  ← flat array
```

The same idea works on objects:

```ts
// objects — with vs without spread

const person = { name: "Alex", age: 30 }

// Without spread — the object goes in as one nested value
const wrapped = { data: person }
// Result: { data: { name: "Alex", age: 30 } }

// With spread — every key pours out at the current level
const flat = { ...person, city: "Mumbai" }
// Result: { name: "Alex", age: 30, city: "Mumbai" }
```

> 💡 **Three dots, two contexts**
>
> The same `...` syntax is used for both **spread** (pouring out) and **rest parameters** (gathering up). In this lab we focus exclusively on spread — pouring data out of arrays and objects.

---

## 2. Why React Needs Immutability

### The rule that makes spread essential

Before understanding spread in React, you need to understand one rule React enforces:

> 🔑 **React's immutability rule**
>
> React detects state changes by comparing **references**, not contents.
>
> If you hand back the same array or object reference, React thinks nothing changed and **skips the re-render**.
>
> You must always create a **NEW** array or object — never modify the existing one.

The spread operator is the primary tool for creating those new arrays and objects while keeping all the data intact.

**Why reference comparison?**

Comparing two objects by their contents (deep equality) is expensive — imagine an array of 10,000 items. React instead checks: *is this the exact same thing in memory?* If yes, skip re-render. If no, re-render. This is fast and predictable, but it means you must hand React a genuinely new reference whenever data changes.

| ❌ Mutation — React sees no change | ✅ Spread — new reference, React re-renders |
|---|---|
| `todos.push({ id:3, text })` | `setTodos([...todos, { id:3, text }])` |
| `setTodos(todos)` // same ref! | |

```ts
// ❌ Wrong — push() modifies the SAME array
// The reference is unchanged
// React compares old ref === new ref → true → skips re-render
// Screen stays the same
todos.push({ id: 3, text })
setTodos(todos) // same ref!

// ✅ Correct — [...todos] creates a BRAND NEW array
// The reference is different
// React compares old ref !== new ref → false → re-renders
// Screen shows the new item
setTodos([...todos, { id: 3, text }])
```

> This is not a preference or a style choice. It is a **hard requirement**. React will not work correctly if you mutate state directly.

---

## 3. Spread With Arrays

### The three operations React uses constantly

There are three things you do with arrays in React: **add** an item, **remove** an item, **update** an item. Each uses spread in a slightly different way.

### 3.1 — Adding an item

Place the spread of the existing array first, then the new item after it. The new item appears at the end.

```ts
// adding items

const fruits = ["apple", "banana"]

// Add "cherry" at the end
const newFruits = [...fruits, "cherry"]
// Result: ["apple", "banana", "cherry"]

// Add "mango" at the beginning
const withMango = ["mango", ...fruits]
// Result: ["mango", "apple", "banana"]

// In a React state update:
const addTodo = (text: string) => {
  setTodos([...todos, { id: Date.now(), text, done: false }])
}
```

### 3.2 — Removing an item

Use `.filter()` to create a new array that excludes the unwanted item. `filter` always returns a new array, so spread is not needed here — but the immutability principle is the same.

```ts
// removing items

const fruits = ["apple", "banana", "cherry"]

// Remove "banana"
const withoutBanana = fruits.filter(f => f !== "banana")
// Result: ["apple", "cherry"]

// In a React state update — remove by id:
const deleteTodo = (id: number) => {
  setTodos(todos.filter(todo => todo.id !== id))
}
```

### 3.3 — Updating one item in an array

Use `.map()` to create a new array where one item is replaced. Map always returns a new array. Inside the map, use the spread operator on the specific object you want to update.

```ts
// updating one item

const todos = [
  { id: 1, text: "Buy milk", done: false },
  { id: 2, text: "Read book", done: false },
]

// Toggle done on id 1
const updated = todos.map(todo =>
  todo.id === 1
    ? { ...todo, done: !todo.done } // new object, one field changed
    : todo                          // all others unchanged
)

// Result:
// [
//   { id: 1, text: "Buy milk", done: true },   ← changed
//   { id: 2, text: "Read book", done: false },  ← untouched
// ]

// In a React state update:
const toggleTodo = (id: number) => {
  setTodos(todos.map(todo =>
    todo.id === id
      ? { ...todo, done: !todo.done }
      : todo
  ))
}
```

**Why `{ ...todo, done: !todo.done }` works**

This line creates a new object by:

- First, `...todo` copies every existing field into the new object: `id`, `text`, `done`
- Then, `done: !todo.done` is written **after** the spread, which overwrites the `done` field that was just copied
- The result is an object identical to the original except for one field

If `done` appeared **before** the spread (`{ done: !todo.done, ...todo }`), the spread would overwrite it back to the original value. The field listed **after** the spread always wins.

### 3.4 — Merging two arrays

```ts
// merging arrays

const frontend = ["React", "TypeScript", "CSS"]
const backend  = ["Node.js", "PostgreSQL", "Docker"]

// Combine both into one
const allSkills = [...frontend, ...backend]
// Result: ["React", "TypeScript", "CSS", "Node.js", "PostgreSQL", "Docker"]
```

---

## 4. Spread With Objects

### Copying, updating, merging

### 4.1 — Copying an object

The most basic use: create a shallow copy so you can modify the copy without affecting the original.

```ts
// copying objects

const original = { name: "Alex", role: "Portfolio Manager", isActive: true }

// Shallow copy — a new object with the same fields
const copy = { ...original }

// Modifying copy does NOT affect original
copy.name = "Sara"

console.log(original.name) // "Alex" — unchanged
console.log(copy.name)     // "Sara" — modified copy
```

> ⚠️ **Shallow copy only**
>
> Spread copies **one level deep**. If a field itself contains an object or array (nested data), the spread copy and the original still share that nested reference. For deeply nested data you need a deep clone — but in most React state patterns, keeping objects flat avoids this problem.

### 4.2 — Updating one field in an object

This is the most common pattern in React forms and state updates.

```ts
// updating one field

const profile = {
  id: 1,
  name: "Alex Chan",
  role: "Portfolio Manager",
  isActive: true,
  featured: false,
}

// Update only isActive — all other fields unchanged
const updated = { ...profile, isActive: false }

// Result:
// {
//   id: 1,
//   name: "Alex Chan",
//   role: "Portfolio Manager",
//   isActive: false,   ← changed
//   featured: false,
// }

// The field listed AFTER the spread wins.
// Order matters.
```

### 4.3 — Updating a field with a computed key

Here using `[name]` will replace the value of `name` with the value of the `name` key, and `value` with the value in the `value` key.

```ts
// computed property name

let obj = { name: 'shalini', city: 'mumbai' }

const { name, value } = { name: 'name', value: 'varsha' }
let obj1 = { ...obj, [name]: value }
console.log(obj1) // prints { name: 'varsha', city: 'mumbai' }

const { name: name2, value: value2 } = { name: 'city', value: 'Pune' }
let obj2 = { ...obj, [name2]: value2 }
console.log(obj2) // prints { name: 'shalini', city: 'Pune' }
```

In controlled forms, you have one generic handler that must update any field by name. The **computed property name** syntax lets you use a variable as the key:

```ts
// computed property name in controlled forms

// e.target.name is "email", e.target.value is "alex@example.com"

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setForm(prev => ({
    ...prev,           // copy all existing form fields
    [name]: value,     // [name] is computed: key = "email", value = "alex@example.com"
  }))
}

// Equivalent to writing:
// setForm(prev => ({ ...prev, email: "alex@example.com" }))
// but works for ANY field name dynamically.
```

### 4.4 — Merging two objects

When two objects have different keys, spread merges them. When both have the same key, the **later one wins**.

```ts
// merging objects

const defaults = {
  theme: "light",
  language: "en",
  fontSize: 14,
}

const userPrefs = {
  theme: "dark",    // overrides default
  fontSize: 16,     // overrides default
}

// Merge: userPrefs overrides matching keys in defaults
const settings = { ...defaults, ...userPrefs }

// Result:
// {
//   theme: "dark",    ← from userPrefs (wins)
//   language: "en",   ← from defaults (kept)
//   fontSize: 16,     ← from userPrefs (wins)
// }
```

> 💡 **Order matters in object spread**
>
> The **rightmost** spread always wins for duplicate keys. `{ ...a, ...b }` means `b` overrides `a`. `{ ...b, ...a }` means `a` overrides `b`. This is how defaults + overrides patterns work.

---

## 5. Spread for Props in React

### Passing props cleanly between components

The spread operator has a special use in JSX: spreading an object directly onto a component as individual props. This is called **prop spreading**.

### 5.1 — Basic prop spread

Instead of writing every prop attribute by hand, spread an object that contains them all:

```tsx
// prop spreading

const cardProps = {
  name: "Alex Chan",
  role: "Portfolio Manager",
  isActive: true,
  featured: true,
}

// Without spread — every prop listed by hand
<ProfileCard
  name={cardProps.name}
  role={cardProps.role}
  isActive={cardProps.isActive}
  featured={cardProps.featured}
/>

// With spread — same result, far less typing
<ProfileCard {...cardProps} />
```

### 5.2 — Spreading a Profile object directly

Your `Profile` interface already has exactly the fields `ProfileCard` expects (minus `id` which the card does not need). You can spread the profile object and add `onSelect` separately:

```tsx
// spreading profile props — src/App.tsx

// Without spread — repetitive
{profiles.map(profile => (
  <ProfileCard
    key={profile.id}
    name={profile.name}
    role={profile.role}
    bio={profile.bio}
    skills={profile.skills}
    avatarUrl={profile.avatarUrl}
    isActive={profile.isActive}
    featured={profile.featured}
    onSelect={setSelectedManager}
  />
))}

// With spread — concise and less error-prone
{profiles.map(({ id, ...rest }) => (
  <ProfileCard
    key={id}
    {...rest}
    onSelect={setSelectedManager}
  />
))}
```

The destructure `{ id, ...rest }` in the parameter is the **rest pattern** — the mirror of spread. It pulls `id` out separately (for the `key`) and collects everything else into `rest`. Then `{...rest}` spreads the remaining fields onto `ProfileCard` as individual props.

### 5.3 — Overriding one prop while spreading the rest

A common pattern when building reusable components: accept all standard props but override one specific one:

```tsx
// overriding after spread

// A reusable Button that forces type="button" to prevent accidental form submits

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost"
}

function SafeButton({ variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      {...props}            // spread all standard button attributes
      type="button"         // override type AFTER spread — always wins
      className={`btn btn-${variant}`}
    />
  )
}

// Usage — onClick, disabled, style etc. all work normally:
<SafeButton onClick={handleSave} disabled={!isValid}>
  Save
</SafeButton>
```

> ⚠️ **Prop spread and TypeScript**
>
> When you spread `...props` onto a DOM element, TypeScript checks that the props object only contains valid HTML attributes. If you spread a custom interface that includes non-HTML fields, TypeScript will flag it. Use `Omit<>` to exclude the custom fields before spreading.

---

## 6. Spread in State Updates

### The four patterns React developers use every day

This section gathers all the state update patterns that use spread into one place for reference.

### Pattern 1 — Add to array

```ts
// add

// append
setItems(prev => [...prev, newItem])

// prepend
setItems(prev => [newItem, ...prev])

// insert at index i
setItems(prev => [
  ...prev.slice(0, i),
  newItem,
  ...prev.slice(i),
])
```

### Pattern 2 — Remove from array

```ts
// remove

// remove by id
setItems(prev => prev.filter(item => item.id !== id))

// remove by index
setItems(prev => prev.filter((_, i) => i !== indexToRemove))
```

### Pattern 3 — Update one item in array

```ts
// update item

// update one field of one item (e.g. toggle done)
setItems(prev => prev.map(item =>
  item.id === id
    ? { ...item, done: !item.done }
    : item
))

// replace one item entirely
setItems(prev => prev.map(item =>
  item.id === id ? updatedItem : item
))
```

### Pattern 4 — Update one field of an object state

```ts
// update object

// update a single named field
setProfile(prev => ({ ...prev, isActive: false }))

// update any field by name (controlled forms)
setForm(prev => ({ ...prev, [fieldName]: fieldValue }))

// update a nested object (requires two spreads)
setUser(prev => ({
  ...prev,
  address: {
    ...prev.address,   // copy existing address fields
    city: "Mumbai",    // override one field
  },
}))
```

**The `prev` pattern**

Notice all four patterns above use `setX(prev => ...)` instead of `setX(currentValue...)`. Using the function form with `prev` is safer because React may batch multiple state updates. `prev` is guaranteed to be the most recent value at the time the update runs.

| ❌ Can be stale — direct reference | ✅ Always fresh — `prev` function form |
|---|---|
| `setTodos([...todos, newItem])` | `setTodos(prev => [...prev, newItem])` |
| If `addItem` is called twice quickly, the second call may still see the original `todos`, missing the first addition. | Even if called twice in a row, the second call receives the array that already includes the first addition. |

---

## 7. Common Mistakes

### What goes wrong and why

### Mistake 1 — Forgetting to spread (mutating directly)

```ts
// ❌ Wrong — modifying the existing array
const addTodo = (text: string) => {
  todos.push({ id: Date.now(), text, done: false })
  setTodos(todos) // same reference — React ignores this
}

// ❌ Wrong — modifying the existing object
const deactivate = () => {
  profile.isActive = false
  setProfile(profile) // same reference — React ignores this
}

// ✅ Correct
const addTodo = (text: string) =>
  setTodos(prev => [...prev, { id: Date.now(), text, done: false }])

const deactivate = () =>
  setProfile(prev => ({ ...prev, isActive: false }))
```

### Mistake 2 — Spread inside vs outside `setX`

```ts
// ❌ Wrong — spreads first, then passes the array to setX
// The spread happens outside the setter — creates the array immediately.
// If state has changed since this line, you get a stale result.
const newArr = [...todos, newItem]
setTodos(newArr)

// ✅ Correct — spread happens inside the updater function.
// prev is always the latest value.
setTodos(prev => [...prev, newItem])
```

### Mistake 3 — Wrong field override order

```ts
const profile = { name: "Alex", isActive: true }

// ❌ Wrong — spread comes AFTER the field you want to override.
// The spread overwrites your change.
const broken = { isActive: false, ...profile }
// Result: { isActive: true }  ← profile.isActive wins

// ✅ Correct — field you want to override comes AFTER the spread.
const fixed = { ...profile, isActive: false }
// Result: { isActive: false }  ← your value wins
```

### Mistake 4 — Spread does not deep-clone

```ts
const state = {
  name: "Alex",
  address: { city: "Mumbai", pincode: "400001" }
}

// ❌ Shallow copy — address is still the SAME reference
const copy = { ...state }
copy.address.city = "Delhi" // modifies the original state too!
console.log(state.address.city) // "Delhi" — original was mutated

// ✅ Deep copy — spread the nested object too
const safeCopy = {
  ...state,
  address: { ...state.address, city: "Delhi" }
}
// Now state.address is untouched.
```

### Mistake 5 — Spreading `undefined` or `null`

```ts
// ❌ Crashes — cannot spread null or undefined
const data = null
const result = { ...data } // TypeError at runtime

// ✅ Guard with || or ?? before spreading
const result = { ...(data ?? {}) } // safe — falls back to empty object

// ✅ Or check before:
const result = data ? { ...data, extra: true } : { extra: true }
```

---

## 8. Full Example — Profile State with All Four Patterns

### Putting it all together

Here is a complete standalone component that demonstrates every array and object spread pattern in the context of a profile list — the same data shape as your portfolio dashboard.

```tsx
// src/components/ProfileManager.tsx

import { useState } from 'react'

interface Profile {
  id: number
  name: string
  role: string
  isActive: boolean
}

const initialProfiles: Profile[] = [
  { id: 1, name: "Alex Chan",    role: "Portfolio Manager",  isActive: true  },
  { id: 2, name: "Riya Mehta",   role: "Risk Analyst",       isActive: true  },
  { id: 3, name: "Daniel Kim",   role: "Quant Researcher",   isActive: false },
]

function ProfileManager() {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)

  // ── ADD ─────────────────────────────────────────────────────────
  const addProfile = (name: string, role: string) => {
    setProfiles(prev => [
      ...prev,
      { id: Date.now(), name, role, isActive: true },
    ])
  }

  // ── DELETE ──────────────────────────────────────────────────────
  const deleteProfile = (id: number) => {
    setProfiles(prev => prev.filter(p => p.id !== id))
  }

  // ── TOGGLE isActive ─────────────────────────────────────────────
  const toggleActive = (id: number) => {
    setProfiles(prev => prev.map(p =>
      p.id === id
        ? { ...p, isActive: !p.isActive } // new object, one field flipped
        : p
    ))
  }

  // ── RENAME ──────────────────────────────────────────────────────
  const renameProfile = (id: number, newName: string) => {
    setProfiles(prev => prev.map(p =>
      p.id === id
        ? { ...p, name: newName } // spread copies id, role, isActive
        : p
    ))
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "560px" }}>
      <h2>Profiles ({profiles.length})</h2>

      {profiles.map(({ id, ...rest }) => (
        <div key={id}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px", border: "1px solid #e2e8f0",
            borderRadius: "8px", marginBottom: "8px"
          }}
        >
          <div>
            <strong>{rest.name}</strong>
            <span style={{ marginLeft: "8px", fontSize: "12px",
              color: rest.isActive ? "#16a34a" : "#dc2626" }}>
              {rest.isActive ? "Active" : "Inactive"}
            </span>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>{rest.role}</p>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => toggleActive(id)}>Toggle</button>
            <button onClick={() => renameProfile(id, rest.name + "!")}>Rename</button>
            <button onClick={() => deleteProfile(id)} style={{ color: "#ef4444" }}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => addProfile("New Manager", "Analyst")}
        style={{
          marginTop: "1rem", padding: "10px 20px",
          background: "#0D9488", color: "white",
          border: "none", borderRadius: "8px", cursor: "pointer"
        }}
      >
        + Add Profile
      </button>
    </div>
  )
}

export default ProfileManager
```

**Trace each button through the code**

- **"+ Add Profile":** calls `addProfile` → `setProfiles(prev => [...prev, newProfile])` → new array with new item appended → React re-renders → new row appears.
- **"Toggle":** calls `toggleActive` → `prev.map(p => p.id===id ? {...p, isActive:!p.isActive} : p)` → new array where only one object changed → React re-renders → status badge flips colour.
- **"Rename":** calls `renameProfile` → `prev.map(p => p.id===id ? {...p, name:newName} : p)` → new array where only the name field of one object changed → React re-renders → name updates.
- **"Delete":** calls `deleteProfile` → `prev.filter(p => p.id !== id)` → new array without that item → React re-renders → row disappears.

---

## Summary — Every Pattern at a Glance

| Pattern | What it does |
|---|---|
| `[...arr]` | Copy an array — new reference, same items |
| `[...arr, newItem]` | Add item to end — immutable append |
| `[newItem, ...arr]` | Add item to start — immutable prepend |
| `arr.filter(x => x.id !== id)` | Remove an item — returns new array without it |
| `arr.map(x => x.id===id ? {...x, field:val} : x)` | Update one item — map + spread inside |
| `{ ...obj }` | Shallow copy of an object — new reference |
| `{ ...obj, key: val }` | Copy + override one field — field **after** spread wins |
| `{ ...a, ...b }` | Merge two objects — `b`'s keys override `a`'s |
| `{ ...prev, [name]: value }` | Computed property name — dynamic key in controlled forms |
| `setX(prev => [...prev, x])` | Functional update form — `prev` is always the freshest value |
| `<Component {...rest} />` | Spreading props onto a JSX component |
| `{ id, ...rest } = profile` | Rest destructuring — pull one field out, collect the others |

---

> *The spread operator is not a React feature — it is plain JavaScript (ES2018).*
>
> *React depends on it because React depends on immutability.*
>
> *Master spread and you have mastered the most common pattern in every React codebase.*
