# React + TypeScript Lab Series
## Lab 5 — Todo List
**props • useState • useEffect • useRef • CRUD • Controlled Forms**

---

> *This lab builds a complete Todo List application step by step. Each step introduces exactly one new concept, explains why it is needed, then shows it working in code. By the end you will have a fully working app with add, delete, and complete-toggle functionality.*

---

| Step | Concept | What you build |
|---|---|---|
| **1** | **Interface + dummy data** | Define the Todo type and seed data |
| **2** | **Props** | TodoItem component — receive and display one todo |
| **3** | **useState** | TodoList component — manage an array of todos |
| **4** | **useEffect + mock fetch** | Load dummy data with a simulated API call |
| **5** | **Controlled form** | AddTodoForm — input field that React controls |
| **6** | **CRUD — Add** | Wire up the form to add a new todo |
| **7** | **CRUD — Delete** | Remove a todo by id |
| **8** | **CRUD — Strike** | Toggle a todo done/undone |
| **9** | **useRef** | Auto-focus the input; track render count |

---

## Step 1 — The Todo Interface + Dummy Data
### `src/types/todo.ts` • `src/data/todos.ts`

Before writing any component, define the shape of your data. In TypeScript, an interface describes exactly what fields an object must have and what types they must be. Every other file in the project will import this interface — it is the single source of truth for what a todo looks like.

Create project:

```bash
npm create vite@latest todo-app -- --template react-ts
```

**Why `interface` and not `type`?**

Both <mark>interface</mark> and <mark>type</mark> work for this purpose and the difference is minor at this level. We use <mark>interface</mark> here because it reads clearly as a contract — "a Todo object must have these fields" — and it is the conventional choice for describing object shapes in React projects.

```ts
// src/types/todo.ts

export interface Todo {
  id:        number   // unique identifier for each todo
  text:      string   // the todo description
  done:      boolean  // false = pending, true = completed
  createdAt: Date     // when was it created
}
```

**`createdAt: Date`** — TypeScript has a built-in <mark>Date</mark> type. When we create new todos later we will use <mark>new Date()</mark> as the default value, which gives the current date and time automatically.

### Dummy data

Create a second file with some pre-made todos. This lets you see the app working immediately without building the add form first.

```ts
// src/data/todos.ts

import type { Todo } from '../types/todo'

export const dummyTodos: Todo[] = [
  {
    id: 1,
    text: "Review quarterly portfolio report",
    done: false,
    createdAt: new Date('2025-06-01'),
  },
  {
    id: 2,
    text: "Schedule meeting with risk analyst",
    done: true,
    createdAt: new Date('2025-06-02'),
  },
  {
    id: 3,
    text: "Update asset allocation spreadsheet",
    done: false,
    createdAt: new Date('2025-06-03'),
  },
]
```

> 💡 **Why separate files?**
>
> Putting the interface in `types/todo.ts` and the data in `data/todos.ts` keeps them independent. Any component can import the type without importing the data, and vice versa. This separation becomes important as the project grows.

---

## Step 2 — Props — The TodoItem Component
### `src/components/TodoItem.tsx`

Props are the way a parent component passes data down to a child. A child component declares what props it expects using a TypeScript interface. When the parent renders the child, it must provide those values as attributes.

`TodoItem` is responsible for displaying a single todo. It receives one todo object as a prop and renders its text, date, and done status. It does not manage any state — it only displays what it receives.

### The component

```tsx
// src/components/TodoItem.tsx

import type { Todo } from '../types/todo'

// Props interface: what this component expects from its parent
interface TodoItemProps {
  todo: Todo
}

function TodoItem({ todo }: TodoItemProps) {
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      marginBottom: '8px',
      background: todo.done ? '#f8fafc' : '#ffffff',
    }}>
      <p style={{
        margin: '0 0 4px',
        textDecoration: todo.done ? "line-through" : "none",
        color: todo.done ? '#94a3b8' : '#1a2b4a',
        fontWeight: '500',
      }}>
        {todo.text}
      </p>
      <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
        Created: {todo.createdAt.toLocaleDateString()}
      </p>
    </div>
  )
}

export default TodoItem
```

### Use it in App.tsx to verify it works

Before building the full list, render just <mark>TodoItem</mark> once in <mark>App.tsx</mark> with hardcoded data. This confirms the component is wired up correctly before adding complexity.

```tsx
// src/App.tsx — temporary test render

import TodoItem from './components/TodoItem'
import { dummyTodos } from './data/todos'

function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1>My Todos</h1>
      {/* Render just the first todo to verify props work */}
      <TodoItem todo={dummyTodos[0]} />
    </div>
  )
}

export default App
```

You should see one todo card with the text, strikethrough if done, and the created date. If TypeScript shows any red underlines, it means the prop shape does not match the interface — read the error message, it will tell you exactly which field is wrong.

> 📝 **Props rule**
>
> Props flow in one direction: parent to child. `TodoItem` cannot change the todo object it receives. If data needs to change, the change must happen in the parent and flow back down as new props. You will see this in Step 6.

---

## Step 3 — useState — The TodoList Component
### `src/components/TodoList.tsx`

`useState` stores data that belongs to a component and can change over time. When state changes, React re-renders the component so the screen always shows the latest value.

`TodoList` owns the array of todos. It keeps that array in state, maps over it to render a `TodoItem` for each one, and will later expose functions to add, delete, and toggle todos.

### The component — static list from dummy data

Start simple: initialise state directly from the dummy data array. No fetching yet — just get the list rendering.

```tsx
// src/components/TodoList.tsx

import { useState } from 'react'
import type { Todo } from '../types/todo'
import { dummyTodos } from '../data/todos'
import TodoItem from './TodoItem'

function TodoList() {

  // State: the array of todos
  // Initialised from dummyTodos — every todo starts here
  const [todos, setTodos] = useState<Todo[]>(dummyTodos)

  return (
    <div>
      <h2>Tasks ({todos.length})</h2>
      {todos.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No tasks yet. Add one below.</p>
      )}
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
    </div>
  )
}

export default TodoList
```

### Update App.tsx to use TodoList

<b>Comment out the  `<TodoItem todo={dummyTodos[0]}/>`</b> in App.tsx
```tsx
// src/App.tsx

import TodoList from './components/TodoList'

function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1>My Todos</h1>
      <mark><TodoList /></mark>
    </div>
  )
}

export default App
```

All three dummy todos now appear. The count in the heading updates automatically because it reads from the `todos` array in state.

### Why useState and not a plain variable?

<table>
<thead>
<tr>
<th>❌ Plain variable — list never updates</th>
<th>✅ useState — screen updates</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
function TodoList() {

  // Plain variable.
  // Add a todo → array changes
  // in memory, but React has
  // no idea. Screen stays the same.

  let todos = [...dummyTodos]

  return (
    <div>
      {todos.map(t => ...)}
    </div>
  )
}
```

</td>
<td>

```tsx
function TodoList() {

  // useState.
  // Call setTodos with a new array
  // → React re-renders, screen
  // shows the updated list.

  const [todos, setTodos] =
    useState<Todo[]>(dummyTodos)

  return (
    <div>
      {todos.map(t => ...)}
    </div>
  )
}
```

</td>
</tr>
</tbody>
</table>

---

## Step 4 — useEffect — Mock Fetch API Call
### `src/components/TodoList.tsx` (updated)

In a real app, todos would come from a server. `useEffect` with an empty dependency array runs once after the component mounts — the right place to fetch initial data. We simulate the network delay with `setTimeout` so the loading state is visible.

### The loading / error / data pattern

Any component that fetches data needs three state variables working together:

- <mark>isLoading</mark> — `true` while the request is in flight; used to show a spinner or placeholder
- <mark>error</mark> — stores an error message if the request fails; `null` when everything is fine
- <mark>todos</mark> — the fetched data; starts as an empty array

### Updated TodoList with mock fetch

```tsx
// src/components/TodoList.tsx — updated

import { useState, useEffect } from 'react'
import type { Todo } from '../types/todo'
import { dummyTodos } from '../data/todos'
import TodoItem from './TodoItem'

function TodoList() {

<mark>//   const [todos, setTodos] = useState<Todo[]>(dummyTodos)<mark>
<mark>  const [todos,     setTodos]     = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error,     setError]     = useState<string | null>(null)

  // Runs once on mount — simulates a fetch call
  useEffect(() => {
    setIsLoading(true)

    // Simulate a 1-second network delay
    const timer = setTimeout(() => {
      try {
        // In a real app: const data = await fetch("/api/todos")
        setTodos(dummyTodos)
        setIsLoading(false)
      } catch (e) {
        setError("Failed to load todos")
        setIsLoading(false)
      }
    }, 1000)

    // Cleanup: cancel the timer if the component unmounts early
    return () => clearTimeout(timer)

  }, []) // empty array = run once on mount

  // Render: show different UI for each state
  if (isLoading) return <p>Loading tasks...</p>
  if (error)     return <p style={{ color: "red" }}>{error}</p>
</mark>
  return (
    <div>
      <h2>Tasks ({todos.length})</h2>
      {todos.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No tasks yet. Add one below.</p>
      )}
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
    </div>
  )
}

export default TodoList
```

The app now shows "Loading tasks..." for one second, then the list fades in. The cleanup function (`return () => clearTimeout(timer)`) cancels the timer if the component unmounts before the second is up — preventing a state update on an unmounted component.

> 💡 **Replacing the mock later**
>
> When you connect a real API, replace the `setTimeout` block with a real `fetch` call. The `isLoading`, `error`, and `setTodos` logic around it stays exactly the same. The mock is a stand-in for any async operation.

---

## Step 5 — Controlled Forms — AddTodoForm
### `src/components/AddTodoForm.tsx`

A controlled form is one where React state is the single source of truth for every input's value. The input does not hold its own value — React does. This gives you full control: you can validate, transform, or block input on every keystroke.

### How a controlled input works

<table>
<thead>
<tr>
<th>❌ Uncontrolled — DOM owns the value</th>
<th>✅ Controlled — React owns the value</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```tsx
// React has no idea what
// is typed in this input.
// You must read the DOM
// directly to get the value.

<input type="text" />

// To read value:
document.getElementById("inp")
  .value
```

</td>
<td>

```tsx
// React state holds the value.
// Every keystroke updates state.
// You always have the latest
// value in a JS variable.

const [text, setText] = useState("")

<input
  value={text}
  onChange={e =>
    setText(e.target.value)}
/>
```

</td>
</tr>
</tbody>
</table>

The two attributes that make an input controlled are: <mark>value={text}</mark> which ties the input's display to React state, and <mark>onChange={e => setText(e.target.value)}</mark> which updates state on every keystroke. Without both, the input breaks.

### The AddTodoForm component

This component has one prop: <mark>onAdd</mark>, a function the parent passes down. When the form is submitted, `AddTodoForm` calls <mark>onAdd</mark> with the new todo text. The parent (`TodoList`) decides what to do with it. This is the same event-up pattern from Lab 2.

```tsx
// src/components/AddTodoForm.tsx

import { useState } from 'react'

interface AddTodoFormProps {
  onAdd: (text: string) => void  // called when user submits
}

function AddTodoForm({ onAdd }: AddTodoFormProps) {

  // Controlled input state
  const [text, setText] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()            // stop the browser from refreshing the page
    if (!text.trim()) return      // do nothing if input is empty or whitespace
    onAdd(text.trim())            // send the trimmed text up to the parent
    setText("")                   // clear the input after submitting
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display:"flex", gap:"8px", marginBottom:"1.5rem" }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          fontSize: "14px",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          background: "#0D9488",
          color: "white",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Add
      </button>
    </form>
  )
}

export default AddTodoForm
```

At this point <mark>AddTodoForm</mark> is complete but not yet connected to anything. Render it in <mark>TodoList</mark> with a placeholder <mark>onAdd</mark> to confirm it renders, then we will wire it up in Step 6:

```tsx
// Temporary — inside TodoList return, above the task count heading
// We will replace this placeholder in Step 6

<AddTodoForm onAdd={(text) => console.log("Will add:", text)} />
```

Type something in the input and click Add. You will see "Will add: your text" in the browser console. The form clears after submit. This confirms the controlled input and `onAdd` prop are both working before we wire up the real logic.

---

## Step 6 — CRUD — Add a Todo
### `src/components/TodoList.tsx` (updated)

With the interface, state, and form all working independently, it is time to connect them. Adding a todo means: create a new `Todo` object that matches the interface, then update state with a new array that includes it.

### The addTodo function

This function lives in <mark>TodoList</mark> because that is where the <mark>todos</mark> state lives. It creates a new todo object and passes it to <mark>setTodos</mark> using the spread operator to build a new array.

```tsx
// Inside TodoList — the addTodo function
<mark>
const addTodo = (text: string) => {
  const newTodo: Todo = {
    id:        Date.now(),  // simple unique id: current timestamp as number
    text:      text,
    done:      false,       // all new todos start as not done
    createdAt: new Date(),  // current date and time — the default value
  }

  // Spread the existing array and append the new todo at the end
  setTodos([...todos, newTodo])
}</mark>
```

**`...todos`** is the spread operator. <mark>[...todos, newTodo]</mark> creates a brand new array containing all existing todos plus the new one. We never `push()` into the existing array — React requires a new array reference to detect that state changed.

### Full updated TodoList

```tsx
// src/components/TodoList.tsx — with addTodo wired up

import { useState, useEffect } from 'react'
import type { Todo } from '../types/todo'
import { dummyTodos } from '../data/todos'
import TodoItem from './TodoItem'
<mark>import AddTodoForm from './AddTodoForm'</mark>

function TodoList() {

  const [todos,     setTodos]     = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTodos(dummyTodos)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // ADD
  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id:        Date.now(),
      text:      text,
      done:      false,
      createdAt: new Date(),
    }
    setTodos([...todos, newTodo])
  }

  if (isLoading) return <p>Loading tasks...</p>
  if (error)     return <p style={{ color:"red" }}>{error}</p>

  return (
    <div>
      <mark><AddTodoForm onAdd={addTodo} /></mark>
      <h2>Tasks ({todos.length})</h2>
      {todos.length === 0 && (
        <p style={{ color:"#94a3b8" }}>No tasks yet. Add one above.</p>
      )}
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}

export default TodoList
```

Type a task and click Add. The new todo appears at the bottom of the list with the current date. The count in the heading updates immediately. The input clears automatically because `AddTodoForm` calls `setText("")` after submitting.

> ⚠️ **Never mutate state directly**
>
> `todos.push(newTodo)` modifies the existing array in place. React compares array references, not contents, so it will not detect the change and will not re-render. Always create a new array: `setTodos([...todos, newTodo])`.

---

## Step 7 — CRUD — Delete a Todo
### `TodoItem.tsx` + `TodoList.tsx` (updated)

Deleting a todo means filtering it out of the array by its `id`. The delete button lives inside `TodoItem`, but the state lives in `TodoList`. The pattern is the same as the `onSelect` pattern from Lab 2: pass a function down as a prop, child calls it up.

### Step 7.1 — Add onDelete prop to TodoItem

Update the <mark>TodoItemProps</mark> interface to include an <mark>onDelete</mark> function, and add a Delete button to the JSX:

```tsx
// src/components/TodoItem.tsx — updated

import type { Todo } from '../types/todo'

interface TodoItemProps {
  todo:     Todo
  <mark>onDelete: (id: number) => void  // new prop</mark>
}

function TodoItem({ todo, <mark>onDelete</mark> }: TodoItemProps) {
  return (
   <mark> <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      marginBottom: "8px",
      background: todo.done ? "#f8fafc" : "#ffffff",
    }}>
      <div>
        <p style={{
          margin: "0 0 4px",
          textDecoration: todo.done ? "line-through" : "none",
          color: todo.done ? "#94a3b8" : "#1a2b4a",
          fontWeight: "500",
        }}>
          {todo.text}
        </p>
        <p style={{ margin:0, fontSize:"12px", color:"#94a3b8" }}>
          Created: {todo.createdAt.toLocaleDateString()}
        </p>
      </div></mark>

      {/* Delete button — calls onDelete with this todo id */}
    <mark>  <button
        onClick={() => onDelete(todo.id)}
        style={{
          border: "none",
          background: "transparent",
          color: "#ef4444",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: 1,
        }}
      >
        ✕
      </button></mark>
    </div>
  )
}

export default TodoItem
```

### Step 7.2 — Add deleteTodo function to TodoList

Add the <mark>deleteTodo</mark> function and pass it as a prop to each <mark>TodoItem</mark>:

```tsx
// Inside TodoList — the deleteTodo function

<mark>const deleteTodo = (id: number) => {
  // filter returns a NEW array with every todo EXCEPT the one with this id
  setTodos(todos.filter((todo) => todo.id !== id))
}</mark>

// In the map:
<TodoItem
  key={todo.id}
  todo={todo}
 <mark> onDelete={deleteTodo}</mark>
/>
```

<mark>todos.filter((todo) => todo.id !== id)</mark> returns a new array containing every todo whose `id` is not the deleted one. The deleted todo is simply absent from the new array. React receives the new array, diffs it, and removes that one DOM node.

---

## Step 8 — CRUD — Toggle Done (Strike)
### `TodoItem.tsx` + `TodoList.tsx` (updated)

Toggling a todo done means updating one field (`done`) on one item in the array. The pattern is: map over the array, find the matching `id`, return a new object with `done` flipped, leave all other todos unchanged.

### Step 8.1 — Add onToggle prop to TodoItem

Add an <mark>onToggle</mark> function prop and a checkbox to the JSX. Clicking either the checkbox or the text should toggle the todo:

```tsx
// src/components/TodoItem.tsx — final version

import type { Todo } from '../types/todo'

interface TodoItemProps {
  todo:     Todo
  onDelete: (id: number) => void
  <mark>onToggle: (id: number) => void  // new prop</mark>
}

function TodoItem({ todo, onDelete, <mark>onToggle</mark> }: TodoItemProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      marginBottom: "8px",
      background: todo.done ? "#f8fafc" : "#ffffff",
    }}>

      {/* Checkbox — clicking it calls onToggle */}
     <mark> <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        style={{ width:"18px", height:"18px", cursor:"pointer", accentColor:"#0D9488" }}
      /></mark>

      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: "0 0 4px",
            textDecoration: todo.done ? "line-through" : "none",
            color: todo.done ? "#94a3b8" : "#1a2b4a",
            fontWeight: "500",
            cursor: "pointer",
          }}
          onClick={() => onToggle(todo.id)}  // clicking text also toggles
        >
          {todo.text}
        </p>
        <p style={{ margin:0, fontSize:"12px", color:"#94a3b8" }}>
          Created: {todo.createdAt.toLocaleDateString()}
        </p>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        style={{
          border:"none", background:"transparent",
          color:"#ef4444", cursor:"pointer", fontSize:"18px", lineHeight:1,
        }}
      >
        ✕
      </button>
    </div>
  )
}

export default TodoItem
```

### Step 8.2 — Add toggleTodo function to TodoList

```tsx
// Inside TodoList — the toggleTodo function

<mark>const toggleTodo = (id: number) => {
  setTodos(
    todos.map((todo) =>
      todo.id === id
        ? { ...todo, done: !todo.done }  // this todo: flip done
        : todo                           // all others: unchanged
    )
  )
}</mark>

// In the map:
<TodoItem
  key={todo.id}
  todo={todo}
  onDelete={deleteTodo}
  <mark>onToggle={toggleTodo}</mark>
/>
```

The ternary inside <mark>.map()</mark> is the key pattern: if this is the todo we want to change, return a new object (<mark>{ ...todo, done: !todo.done }</mark>) with `done` flipped. For every other todo, return it unchanged. The result is a new array where only one object is different.

<mark>{ ...todo, done: !todo.done }</mark> uses the spread operator on an object. It copies all fields from <mark>todo</mark>, then overrides <mark>done</mark> with the new value. This is how you update one field without mutating the original object.

> 💡 **Test the three operations**
>
> Try all three: add a task, check it done (strikethrough appears), uncheck it (strikethrough disappears), then delete it. The count in the heading updates correctly after each operation because it always reads directly from the `todos` array in state.

---

## Step 9 — useRef — Auto-focus + Render Count
### `AddTodoForm.tsx` + `TodoList.tsx` (updated)

**`useRef`** gives you a mutable container that persists across renders without causing re-renders. It has two common uses: holding a reference to a DOM element, and holding a value that you want to track without triggering a re-render.

### Use 1 — Auto-focus the input on mount

When the page loads, the text input should already be focused so the user can start typing immediately without clicking. You cannot do <mark>document.getElementById("input").focus()</mark> directly in React — that is imperative DOM manipulation. `useRef` is the React way.

```tsx
// src/components/AddTodoForm.tsx — updated with useRef

import { useState, useEffect, <mark>useRef</mark> } from 'react'

interface AddTodoFormProps {
  onAdd: (text: string) => void
}

function AddTodoForm({ onAdd }: AddTodoFormProps) {

  const [text, setText] = useState<string>("")

  // 1. Create the ref — starts as null, will point to the <input> DOM node
  <mark>const inputRef = useRef<HTMLInputElement>(null)</mark>

  // 2. After mount, focus the input
  <mark>
  useEffect(() => {
    inputRef.current?.focus()  // ?. safely handles the null case
  }, [])  // [] = run once on mount</mark>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim())
    setText("")
   <mark> inputRef.current?.focus()  // re-focus after submit so user can type next task</mark>
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display:"flex", gap:"8px", marginBottom:"1.5rem" }}
    >
      <input
        <mark>ref={inputRef}                </mark>           // 3. Attach ref to the DOM node
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        style={{
          flex:1, padding:"10px 14px",
          borderRadius:"8px", border:"1px solid #e2e8f0",
          fontSize:"14px", outline:"none",
        }}
      />
      <button type="submit" style={{
        padding:"10px 20px", borderRadius:"8px",
        border:"none", background:"#0D9488", color:"white",
        cursor:"pointer", fontWeight:"600",
      }}>
        Add
      </button>
    </form>
  )
}

export default AddTodoForm
```

Three steps to wire up a DOM ref: **create** it with <mark>useRef\<HTMLInputElement\>(null)</mark>, **attach** it with <mark>ref={inputRef}</mark> on the element, then **use** it via <mark>inputRef.current</mark> after the component has mounted. The <mark>?.</mark> optional chaining handles the initial `null` safely.

### Use 2 — Track render count without causing re-renders

A ref's <mark>.current</mark> property can hold any value, not just DOM nodes. Unlike state, changing <mark>ref.current</mark> does not cause a re-render. This makes it perfect for tracking how many times a component has rendered — useful for debugging or understanding React's behaviour.

```tsx
// src/components/TodoList.tsx — add render counter

import { useState, useEffect, useRef } from 'react'

function TodoList() {

  const [todos,     setTodos]     = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error,     setError]     = useState<string | null>(null)

  // Render counter — persists across renders, does not cause them
 <mark> const renderCount = useRef<number>(0)
  renderCount.current += 1  // increment on every render, no re-render triggered
</mark>
  useEffect(() => {
    const timer = setTimeout(() => {
      setTodos(dummyTodos)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const addTodo    = (text: string) => { /* same as Step 6 */ }
  const deleteTodo = (id: number)   => { /* same as Step 7 */ }
  const toggleTodo = (id: number)   => { /* same as Step 8 */ }

  if (isLoading) return <p>Loading tasks...</p>
  if (error)     return <p style={{ color:"red" }}>{error}</p>

  return (
    <div>
      {/* Render counter — only visible in dev, helps understand React */}
   <mark>   <p style={{ fontSize:"11px", color:"#cbd5e1", textAlign:"right" }}>
        renders: {renderCount.current}
      </p></mark>

      <AddTodoForm onAdd={addTodo} />
      <h2>Tasks ({todos.length})</h2>
      {todos.length === 0 && (
        <p style={{ color:"#94a3b8" }}>No tasks yet. Add one above.</p>
      )}
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
        />
      ))}
    </div>
  )
}

export default TodoList
```

### useState vs useRef — when to use which

| | **useState** | **useRef** |
|---|---|---|
| **Triggers re-render?** | Yes — every call to the setter re-renders | No — changing `.current` never re-renders |
| **Persists across renders?** | Yes | Yes |
| **Use for** | Data the screen should display | DOM nodes, timers, counters that do not affect the display |
| **Read value** | `const [val] = useState(...)` | `ref.current` |
| **Update value** | `setVal(newVal)` | `ref.current = newVal` |

---

## Complete File Structure
### All files after Step 9

```
src/
├── types/
│   └── todo.ts          Interface Todo { id, text, done, createdAt }
│
├── data/
│   └── todos.ts         dummyTodos: Todo[]
│
├── components/
│   ├── TodoItem.tsx      Props: todo, onDelete, onToggle
│   ├── AddTodoForm.tsx   Props: onAdd | useRef for focus
│   └── TodoList.tsx      State: todos, isLoading, error
│                         useEffect: mock fetch
│                         useRef: render counter
│                         Functions: addTodo, deleteTodo, toggleTodo
│
└── App.tsx               Renders <TodoList />
```

---

## Data Flow Diagram

```
App
└── TodoList  [state: todos, isLoading, error]
    │         [ref:   renderCount]
    │         [effect: mock fetch on mount]
    │         [fns:   addTodo, deleteTodo, toggleTodo]
    │
    ├── AddTodoForm   props: onAdd={addTodo}
    │   └── <input>  controlled by local state: text
    │   └── <ref>    inputRef → auto-focus
    │
    └── TodoItem × N  props: todo, onDelete, onToggle
        ├── checkbox  onChange → onToggle(todo.id) → up to TodoList
        ├── text      onClick  → onToggle(todo.id) → up to TodoList
        └── ✕ button  onClick  → onDelete(todo.id) → up to TodoList
```

---

## Summary

| Concept | Key point |
|---|---|
| **`interface Todo`** | Single source of truth for the shape of every todo object. Imported by all components. |
| **`createdAt: Date`** | `new Date()` as the default gives the current timestamp when a todo is created. |
| **Props (TodoItem)** | Receives `todo`, `onDelete`, `onToggle` from parent. Never owns or mutates the data itself. |
| **`useState<Todo[]>`** | `TodoList` owns the array. `setTodos` always receives a NEW array — never a mutated one. |
| **`useEffect(fn, [])`** | Runs once on mount. Simulates a fetch with `setTimeout`. Cleanup cancels the timer. |
| **Controlled form** | `value={text}` + `onChange={setText}`. React owns the input value, not the DOM. |
| **Add — spread** | `setTodos([...todos, newTodo])`. Spread copies existing todos; `newTodo` appends. |
| **Delete — filter** | `setTodos(todos.filter(t => t.id !== id))`. Returns a new array without the item. |
| **Toggle — map** | `setTodos(todos.map(t => t.id===id ? {...t, done:!t.done} : t))`. Spreads one object. |
| **useRef — DOM** | `useRef<HTMLInputElement>(null)` + `ref={inputRef}` → `inputRef.current.focus()`. |
| **useRef — value** | `ref.current++` tracks renders without triggering re-renders. Unlike `useState`. |

---

> *The three array operations — spread for add, filter for delete, map for toggle — are the fundamental immutable update patterns used across all React applications. Master these three and you can manage any list in any project.*
