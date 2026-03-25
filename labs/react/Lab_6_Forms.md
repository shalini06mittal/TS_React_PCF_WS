# React + TypeScript Lab Series
## Lab 6 — Forms in React
**Controlled • Uncontrolled • All Input Types • Validation • Portfolio Form**

---

> *Three parts:*
>
> *Part A — Controlled vs Uncontrolled: the core concept with a single input*
>
> *Part B — All input types + validation: text, email, password, number, textarea, checkbox, radio, select — plus error handling and submit*
>
> *Part C — Portfolio Dashboard: a real Add Profile form wired into App.tsx*

---

## Table of Contents

**[PART A — Controlled vs Uncontrolled Forms](#part-a--controlled-vs-uncontrolled-forms)**
- [Step 1 — What is a Form Component?](#step-1--what-is-a-form-component)
- [Step 2 — The Simplest Controlled Input](#step-2--the-simplest-controlled-input)
- [Step 3 — All Input Types in One Form](#step-3--all-input-types-in-one-form)

**[PART B — Validation and Error Handling](#part-b--validation-and-error-handling)**
- [Step 4 — Validation Strategy](#step-4--validation-strategy)
- [Step 5 — Complete Validated Form](#step-5--complete-validated-form)

**[PART C — Portfolio Dashboard — Add Profile Form](#part-c--portfolio-dashboard--add-profile-form)**
- [Step 6 — The Profile Form Interface](#step-6--the-profile-form-interface)
- [Step 7 — AddProfileForm Component](#step-7--addprofileform-component)
- [Step 8 — Connecting the Form to App.tsx](#step-8--connecting-the-form-to-apptsx)
- [Step 9 — Data Flow Diagram](#step-9--data-flow-diagram)

**[Complete Reference](#complete-reference)**

---

# PART A — Controlled vs Uncontrolled Forms

## Step 1 — What is a Form Component?
### The two philosophies React gives you

Every form has the same question: where does the current value of an input field live? The answer splits forms into two categories.

**Uncontrolled:** the DOM owns the value. The input element keeps its own internal state. React only reads the value when it needs it — usually on submit, and even then with JavaScript syntax.

**Controlled:** React state owns the value. Every keystroke updates state. The input displays whatever state says. React always knows the current value.

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
// React has NO idea what is in
// this input right now.
// You must reach into the DOM
// manually to read the value.

function NameForm() {

  const submit = () => {
    // only know value on submit
    const el =
      document.getElementById?.('un');
    if (el)
      console.log(
        (el as HTMLInputElement).value
      );
  }

  return (
    <input type="text"
      name="username" id="un" />
    <button
      onClick={submit}>Submit</button>
  )
}
```

</td>
<td>

```tsx
// React knows the value on EVERY
// keystroke.
// You can validate, transform,
// or block input in real time.

function NameForm() {

  const [name, setName]
    = useState("")

  return (
    <input
      type="text"
      value={name}
      onChange={e =>
        setName(e.target.value)
      }
    />
  )
}
```

</td>
</tr>
</tbody>
</table>

This lab focuses on controlled components because they are the standard in React applications. Controlled inputs give you real-time validation, conditional logic, and consistent behaviour across all browsers.

---

## Step 2 — The Simplest Controlled Input
### A single text field — understanding the two-way binding

Start here before adding any other input type. One state variable, one input, three things to notice.

```tsx
// src/components/SimpleInput.tsx

import { useState } from 'react'

function SimpleInput() {

  const [name, setName] = useState<string>("")

  return (
    <div style={{ padding: "2rem" }}>
      <label htmlFor="name">Your name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display:"block", marginTop:"6px", padding:"8px 12px",
          border:"1px solid #e2e8f0", borderRadius:"6px" }}
      />
      <p style={{ marginTop:"12px", color:"#64748b" }}>
        You typed: <strong>{name}</strong>
      </p>
    </div>
  )
}

export default SimpleInput
```

**Three things that make this controlled:**

- **`value={name}`** — the input displays whatever is in state. If you set `name` to `"Hello"` in code, the input shows `"Hello"`. The DOM never has an independent value.
- **`onChange={(e) => setName(e.target.value)}`** — every keystroke fires this event. `e.target.value` is the full new string in the input. `setName` puts it in state. State updates trigger a re-render. The input re-renders with the new value. This cycle completes in milliseconds.
- **`htmlFor` / `id` pair** — `htmlFor` on the label matches the `id` on the input. Clicking the label focuses the input. This is an accessibility requirement, not optional.

> ⚠️ **Both attributes are required together**
>
> Remove `value` and you have a read-only display. Remove `onChange` and React will warn that the input is read-only. Without both, the input either never updates or the state drifts from what the user sees. Always use them as a pair.

### The event object: `e.target.value` vs `e.target.checked`

Every `onChange` handler receives a synthetic event object <mark>e</mark>. The property you read depends on the input type:

| Input type | Property | Notes |
|---|---|---|
| `text`, `email`, `password`, `number`, `textarea` | `e.target.value` | always a string, even for `type="number"` |
| `checkbox` | `e.target.checked` | boolean — `true` or `false` |
| `radio` | `e.target.value` | the `value` attribute of the selected option |
| `select` (dropdown) | `e.target.value` | the value of the selected option |

---

## Step 3 — All Input Types in One Form
### `text`, `email`, `password`, `number`, `textarea`, `checkbox`, `radio`, `select`

Now that the pattern is clear, apply it to every HTML input type. The controlled pattern is identical for each — only the state type and the property you read from the event changes.

### The FormState interface

Define the shape of the entire form as a TypeScript interface before writing any JSX. This is the single source of truth for the form — every input maps to exactly one field here.

```ts
// Define the shape of the entire form up front

interface FormState {
  // text inputs
  fullName: string
  email:    string
  password: string
  age:      number | ""  // "" when empty, number when filled

  // textarea
  bio: string

  // checkbox
  agreeToTerms: boolean

  // radio
  experience: "beginner" | "intermediate" | "advanced" | ""

  // select / dropdown
  country: string
}

// Initial values — the form starts empty
const initialState: FormState = {
  fullName:     "",
  email:        "",
  password:     "",
  age:          "",
  bio:          "",
  agreeToTerms: false,
  experience:   "",
  country:      "",
}
```

Notice <mark>age: number | ""</mark>. An empty number input returns the string <mark>""</mark>, not `0`, so the type must allow both. This is a common TypeScript gotcha with number inputs.

### Using a single onChange handler

Instead of writing a separate <mark>setX</mark> call for every field, you can write one generic handler that updates any field by name. This uses the **computed property name** pattern in JavaScript:

```ts
// One handler for all text-like inputs

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target

  setForm((prev) => ({
    ...prev,               // copy all existing fields
    [name]: type === "checkbox"   // computed property: key comes from name attribute
      ? (e.target as HTMLInputElement).checked
      : value,
  }))
}

// Each input must have a name attribute matching the FormState key:
<input name="fullName" value={form.fullName} onChange={handleChange} />
<input name="email"    value={form.email}    onChange={handleChange} />
```

The <mark>[name]: value</mark> syntax is a computed property name. <mark>name</mark> is a variable holding the string `"fullName"` or `"email"`, and using it in square brackets makes it the object key. <mark>...prev</mark> copies all existing fields so only the changed one is overwritten.

### Complete AllInputsForm component

```tsx
// src/components/AllInputsForm.tsx

import { useState } from 'react'

interface FormState {
  fullName: string; email: string; password: string
  age: number | ""; bio: string; agreeToTerms: boolean
  experience: "beginner"|"intermediate"|"advanced"|""; country: string
}

const initialState: FormState = {
  fullName:"", email:"", password:"", age:"",
  bio:"", agreeToTerms:false, experience:"", country:"",
}

function AllInputsForm() {

  const [form, setForm] = useState<FormState>(initialState)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const v = type==="checkbox" ? (e.target as HTMLInputElement).checked
            : type==="number"   ? (value==="" ? "" : Number(value))
            : value
    setForm(prev => ({ ...prev, [name]: v }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form data:", form)
  }

  const field: React.CSSProperties = {
    display:"block", width:"100%", padding:"8px 12px", marginTop:"6px",
    border:"1px solid #e2e8f0", borderRadius:"6px", fontSize:"14px",
  }

  const label: React.CSSProperties = {
    display:"block", fontWeight:"600", fontSize:"14px", color:"#1a2b4a",
    marginTop:"1.25rem",
  }

  return (
    <form onSubmit={handleSubmit}
      style={{ maxWidth:"480px", padding:"2rem" }}
    >
      <h2>All Input Types Demo</h2>
      <h4>Form Data: {JSON.stringify(form)}</h4>

      {/* ── TEXT ── */}
      <label style={label} htmlFor="fullName">Full name</label>
      <input id="fullName" name="fullName" type="text"
        value={form.fullName} onChange={handleChange} style={field} />

      {/* ── EMAIL ── */}
      <label style={label} htmlFor="email">Email</label>
      <input id="email" name="email" type="email"
        value={form.email} onChange={handleChange} style={field} />

      {/* ── PASSWORD ── */}
      <label style={label} htmlFor="password">Password</label>
      <input id="password" name="password" type="password"
        value={form.password} onChange={handleChange} style={field} />

      {/* ── NUMBER ── */}
      <label style={label} htmlFor="age">Age</label>
      <input id="age" name="age" type="number" min="18" max="100"
        value={form.age} onChange={handleChange} style={field} />

      {/* ── TEXTAREA ── */}
      <label style={label} htmlFor="bio">Bio</label>
      <textarea id="bio" name="bio" rows={3}
        value={form.bio} onChange={handleChange}
        style={{ ...field, resize:"vertical" }} />

      {/* ── RADIO ── */}
      <p style={label}>Experience level</p>
      {(["beginner","intermediate","advanced"] as const).map(level => (
        <label key={level}
          style={{ display:"flex", alignItems:"center", gap:"8px",
            marginTop:"6px", cursor:"pointer" }}
        >
          <input
            type="radio" name="experience"
            value={level}
            checked={form.experience === level}
            onChange={handleChange}
          />
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </label>
      ))}

      {/* ── SELECT ── */}
      <label style={label} htmlFor="country">Country</label>
      <select id="country" name="country"
        value={form.country} onChange={handleChange} style={field}
      >
        <option value="">-- select --</option>
        <option value="in">India</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="sg">Singapore</option>
      </select>

      {/* ── CHECKBOX ── */}
      <label style={{ display:"flex", alignItems:"center", gap:"8px",
        marginTop:"1.25rem", cursor:"pointer" }}>
        <input
          type="checkbox" name="agreeToTerms"
          checked={form.agreeToTerms}
          onChange={handleChange}
        />
        I agree to the terms and conditions
      </label>

      <button type="submit"
        style={{ marginTop:"1.5rem", padding:"10px 24px",
          background:"#0D9488", color:"white",
          border:"none", borderRadius:"8px",
          cursor:"pointer", fontWeight:"600" }}
      >
        Submit
      </button>
    </form>
  )
}

export default AllInputsForm
```

### Behaviours to verify in the browser

- Type in the **Full name** field — the `value` prop updates character by character.
- Tab through **Email** and **Password** — the browser still auto-fills these correctly even in controlled mode.
- Type a number in **Age** — `e.target.value` returns a string, so the handler converts it with `Number()`.
- Click a **radio button** — `checked={form.experience === level}` makes only the matching one appear selected.
- Pick a **country** — the select reflects the chosen value via `value={form.country}`.
- Tick the **checkbox** — `checked={form.agreeToTerms}` toggles the tick via `e.target.checked`.
- Click **Submit** — open DevTools console. You will see the entire `FormState` object logged with all current values.

### Input type quick-reference

| Input type | State type | `onChange` handler |
|---|---|---|
| `type="text"` | `string` | `e.target.value` |
| `type="email"` | `string` | `e.target.value` |
| `type="password"` | `string` | `e.target.value` |
| `type="number"` | `number \| ""` | `Number(e.target.value)` or `""` |
| `textarea` | `string` | `e.target.value` |
| `type="checkbox"` | `boolean` | `e.target.checked` |
| `type="radio"` | `string` (union) | `e.target.value` (`checked` prop controls selection) |
| `select` | `string` | `e.target.value` |

---

# PART B — Validation and Error Handling

## Step 4 — Validation Strategy
### When to validate, where to store errors, how to display them

Validation answers the question: is this form data good enough to submit? There are two moments you can validate:

- **On blur (`onBlur`):** validate a field when the user leaves it. Less intrusive — errors only appear after the user has finished with a field.
- **On submit:** validate everything when the submit button is clicked. Simpler to implement, catches all errors at once.

This lab uses on-blur validation per field plus a full check on submit — the most common real-world pattern.

### Storing errors

Create a separate state object for errors, keyed to the same field names as the form state. A value of <mark>""</mark> means no error. A non-empty string is the error message to display.

```ts
// Error state mirrors the form state shape
// but every value is a string (the error message)

type FormErrors = Partial<Record<keyof FormState, string>>

// Partial makes every field optional — no error = field absent
// Record<keyof FormState, string> maps each form key to a string

const [errors, setErrors] = useState<FormErrors>({})

// Example: after validation, errors might look like:
// {
//   fullName: "Full name is required",
//   email:    "Please enter a valid email address",
// }
```

Our form state is:

```ts
interface FormState {
  fullName: string; email: string; password: string; age: number | ""
  bio: string; agreeToTerms: boolean
  experience: "beginner" | "intermediate" | "advanced" | ""; country: string
}
```

Let's break down this line: **`type FormErrors = Partial<Record<keyof FormState, string>>`**

**`keyof FormState`** — takes all the keys from our form:

```
keyof FormState becomes:
"fullName" | "email" | "password" | "age" | "bio" | "agreeToTerms" | "experience" | "country"
// [A union of keys]
```

**`Record<Keys, Type>`** — creates an object type using those keys:

```ts
Record<"fullName" | "email" | "password" | "age" | "bio" | "agreeToTerms" | "experience" | "country", string>
// becomes:
{
  fullName:     string;
  email:        string;
  password:     string;
  age:          string;
  bio:          string;
  agreeToTerms: string;
  experience:   string;
  country:      string;
}
// Every key must exist, and each value is a string
```

**`Partial`** — makes all properties optional:

```ts
Partial<{ fullName: string; email: string; password: string; age: string;
          bio: string; agreeToTerms: string; experience: string; country: string; }>
// becomes:
{
  fullName?:     string;
  email?:        string;
  password?:     string;
  age?:          string;
  bio?:          string;
  agreeToTerms?: string;
  experience?:   string;
  country?:      string;
}
```

This is important because in forms, we don't always have errors for every field.

### Validate one field

Write a function that takes a field name and value, checks the rules for that field, and returns an error message or empty string:

```ts
const validateField = (name: keyof FormState, value: unknown): string => {
  switch (name) {
    case "fullName":
      if (!String(value).trim()) return "Full name is required"
      if (String(value).trim().length < 2) return "Name must be at least 2 characters"
      return ""

    case "email":
      if (!String(value).trim()) return "Email is required"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)))
        return "Please enter a valid email address"
      return ""

    case "password":
      if (!String(value)) return "Password is required"
      if (String(value).length < 8) return "Password must be at least 8 characters"
      return ""

    case "age":
      if (value === "") return "Age is required"
      if (Number(value) < 18) return "Must be 18 or older"
      return ""

    case "agreeToTerms":
      if (!value) return "You must agree to the terms"
      return ""

    default:
      return ""
  }
}
```

### Trigger validation on blur

Add an <mark>onBlur</mark> handler to every input. When a field loses focus, validate it and store the result in the errors state:

```ts
const handleBlur = (
  e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target
  const fieldValue = type === "checkbox"
    ? (e.target as HTMLInputElement).checked
    : value

  const errorMsg = validateField(name as keyof FormState, fieldValue)
  setErrors(prev => ({ ...prev, [name]: errorMsg }))
}

// Add to every input:
<input ... onBlur={handleBlur} />
```

### Validate all fields on submit

On submit, run `validateField` for every field at once. If any errors exist, show them all and block submission:

```ts
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()

  // Validate every field
  const newErrors: FormErrors = {}
  ;(Object.keys(form) as (keyof FormState)[]).forEach(key => {
    const msg = validateField(key, form[key])
    if (msg) newErrors[key] = msg
  })

  setErrors(newErrors)

  // If any errors exist, stop here
  if (Object.keys(newErrors).length > 0) {
    console.log("Form has errors — not submitting")
    return
  }

  // All fields valid — log the data
  console.log("✅ Form submitted:", form)
}
```

### Displaying error messages

Render the error message below each input. A helper component keeps the JSX clean:

```tsx
// Small helper inside the same file
const ErrorMsg = ({ msg }: { msg?: string }) => {
  if (!msg) return null
  return (
    <span style={{
      display: "block",
      color: "#ef4444",
      fontSize: "12px",
      marginTop: "4px",
    }}>
      {msg}
    </span>
  )
}

// Use it below each input:
<input
  id="fullName" name="fullName" type="text"
  value={form.fullName} onChange={handleChange} onBlur={handleBlur}
  style={{
    ...field,
    // red border when there is an error
    borderColor: errors.fullName ? "#ef4444" : "#e2e8f0",
  }}
/>
<ErrorMsg msg={errors.fullName} />
```

### Disabling submit while there are errors

Optionally, derive an `isFormValid` boolean from the errors and form state to disable the submit button:

```tsx
// Derived — no extra state needed
const isFormValid =
  Object.keys(errors).length === 0 &&  // no current errors
  form.fullName.trim() !== "" &&        // required fields have values
  form.email.trim() !== "" &&
  form.agreeToTerms === true

<button
  type="submit"
  disabled={!isFormValid}
  style={{
    // ...
    opacity: isFormValid ? 1 : 0.5,
    cursor:  isFormValid ? "pointer" : "not-allowed",
  }}
>
  Submit
</button>
```

> 💡 **Derived values vs state**
>
> `isFormValid` is a derived value — calculated from existing state every render. Do not put it in `useState`. The same rule from Lab 3 applies to forms: only store the minimum, compute the rest.

---

## Step 5 — Complete Validated Form
### All types + all validation + submit → `console.log`

Here is the complete <mark>ValidatedForm</mark> component combining everything from Steps 3 and 4. This is the reference implementation — read it top to bottom and trace how each piece connects.

```tsx
// src/components/ValidatedForm.tsx

import { useState } from 'react'

interface FormState {
  fullName: string; email: string; password: string; age: number | ""
  bio: string; agreeToTerms: boolean
  experience: "beginner"|"intermediate"|"advanced"|""; country: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const init: FormState = {
  fullName:"", email:"", password:"", age:"",
  bio:"", agreeToTerms:false, experience:"", country:"",
}

const validateField = (name: keyof FormState, value: unknown): string => {
  if (name==="fullName") {
    if (!String(value).trim()) return "Full name is required"
    if (String(value).trim().length<2) return "Minimum 2 characters"
  }
  if (name==="email") {
    if (!String(value).trim()) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)))
      return "Enter a valid email"
  }
  if (name==="password") {
    if (!String(value)) return "Password is required"
    if (String(value).length<8) return "Minimum 8 characters"
  }
  if (name==="age") {
    if (value==="") return "Age is required"
    if (Number(value)<18) return "Must be 18 or older"
  }
  if (name==="agreeToTerms" && !value) return "You must agree to the terms"
  return ""
}

const ErrorMsg = ({ msg }:{ msg?:string }) =>
  msg ? <span style={{ color:"#ef4444", fontSize:"12px", display:"block",
    marginTop:"4px" }}>{msg}</span> : null

function ValidatedForm() {

  const [form,   setForm]   = useState<FormState>(init)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const v = type==="checkbox" ? (e.target as HTMLInputElement).checked
            : type==="number"   ? (value==="" ? "" : Number(value))
            : value
    setForm(prev => ({ ...prev, [name]: v }))

    // Clear the error for this field as soon as user starts correcting
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const v = type==="checkbox"
      ? (e.target as HTMLInputElement).checked
      : value
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name as keyof FormState, v)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}
    ;(Object.keys(form) as (keyof FormState)[]).forEach(k => {
      const msg = validateField(k, form[k])
      if (msg) newErrors[k] = msg
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    console.log("✅ Submitted:", form)
  }

  const f: React.CSSProperties = {
    display:"block", width:"100%", padding:"8px 12px", marginTop:"6px",
    border:"1px solid", borderRadius:"6px", fontSize:"14px", boxSizing:"border-box"
  }

  const borderColor = (field: keyof FormState) =>
    errors[field] ? "#ef4444" : "#e2e8f0"

  return (
    <form onSubmit={handleSubmit} noValidate
      style={{ maxWidth:"480px", padding:"2rem" }}>

      <h2>Registration Form</h2>

      <label htmlFor="fullName">Full name *</label>
      <input id="fullName" name="fullName" type="text"
        value={form.fullName} onChange={handleChange} onBlur={handleBlur}
        style={{ ...f, borderColor:borderColor("fullName") }} />
      <ErrorMsg msg={errors.fullName} />

      <label htmlFor="email" style={{ display:"block", marginTop:"1rem" }}>
        Email *</label>
      <input id="email" name="email" type="email"
        value={form.email} onChange={handleChange} onBlur={handleBlur}
        style={{ ...f, borderColor:borderColor("email") }} />
      <ErrorMsg msg={errors.email} />

      <label htmlFor="password" style={{ display:"block", marginTop:"1rem" }}>
        Password *</label>
      <input id="password" name="password" type="password"
        value={form.password} onChange={handleChange} onBlur={handleBlur}
        style={{ ...f, borderColor:borderColor("password") }} />
      <ErrorMsg msg={errors.password} />

      <label htmlFor="age" style={{ display:"block", marginTop:"1rem" }}>
        Age *</label>
      <input id="age" name="age" type="number" min="18" max="100"
        value={form.age} onChange={handleChange} onBlur={handleBlur}
        style={{ ...f, borderColor:borderColor("age") }} />
      <ErrorMsg msg={errors.age} />

      <label htmlFor="bio" style={{ display:"block", marginTop:"1rem" }}>
        Bio</label>
      <textarea id="bio" name="bio" rows={3}
        value={form.bio} onChange={handleChange} onBlur={handleBlur}
        style={{ ...f, borderColor:borderColor("bio"), resize:"vertical" }} />

      <p style={{ fontWeight:"600", fontSize:"14px", marginTop:"1rem" }}>
        Experience *</p>
      {(["beginner","intermediate","advanced"] as const).map(level => (
        <label key={level} style={{ display:"flex", gap:"8px",
          alignItems:"center", marginTop:"4px", cursor:"pointer" }}>
          <input type="radio" name="experience" value={level}
            checked={form.experience===level}
            onChange={handleChange} onBlur={handleBlur} />
          {level}
        </label>
      ))}

      <label htmlFor="country" style={{ display:"block", marginTop:"1rem" }}>
        Country</label>
      <select id="country" name="country"
        value={form.country} onChange={handleChange} onBlur={handleBlur}
        style={{ ...f, borderColor:borderColor("country") }}>
        <option value="">-- select --</option>
        <option value="in">India</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="sg">Singapore</option>
      </select>

      <label style={{ display:"flex", gap:"8px", alignItems:"center",
        marginTop:"1rem", cursor:"pointer" }}>
        <input type="checkbox" name="agreeToTerms"
          checked={form.agreeToTerms}
          onChange={handleChange} onBlur={handleBlur} />
        I agree to the terms *
      </label>
      <ErrorMsg msg={errors.agreeToTerms} />

      <button type="submit"
        style={{ marginTop:"1.5rem", padding:"10px 24px",
          background:"#0D9488", color:"white", border:"none",
          borderRadius:"8px", cursor:"pointer", fontWeight:"600" }}>
        Submit
      </button>
    </form>
  )
}

export default ValidatedForm
```

> 📝 **`noValidate` on the form tag**
>
> Adding `noValidate` to the `<form>` element disables the browser's built-in validation popups. This lets React's validation take full control and show your custom styled errors instead of the browser defaults.

---

# PART C — Portfolio Dashboard — Add Profile Form

Now that you understand every building block, we apply them to the portfolio dashboard. We will build an "Add New Profile" form that a user can open from the dashboard, fill in, and submit — adding a new manager card to the list.

> *Files involved:*
>
> `src/types/portfolio.ts` — updated Profile interface
>
> `src/components/AddProfileForm.tsx` — new form component
>
> `src/App.tsx` — wired to receive the new profile

---

## Step 6 — The Profile Form Interface
### What fields the form collects

The form collects the fields that `ProfileCard` already displays. We define the form shape as a separate interface from the existing `Profile` so the form can have its own validation logic without touching the core type.

```ts
// src/types/portfolio.ts

// (existing Profile interface — unchanged)
export interface Profile {
  id:        number
  name:      string
  role:      string
  bio:       string
  skills:    string[]
  isActive:  boolean
  featured:  boolean
  avatarUrl: string
}

// ── New: form-specific interface ──────────────────────────────────────
// skills is a comma-separated string in the form.
// We convert it to string[] on submit.

export interface ProfileFormState {
  name:     string
  role:     string
  bio:      string
  skills:   string   // "Equities, Fixed Income, ETFs"
  isActive: boolean
  featured: boolean
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormState, string>>

// Dropdown options for the Role field
export const ROLE_OPTIONS = [
  "Portfolio Manager",
  "Risk Analyst",
  "Quant Researcher",
  "Trading Desk Analyst",
  "Compliance Officer",
] as const
```

**`skills` as a string:** The form collects skills as a single comma-separated input (`"Equities, ETFs, Bonds"`) which is easier to type than multiple inputs. On submit we split it into an array with <mark>text.split(",").map(s => s.trim())</mark>. This conversion happens once at the boundary between the form and the rest of the app.

---

## Step 7 — AddProfileForm Component
### Full form with validation matching the dashboard style

The form uses the same controlled pattern and validation strategy from Part B, but styled to match the dashboard's teal colour scheme. Read through the component in layers: interface → initial state → validation → handlers → JSX.

```tsx
// src/components/AddProfileForm.tsx

import { useState } from 'react'
import type { Profile, ProfileFormState, ProfileFormErrors } from '../data/profiles'
import { ROLE_OPTIONS } from '../data/profiles'

// Props: parent passes onAdd (to receive the new profile) and onCancel
interface AddProfileFormProps {
  onAdd:    (profile: Profile) => void
  onCancel: () => void
}

// ── Initial form state ────────────────────────────────────────────────
const init: ProfileFormState = {
  name:     "",
  role:     "",
  bio:      "",
  skills:   "",
  isActive: true,
  featured: false,
}

// ── Field-level validation rules ──────────────────────────────────────
const validateField = (
  name:  keyof ProfileFormState,
  value: unknown
): string => {
  switch (name) {
    case "name":
      if (!String(value).trim()) return "Name is required"
      if (String(value).trim().length < 2)
        return "Name must be at least 2 characters"
      return ""

    case "role":
      if (!String(value)) return "Please select a role"
      return ""

    case "bio":
      if (!String(value).trim()) return "Bio is required"
      if (String(value).trim().length < 10)
        return "Bio must be at least 10 characters"
      return ""

    case "skills":
      if (!String(value).trim()) return "At least one skill is required"
      return ""

    default:
      return ""
  }
}

// ── ErrorMsg helper ───────────────────────────────────────────────────
const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <span style={{ color:"#ef4444", fontSize:"12px",
      display:"block", marginTop:"4px" }}>
      {msg}
    </span>
  ) : null

// ── Component ─────────────────────────────────────────────────────────
function AddProfileForm({ onAdd, onCancel }: AddProfileFormProps) {

  const [form,   setForm]   = useState<ProfileFormState>(init)
  const [errors, setErrors] = useState<ProfileFormErrors>({})

  // ── Generic change handler (text, select, checkbox) ─────────────────
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    const v = type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : value
    setForm(prev => ({ ...prev, [name]: v }))

    // Clear error as user corrects the field
    if (errors[name as keyof ProfileFormState]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  // ── Blur handler: validate single field on leave ─────────────────────
  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    const v = type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : value
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name as keyof ProfileFormState, v),
    }))
  }

  // ── Submit handler ────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Validate all fields at once
    const newErrors: ProfileFormErrors = {}
    ;(Object.keys(form) as (keyof ProfileFormState)[]).forEach(key => {
      const msg = validateField(key, form[key])
      if (msg) newErrors[key] = msg
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // 2. Convert form state → Profile object
    const newProfile: Profile = {
      id:       Date.now(),
      name:     form.name.trim(),
      role:     form.role,
      bio:      form.bio.trim(),

      // Split comma-separated skills string into array
      skills: form.skills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0),

      isActive:  form.isActive,
      featured:  form.featured,

      // DiceBear avatar seeded from timestamp
      avatarUrl:
        `https://api.dicebear.com/9.x/adventurer/svg?seed=${Date.now()}`,
    }

    // 3. Log to console and pass to parent
    console.log("New profile:", newProfile)
    onAdd(newProfile)
  }

  // ── Style helpers ─────────────────────────────────────────────────────
  const fieldStyle = (name: keyof ProfileFormState): React.CSSProperties => ({
    display:     "block",
    width:       "100%",
    padding:     "10px 14px",
    marginTop:   "6px",
    border:      `1px solid ${errors[name] ? "#ef4444" : "#e2e8f0"}`,
    borderRadius:"8px",
    fontSize:    "14px",
    boxSizing:   "border-box",
    outline:     "none",
    fontFamily:  "inherit",
  })

  const labelStyle: React.CSSProperties = {
    display:    "block",
    fontWeight: "600",
    fontSize:   "14px",
    color:      "#1a2b4a",
    marginTop:  "1.25rem",
  }

  // ── JSX ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate
      style={{ padding:"2rem", maxWidth:"520px" }}
    >
      <h2 style={{ color:"#1a2b4a", marginBottom:"0.25rem" }}>
        Add New Profile
      </h2>
      <p style={{ color:"#64748b", fontSize:"14px", marginBottom:"1.5rem" }}>
        Fill in the details below to add a new team member.
      </p>

      {/* ── Name (text) ─────────────────────────────────────────── */}
      <label htmlFor="name" style={labelStyle}>Full name *</label>
      <input
        id="name" name="name" type="text"
        placeholder="e.g. Priya Sharma"
        value={form.name}
        onChange={handleChange}
        onBlur={handleBlur}
        style={fieldStyle("name")}
      />
      <ErrorMsg msg={errors.name} />

      {/* ── Role (select / dropdown) ──────────────────────────────*/}
      <label htmlFor="role" style={labelStyle}>Role *</label>
      <select
        id="role" name="role"
        value={form.role}
        onChange={handleChange}
        onBlur={handleBlur}
        style={fieldStyle("role")}
      >
        <option value="">-- select a role --</option>
        {ROLE_OPTIONS.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <ErrorMsg msg={errors.role} />

      {/* ── Bio (textarea) ────────────────────────────────────────*/}
      <label htmlFor="bio" style={labelStyle}>Bio *</label>
      <textarea
        id="bio" name="bio" rows={3}
        placeholder="Brief description of their expertise..."
        value={form.bio}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{ ...fieldStyle("bio"), resize:"vertical" }}
      />
      <ErrorMsg msg={errors.bio} />

      {/* ── Skills (text → array on submit) ──────────────────────*/}
      <label htmlFor="skills" style={labelStyle}>
        Skills * <span style={{ fontWeight:"normal", color:"#94a3b8" }}>
          (comma-separated)
        </span>
      </label>
      <input
        id="skills" name="skills" type="text"
        placeholder="e.g. Equities, Fixed Income, ETFs"
        value={form.skills}
        onChange={handleChange}
        onBlur={handleBlur}
        style={fieldStyle("skills")}
      />
      <ErrorMsg msg={errors.skills} />

      {/* ── isActive (checkbox) ───────────────────────────────────*/}
      <label style={{ ...labelStyle, display:"flex", alignItems:"center",
        gap:"10px", cursor:"pointer" }}>
        <input
          type="checkbox" name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          style={{ width:"18px", height:"18px", accentColor:"#0D9488" }}
        />
        Mark as Active
      </label>

      {/* ── featured (checkbox) ───────────────────────────────────*/}
      <label style={{ ...labelStyle, display:"flex", alignItems:"center",
        gap:"10px", cursor:"pointer", marginTop:"0.75rem" }}>
        <input
          type="checkbox" name="featured"
          checked={form.featured}
          onChange={handleChange}
          style={{ width:"18px", height:"18px", accentColor:"#0D9488" }}
        />
        Feature this profile
      </label>

      {/* ── Actions ──────────────────────────────────────────────*/}
      <div style={{ display:"flex", gap:"12px", marginTop:"2rem" }}>
        <button
          type="submit"
          style={{
            flex:1, padding:"12px",
            background:"#0D9488", color:"white",
            border:"none", borderRadius:"8px",
            cursor:"pointer", fontWeight:"600", fontSize:"15px",
          }}
        >
          Add Profile
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex:1, padding:"12px",
            background:"transparent", color:"#64748b",
            border:"1px solid #e2e8f0", borderRadius:"8px",
            cursor:"pointer", fontWeight:"600", fontSize:"15px",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddProfileForm
```

---

## Step 8 — Connecting the Form to App.tsx
### Show / hide the form, receive new profiles, update state

The form lives in a modal overlay. <mark>App.tsx</mark> holds a <mark>showForm</mark> boolean state to control visibility, and an <mark>addProfile</mark> function that receives the submitted profile and adds it to the profiles array.

<pre><code class="language-tsx">// src/App.tsx — updated with AddProfileForm

import { useState } from 'react'
import ProfileCard from './components/ProfileCard'
import PortfolioSummary from './components/PortfolioSummary'
import AddProfileForm from './components/AddProfileForm'
import { type Holding, portfolioHoldings, profiles as initialProfiles,
  type Profile } from './data/profiles';
import './App.css'

function App() {

  // Existing state
  const [profileList,      setProfileList]      = useState&lt;Profile[]&gt;(initialProfiles)
  const [selectedManager,  setSelectedManager]  = useState&lt;string|null&gt;(null)

<mark>  // New: controls whether the Add Profile form is visible
  const [showForm, setShowForm] = useState&lt;boolean&gt;(false)

  // Called by AddProfileForm on successful submit
  const addProfile = (newProfile: Profile) =&gt; {
    setProfileList(prev =&gt; [...prev, newProfile])  // append to list
    setShowForm(false)                              // close the form
  }</mark>

  return (
    &lt;div className="app"&gt;
      &lt;div className="app-header"&gt;
        &lt;h1&gt;Portfolio Dashboard&lt;/h1&gt;
        &lt;p&gt;Manage your team of portfolio professionals&lt;/p&gt;

<mark>        {/* Add Profile button */}
        &lt;button
          onClick={() =&gt; setShowForm(true)}
          style={{
            marginTop:    "1rem",
            padding:      "10px 24px",
            background:   "#0D9488",
            color:        "white",
            border:       "none",
            borderRadius: "8px",
            cursor:       "pointer",
            fontWeight:   "600",
          }}
        &gt;
          + Add Profile
        &lt;/button&gt;
      &lt;/div&gt;

      {/* Modal overlay — renders when showForm is true */}
      {showForm &amp;&amp; (
        &lt;&gt;
          {/* Semi-transparent backdrop */}
          &lt;div
            onClick={() =&gt; setShowForm(false)}
            style={{
              position:"fixed", inset:0,
              background:"rgba(0,0,0,0.5)", zIndex:998,
            }}
          /&gt;

          {/* Centred form card */}
          &lt;div style={{
            position:     "fixed",
            top:          "50%", left: "50%",
            transform:    "translate(-50%, -50%)",
            background:   "white",
            borderRadius: "16px",
            boxShadow:    "0 20px 60px rgba(0,0,0,0.2)",
            zIndex:       999,
            maxHeight:    "90vh",
            overflowY:    "auto",
            width:        "min(560px, 95vw)",
          }}&gt;
            &lt;AddProfileForm
              onAdd={addProfile}
              onCancel={() =&gt; setShowForm(false)}
            /&gt;
          &lt;/div&gt;
        &lt;/&gt;
      )}</mark>

      {/* Profile card grid */}
      &lt;div className="card-grid"&gt;
<mark>        {profileList.map(profile =&gt; (</mark>
          &lt;ProfileCard
            key={profile.id}
            name={profile.name}
            role={profile.role}
            skills={profile.skills}
            bio={profile.bio}
            avatarUrl={profile.avatarUrl}
            featured={profile.featured}
            isActive={profile.isActive}
            onSelect={setSelectedManager}
          /&gt;
        ))}
      &lt;/div&gt;

      {/* Portfolio summary sidebar */}
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

**What happens on each action:**

- **"+ Add Profile" clicked:** `setShowForm(true)` → form modal appears. The backdrop blocks interaction with cards behind it.
- **User fills form and clicks "Add Profile":** `handleSubmit` validates all fields. If valid, builds the `Profile` object and calls `onAdd(newProfile)` → `addProfile` in App is called → `setProfileList([...prev, newProfile])` → React re-renders the grid with the new card at the end.
- **"Cancel" or backdrop clicked:** `setShowForm(false)` → modal disappears. Form state resets on next open because `AddProfileForm` re-mounts from scratch each time `showForm` becomes `true`.
- **New card appears:** `ProfileCard` renders with the DiceBear avatar seeded from `Date.now()`, so each new profile gets a unique generated avatar automatically.

> 💡 **Why does the form reset automatically?**
>
> When `showForm` becomes `false`, the `AddProfileForm` component unmounts. When `showForm` becomes `true` again, it mounts fresh with `useState(init)` — initial state. You get a blank form with no extra reset logic needed.

---

## Step 9 — Data Flow Diagram
### How all the pieces connect

```
App.tsx
State: profileList, selectedManager, showForm
│
├── "+ Add Profile" button
│     onClick → setShowForm(true)
│
├── {showForm && <AddProfileForm />}  ← mounts fresh each time
│     Props in:  onAdd={addProfile}  onCancel={() => setShowForm(false)}
│     │
│     │  Internal state: form (ProfileFormState), errors (ProfileFormErrors)
│     │  Controlled inputs: name, role, bio, skills, isActive, featured
│     │  Handlers: handleChange, handleBlur, handleSubmit
│     │
│     └── onSubmit → validateField (all fields) → build Profile → onAdd(profile)
│                                                                    │
│           App.addProfile ◄──────────────────────────────────────────┘
│           setProfileList([...prev, profile])
│           setShowForm(false)
│
└── card-grid
      {profileList.map(p => <ProfileCard key={p.id} ... />)}
      New card appears at end of grid after form submit.
```

---

## Complete Reference

| Concept | Key point |
|---|---|
| **Controlled input** | `value={state}` + `onChange={handler}` — React owns the value at all times |
| **Uncontrolled input** | `ref={ref}` — DOM owns the value, React reads it on demand |
| **`e.target.value`** | Read from `text`, `email`, `password`, `number`, `select`, `textarea` |
| **`e.target.checked`** | Read from `checkbox` and `radio` |
| **Generic `handleChange`** | `[e.target.name]: value` updates any field using computed property name |
| **`type="number"` gotcha** | `e.target.value` is always a string — convert with `Number()` or leave as `""` |
| **Radio controlled** | `checked={form.field === value}` — only the matching option is selected |
| **`FormErrors` type** | `Partial<Record<keyof FormState, string>>` — maps field names to error strings |
| **`validateField`** | Pure function: field name + value → error string or `""` |
| **`onBlur` validation** | Validate single field when user leaves it — less intrusive than on every keystroke |
| **`handleSubmit` validation** | Validate all fields at once, block submit if any errors exist |
| **`noValidate`** | Disables browser default validation popups, lets React show custom errors |
| **`ErrorMsg` component** | Small helper renders a red `<span>` when `msg` is truthy, `null` otherwise |
| **`skills` string → array** | `form.skills.split(",").map(s=>s.trim()).filter(s=>s)` on submit |
| **Modal via `showForm`** | Boolean state: `true` = form mounts, `false` = form unmounts and resets |
| **Form auto-reset** | `AddProfileForm` re-mounts with `useState(init)` each time `showForm` becomes `true` |

---

> *Lab 7 will cover context and lifting state — sharing the `profileList` across multiple components without prop drilling, and using `useContext` to access it anywhere in the tree.*
