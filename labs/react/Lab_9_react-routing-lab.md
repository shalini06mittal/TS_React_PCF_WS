# React Routing Lab
### A practical guide to routing concepts with React Router v6 + TypeScript

---

## Table of Contents

- [1. What is Routing?](#1-what-is-routing)
  - [Traditional Web vs. Single Page App Routing](#traditional-web-vs-single-page-app-routing)
- [2. Why You Need Routing](#2-why-you-need-routing)
  - [The Problem Without Routing](#the-problem-without-routing)
  - [What Routing Gives You](#what-routing-gives-you)
- [3. Project Setup](#3-project-setup)
  - [Step 1 — Create the Vite Project](#step-1--create-the-vite-project)
  - [Step 2 — Install React Router](#step-2--install-react-router)
  - [Step 3 — Project Structure](#step-3--project-structure)
  - [Step 4 — Wrap Your App with BrowserRouter](#step-4--wrap-your-app-with-browserrouter)
- [4. Basic Routing](#4-basic-routing)
  - [The Route Table in App.tsx](#the-route-table-in-apptsx)
  - [Your Routes at a Glance](#your-routes-at-a-glance)
  - [Navigation with \<Link\> and \<NavLink\>](#navigation-with-link-and-navlink)
- [5. Route Parameters](#5-route-parameters)
  - [Reading URL Parameters with useParams](#reading-url-parameters-with-useparams)
  - [Programmatic Navigation with useNavigate](#programmatic-navigation-with-usenavigate)
  - [React Router Hooks — Quick Reference](#react-router-hooks--quick-reference)

---

# 1. What is Routing?

Routing is the mechanism that maps a URL to a specific piece of UI. It's how your app knows which page to show based on the current browser address.

In web development, routing is the system that decides: when the user visits `/about`, show the `About` component. When they visit `/users/42`, show user #42's profile. It connects URLs to content.

> **Analogy**
>
> Think of routing like a restaurant host. When you arrive (visit a URL), the host checks your reservation (the route table) and takes you to the right table (renders the right component). Every URL is an address; the router is the navigation system.

---

## Traditional Web vs. Single Page App Routing

| **Aspect** | **Traditional (MPA)** | **Single Page App (SPA)** |
|---|---|---|
| Page change | Full reload from server | JS swaps components in-place |
| Network | New HTML document each time | Single HTML, JS handles views |
| Speed | Slower transitions | Instant, animation-friendly |
| URL | Always reflects actual file | Virtual — router controls it |
| State | Reset on every navigation | Preserved across route changes |

---

# 2. Why You Need Routing

Without routing, your React app is a single screen. With it, you get a full multi-page experience — all in one JavaScript bundle.

---

## The Problem Without Routing

A bare React app renders one component tree. To show different pages, you would write messy if/else logic, lose the browser back button, and have no shareable links. Users could not bookmark your product page or navigate with browser history.

> **Without Routing**
>
> No bookmarkable URLs &nbsp;|&nbsp; Back button is broken &nbsp;|&nbsp; Cannot share deep links &nbsp;|&nbsp; No SEO for different pages &nbsp;|&nbsp; State resets unpredictably

---

## What Routing Gives You

- **Shareable, bookmarkable URLs** — every view has a real URL. Users can copy `/products/123` and share it. The page loads correctly on refresh.
- **Browser history works** — back and forward buttons work exactly as users expect. Navigation feels native, not broken.
- **Code organisation** — each route maps to a component/page, keeping your codebase clean and navigation logic centralised.
- **Protected routes** — routing lets you wrap certain pages with auth guards, redirecting to `/login` if a user is not authenticated.
- **Code splitting** — lazy-load page components per route so users only download code for the pages they visit.

---

# 3. Project Setup

Create a React + TypeScript project with Vite, then install React Router v6.

---

## Step 1 — Create the Vite Project

Run the Vite scaffolding command. Choose React and TypeScript when prompted.

```bash
npm create vite@latest my-routing-app -- --template react-ts
cd my-routing-app
npm install
```

---

## Step 2 — Install React Router

React Router v6 is the current standard. It ships with TypeScript types built in.

```bash
npm install react-router-dom
```

---

## Step 3 — Project Structure

Organise your project so each route is its own page component:

```
my-routing-app/
  src/
    pages/
      Home.tsx
      About.tsx
      UserList.tsx
      UserDetail.tsx
      NotFound.tsx
    components/
      Navbar.tsx
    App.tsx        <-- router lives here
    main.tsx
  index.html
  vite.config.ts
```

---

## Step 4 — Wrap Your App with BrowserRouter

In `main.tsx`, wrap your app with `<BrowserRouter>` so the router context is available everywhere:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

---

# 4. Basic Routing

Define routes in `App.tsx` using `<Routes>` and `<Route>`, then navigate with `<Link>` or `<NavLink>`.

---

## The Route Table in App.tsx

```tsx
import { Routes, Route } from 'react-router-dom'
import Navbar     from './components/Navbar'
import Home       from './pages/Home'
import About      from './pages/About'
import UserList   from './pages/UserList'
import UserDetail from './pages/UserDetail'
import NotFound   from './pages/NotFound'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />}       />
        <Route path="/about"     element={<About />}      />
        <Route path="/users"     element={<UserList />}   />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*"          element={<NotFound />}   />
      </Routes>
    </>
  )
}
```

---

## Your Routes at a Glance

| **Path** | **Type** | **Description** |
|---|---|---|
| `/` | Exact | Home page — landing screen |
| `/about` | Exact | About page — static content |
| `/users` | Exact | User list — shows all users |
| `/users/:id` | Dynamic | User detail — shows one user by ID |
| `*` | Fallback | 404 not found — catches all unmatched paths |

---

## Navigation with \<Link\> and \<NavLink\>

```tsx
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav>
      {/* NavLink adds 'active' class when route matches */}
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/users">Users</NavLink>

      {/* Link is a plain anchor - no active state */}
      <Link to="/about">Learn more</Link>
    </nav>
  )
}
```

> **Important**
>
> Always use `<Link>` or `<NavLink>` instead of plain `<a href>` tags. An `<a>` causes a full page reload. `<Link>` uses client-side navigation — no reload, no flash, no lost state.

---

# 5. Route Parameters

Dynamic segments in the URL (like `:id`) let you pass data through the route itself. Read them with the `useParams` hook.

---

## Reading URL Parameters with useParams

```tsx
import { useParams } from 'react-router-dom'

// Type the params for TypeScript safety
type UserParams = {
  id: string
}

const users = [
  { id: '1', name: 'Alice Chen',  role: 'Engineer' },
  { id: '2', name: 'Bob Tanaka',  role: 'Designer' },
  { id: '3', name: 'Priya Das',   role: 'Product'  },
]

export default function UserDetail() {
  // Extract :id from the current URL
  const { id } = useParams<UserParams>()

  const user = users.find(u => u.id === id)

  if (!user) return <p>User not found</p>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.role}</p>
      <p>URL param id: {id}</p>
    </div>
  )
}
```

---

## Programmatic Navigation with useNavigate

Use the `useNavigate` hook to navigate from code, for example after a form submit:

```tsx
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    await loginUser()
    navigate('/dashboard')                    // push to new route
    // navigate(-1)                           // go back
    // navigate('/home', { replace: true })   // replace history
  }

  // ...
}
```

---

## React Router Hooks — Quick Reference

| **Hook** | **Purpose** |
|---|---|
| `useParams()` | Read dynamic URL segments like `:id`, `:slug` |
| `useNavigate()` | Programmatically navigate to a new route |
| `useLocation()` | Read the current URL, pathname, and state |
| `useSearchParams()` | Read and write URL query strings (`?sort=asc`) |

> **Summary**
>
> `useParams()` — read dynamic URL segments &nbsp;|&nbsp; `useNavigate()` — push routes programmatically &nbsp;|&nbsp; `useLocation()` — read current URL and state &nbsp;|&nbsp; `useSearchParams()` — read/write query strings like `?sort=asc`
