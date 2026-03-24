# Lab 2 — Portfolio Management System

**Context:** We're continuing from Lab 1.

Our `ProfileCard` had all its data hardcoded inside it. That means every card shows "Alex Chen" — useless for a real portfolio system with multiple managers. Props fix this.

---

## Table of Contents

- [Lab 2 — Portfolio Management System](#lab-2--portfolio-management-system)
  - [Table of Contents](#table-of-contents)
  - [1. Define Props](#1-define-props)
    - [Define a Props Type for ProfileCard](#define-a-props-type-for-profilecard)
  - [2. Pass Props from App to ProfileCard](#2-pass-props-from-app-to-profilecard)
  - [3. Optional Props with Default Values](#3-optional-props-with-default-values)
  - [4. Passing Events from ProfileCard up to App](#4-passing-events-from-profilecard-up-to-app)
    - [Step 1 — Update the props type and component](#step-1--update-the-props-type-and-component)
    - [Step 2 — Update App.tsx to define the handler and receive the event](#step-2--update-apptsx-to-define-the-handler-and-receive-the-event)
    - [The Full Data Flow](#the-full-data-flow)
  - [5. Common Mistakes to Watch For](#5-common-mistakes-to-watch-for)
  - [6. Refactor for Profile Datasets](#6-refactor-for-profile-datasets)
    - [Create `src/data/profiles.ts`](#create-srcdataprofilests)
    - [Update `ProfileCard.tsx` to use the `Profile` type](#update-profilecardtsx-to-use-the-profile-type)
    - [Update `App.tsx` to fetch data from `profiles.ts`](#update-apptsx-to-fetch-data-from-profilests)
  - [7. Refactor Skills in a Separate Component \[EXTRA\]](#7-refactor-skills-in-a-separate-component-extra)
    - [Create `src/components/SkillBadge.tsx`](#create-srccomponentsskillbadgetsx)
  - [8. Refactor ProfileCard — Styles \[EXTRA\]](#8-refactor-profilecard--styles-extra)
    - [Create `ProfileCard.module.css`](#create-profilecardmodulecss)
    - [Rewrite `ProfileCard.tsx` with CSS Module and `SkillBadge`](#rewrite-profilecardtsx-with-css-module-and-skillbadge)
  - [9. Update Global Styles](#9-update-global-styles)
    - [Replace `src/App.css` with the following:](#replace-srcappcss-with-the-following)

---

## 1. Define Props

Props (short for *properties*) are how a parent component passes data down to a child component. Think of a component as a function — props are just its parameters. In TypeScript, we define exactly what shape those parameters must take, so the compiler catches mistakes before the app runs.

### Define a Props Type for ProfileCard

Open `src/components/ProfileCard.tsx`. Right now the component takes no arguments. We'll add a TypeScript type that describes what data it should receive. Remove or comment the `const` variables we declared in Lab 1.

<pre><code class="language-tsx">// src/components/ProfileCard.tsx

<mark>type ProfileCardProps = {
  name: string
  role: string
  skills: string[]
  bio: string
}</mark>

<mark>function ProfileCard({ name, role, skills, bio }: ProfileCardProps) {</mark>

  return (
    &lt;div style={{ background: '#1e3a5f', borderRadius: '12px', padding: '1.5rem', color: 'white' }}&gt;
      &lt;h2&gt;{name}&lt;/h2&gt;
      &lt;p&gt;{role}&lt;/p&gt;
      &lt;p&gt;{bio}&lt;/p&gt;
      &lt;div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}&gt;
        {skills.map((skill) =&gt; (
          &lt;span
            key={skill}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '13px',
            }}
          &gt;
            {skill}
          &lt;/span&gt;
        ))}
      &lt;/div&gt;
    &lt;/div&gt;
  )
}

export default ProfileCard
</code></pre>

Three things happened here:

- **`type ProfileCardProps`** declares the shape of the props object. `name` and `role` are strings, `skills` is an array of strings. TypeScript will now enforce this everywhere the component is used.
- **`{ name, role, skills, bio }: ProfileCardProps`** is destructuring. Instead of writing `props.name` and `props.role` everywhere, we pull the values out directly in the function signature. The `: ProfileCardProps` part tells TypeScript what type the whole props object is.
- **The JSX body** is now using `{name}`, `{role}`, and `{skills}` from props instead of the hardcoded constants from Lab 1.

---

## 2. Pass Props from App to ProfileCard

Open `src/App.tsx`. Now that `ProfileCard` expects props, passing nothing will give you a TypeScript error. We pass props as attributes, exactly like HTML attributes.

```tsx
// src/App.tsx

import ProfileCard from './components/ProfileCard'

function App() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h1>Portfolio Dashboard</h1>

      <ProfileCard
        name="Alex Chen"
        role="Portfolio Manager"
        skills={['Equities', 'Fixed Income', 'ETFs']}
        bio="Builds and manages investment portfolios to maximize returns while balancing risk."
      />

      <ProfileCard
        name="Sara Patel"
        role="Risk Analyst"
        skills={['Derivatives', 'Options', 'Hedging']}
        bio="Identifies, measures, and mitigates financial risks to protect assets and ensure stability."
      />

      <ProfileCard
        name="James Okafor"
        role="Quant Researcher"
        skills={['Algo Trading', 'Python', 'Statistics']}
        bio="Develops data-driven models and algorithms to uncover market insights and optimize trading strategies"
      />
    </div>
  )
}

export default App
```

Notice that the same `ProfileCard` component renders three completely different people. This is the core value of props — one component definition, infinite variations.

- **String props** like `name="Alex Chen"` are passed with plain quotes, just like HTML attributes.
- **Non-string props** like the skills array use curly braces: `skills={['Equities', ...]}`. The curly braces mean "this is a JavaScript expression, not a string". This applies to numbers, booleans, arrays, objects, and functions.

If you now try `<ProfileCard />` with no attributes at all, TypeScript will immediately underline it in red and tell you `name`, `role`, and `skills` are missing. This is exactly the safety TypeScript gives you.

---

## 3. Optional Props with Default Values

Not every prop has to be required. Say we want to optionally show whether a manager is currently active. We mark optional props with `?`.

<pre><code class="language-tsx">// src/components/ProfileCard.tsx

type ProfileCardProps = {
  name: string
  role: string
  skills: string[]
  bio: string
<mark>  isActive?: boolean    // the ? makes this optional
  avatarUrl?: string    // optional
  featured?: boolean    // optional — defaults to false</mark>
}

function ProfileCard({
  name,
  role,
  skills,
  bio,
<mark>  isActive = true,      // default value
  avatarUrl,
  featured = false,     // default value</mark>
}: ProfileCardProps) {

  return (
    &lt;div style={{
      background: '#1e3a5f',
      borderRadius: '12px',
      padding: '1.5rem',
      color: 'white',
<mark>      border: featured ? '3px groove #cbb78b' : '#fff'</mark>
    }}&gt;

<mark>      &lt;div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}&gt;
        {avatarUrl ? (
          &lt;img
            src={avatarUrl}
            alt={name}
            style={{
              width: '56px', height: '56px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #0D9488',
            }}
          /&gt;
        ) : (
          &lt;div style={{
            width: '56px', height: '56px',
            borderRadius: '50%',
            background: '#0D9488',
            fontSize: '1rem',
          }}&gt;
            No image
          &lt;/div&gt;
        )}
        &lt;h2&gt;{name}&lt;/h2&gt;
        &lt;span style={{
          background: isActive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
          color: isActive ? '#86efac' : '#fca5a5',
          borderRadius: '20px',
          padding: '3px 10px',
          fontSize: '12px',
        }}&gt;
          {isActive ? 'Active' : 'Inactive'}
        &lt;/span&gt;
      &lt;/div&gt;</mark>

      &lt;p&gt;{role}&lt;/p&gt;
      &lt;p&gt;{bio}&lt;/p&gt;

      &lt;div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}&gt;
        {skills.map((skill) =&gt; (
          &lt;span
            key={skill}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '13px',
            }}
          &gt;
            {skill}
          &lt;/span&gt;
        ))}
      &lt;/div&gt;
    &lt;/div&gt;
  )
}

export default ProfileCard
</code></pre>

`isActive = true` in the destructuring sets the default — if the parent doesn't pass `isActive`, it falls back to `true`. The ternary `isActive ? 'Active' : 'Inactive'` is a common JSX pattern for conditional content.

In `App.tsx`, you can now pass it selectively:

<pre><code class="language-tsx">&lt;ProfileCard
  name="Alex Chen"
  role="Portfolio Manager"
  skills={['Equities', 'Fixed Income', 'ETFs']}
  bio="Builds and manages investment portfolios to maximize returns while balancing risk."
<mark>  featured={true}
  avatarUrl="https://picsum.photos/200"</mark>
/&gt;

&lt;ProfileCard
  name="Sara Patel"
  role="Risk Analyst"
  skills={['Derivatives', 'Options', 'Hedging']}
  bio="Identifies, measures, and mitigates financial risks to protect assets and ensure stability."
<mark>  isActive={false}
  avatarUrl="https://picsum.photos/200"</mark>
/&gt;

&lt;ProfileCard
  name="James Okafor"
  role="Quant Researcher"
  skills={['Algo Trading', 'Python', 'Statistics']}
  bio="Develops data-driven models and algorithms to uncover market insights and optimize trading strategies"
/&gt;
</code></pre>

---

## 4. Passing Events from ProfileCard up to App

Data flows down via props. But what about the opposite direction — what if a user clicks something inside `ProfileCard` and `App` needs to know about it?

The pattern is: **App defines a function, passes it as a prop, ProfileCard calls it.**

We'll add a "Select Manager" button to `ProfileCard`. When clicked, it tells `App` which manager was selected.

### Step 1 — Update the props type and component

<pre><code class="language-tsx">// src/components/ProfileCard.tsx

type ProfileCardProps = {
  name: string
  role: string
  skills: string[]
  bio:string
  isActive?: boolean
  avatarUrl?: string
  featured?: boolean
<mark>  onSelect: (name: string) =&gt; void  // a function prop</mark>
}

function ProfileCard({
  name,
  role,
  skills,
  bio,
  isActive = true,
  avatarUrl,
  featured = false,
<mark>  onSelect,</mark>
}: ProfileCardProps) {

  return (
    &lt;div style={{
      background: '#1e3a5f',
      borderRadius: '12px',
      padding: '1.5rem',
      color: 'white',
      border: featured ? '3px groove #cbb78b' : '#fff',
    }}&gt;

      &lt;div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}&gt;
        {avatarUrl ? (
          &lt;img
            src={avatarUrl}
            alt={name}
            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0D9488' }}
          /&gt;
        ) : (
          &lt;div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#0D9488', fontSize: '1rem' }}&gt;
            No image
          &lt;/div&gt;
        )}
        &lt;h2&gt;{name}&lt;/h2&gt;
        &lt;span style={{
          background: isActive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
          color: isActive ? '#86efac' : '#fca5a5',
          borderRadius: '20px',
          padding: '3px 10px',
          fontSize: '12px',
        }}&gt;
          {isActive ? 'Active' : 'Inactive'}
        &lt;/span&gt;
      &lt;/div&gt;

      &lt;p style={{ marginTop: '4px' }}&gt;{role}&lt;/p&gt;
      &lt;p style={{ marginTop: '4px' }}&gt;{bio}&lt;/p&gt;

      &lt;div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}&gt;
        {skills.map((skill) =&gt; (
          &lt;span
            key={skill}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '13px',
            }}
          &gt;
            {skill}
          &lt;/span&gt;
        ))}
      &lt;/div&gt;

<mark>      &lt;button
        onClick={() =&gt; onSelect?.(name)}
        style={{
          marginTop: '1rem',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          background: 'rgba(255,255,255,0.15)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '13px',
        }}
      &gt;
        Select Manager
      &lt;/button&gt;</mark>

    &lt;/div&gt;
  )
}

export default ProfileCard
</code></pre>

The key line is `onSelect: (name: string) => void` in the type. This says: `onSelect` is a function that receives a string and returns nothing. TypeScript enforces this — if you try to pass a function with the wrong signature, it errors immediately.

`onClick={() => onSelect(name)}` is an arrow function wrapping the call. We use an arrow function here so we can pass `name` as an argument. Writing `onClick={onSelect(name)}` without the arrow would call `onSelect` immediately on render, not on click.

### Step 2 — Update App.tsx to define the handler and receive the event

<pre><code class="language-tsx">// src/App.tsx

import { useState } from 'react'
import ProfileCard from './components/ProfileCard'

function App() {

<mark>  const handleSelectManager = (name: string) =&gt; {
    alert('Profile select'+name);
  }</mark>

  return (
    &lt;div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}&gt;
      &lt;h1&gt;Portfolio Dashboard&lt;/h1&gt;

      &lt;ProfileCard
        name="Alex Chen"
        role="Portfolio Manager"
        skills={['Equities', 'Fixed Income', 'ETFs']}
<mark>        onSelect={handleSelectManager}</mark>
      /&gt;

      &lt;ProfileCard
        name="Sara Patel"
        role="Risk Analyst"
        skills={['Derivatives', 'Options', 'Hedging']}
        isActive={false}
<mark>        onSelect={handleSelectManager}</mark>
      /&gt;

      &lt;ProfileCard
        name="James Okafor"
        role="Quant Researcher"
        skills={['Algo Trading', 'Python', 'Statistics']}
<mark>        onSelect={handleSelectManager}</mark>
      /&gt;

    &lt;/div&gt;
  )
}

export default App
</code></pre>

- `onSelect={handleSelectManager}` passes the function itself as a prop — no parentheses, no arguments. The component receives the function and decides when to call it (on button click).
- The `{selectedManager && (...)}` block is a conditional render pattern — if `selectedManager` is null or empty, nothing renders. Once a manager is selected, the green banner appears.

### The Full Data Flow

```
App
│
│  passes: name, role, skills, isActive, onSelect
▼
ProfileCard
│
│  user clicks "Select Manager"
│  ProfileCard calls: onSelect("Alex Chen")
│
▼
App receives the name via handleSelectManager
App updates selectedManager state
App re-renders with the green banner showing "Alex Chen"
```

Data goes **down** as props. Events go **up** as function calls. This one-directional flow is the foundation of how all React apps communicate between components.

---

## 5. Common Mistakes to Watch For

**Calling a function prop immediately instead of on click.**
`onClick={onSelect(name)}` runs on render. `onClick={() => onSelect(name)}` runs on click. Always use the arrow function when you need to pass arguments.

**Forgetting curly braces for non-string props.**
`isActive="false"` passes the string `"false"` which is truthy. `isActive={false}` passes the boolean `false`. These behave completely differently.

**Mutating props.**
Props are read-only inside the child. Never do `name = "something else"` inside `ProfileCard`. If data needs to change, the change must happen in the parent (`App`) and flow back down as new props.

---

## 6. Refactor for Profile Datasets

Rather than hardcoding props in `App.tsx`, we store data in a separate file. This is a common real-world pattern.

### Create `src/data/profiles.ts`

Create the folder `src/data/` first if it doesn't exist.

```ts
export interface Profile {
  id: number;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  isActive?: boolean;
  avatarUrl?: string;    // optional
  featured?: boolean;    // optional — defaults to false
  onSelect?: (name: string) => void  // a function prop
}

export const profiles: Profile[] = [
  {
    id: 1,
    name: 'Alex Chan',
    role: 'Portfolio Manager',
    bio: 'Builds and manages investment portfolios to maximize returns while balancing risk.',
    skills: ['Equities', 'Fixed Income', 'ETFs'],
    isActive: true,
    featured: true,
    avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=1`,
  },
  {
    id: 2,
    name: 'Riya Mehta',
    role: 'Risk Analyst',
    bio: 'Identifies, measures, and mitigates financial risks to protect assets and ensure stability.',
    skills: ['Risk Modeling', 'VaR', 'Stress Testing'],
    isActive: true,
    featured: false,
    avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=2`,
  },
  {
    id: 3,
    name: 'Daniel Kim',
    role: 'Quant Researcher',
    bio: 'Develops data-driven models and algorithms to uncover market insights and optimize trading strategies.',
    skills: ['Python', 'Machine Learning', 'Statistical Modeling'],
    isActive: true,
    featured: true,
    avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=3`,
  },
  {
    id: 4,
    name: 'Priya Sharma',
    role: 'Financial Analyst',
    bio: 'Analyzes financial data and trends to support strategic investment and business decisions.',
    skills: ['Financial Modeling', 'Valuation', 'Excel'],
    isActive: true,
    featured: false,
    avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=4`,
  },
  {
    id: 5,
    name: 'Michael Brown',
    role: 'Trader',
    bio: 'Executes trades and monitors market movements to capitalize on short-term opportunities.',
    skills: ['Derivatives', 'Technical Analysis', 'Market Timing'],
    isActive: false,
    featured: false,
    avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=5`,
  },
  {
    id: 6,
    name: 'Ananya Iyer',
    role: 'Data Scientist',
    bio: 'Leverages data analytics and machine learning to generate actionable financial insights.',
    skills: ['Python', 'Pandas', 'Deep Learning'],
    isActive: true,
    featured: true,
    avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=6`,
  },
];
```

### Update `ProfileCard.tsx` to use the `Profile` type

Add these lines before the `function ProfileCard` declaration:

```tsx
import type { Profile } from '../data/profiles';

// Re-use the Profile interface as props
// Omit id since the card doesn't need it
type ProfileCardProps = Omit<Profile, 'id'>;

```
<b>Do comment out the previous type ProfileCardProps we had declared.</b>

### Update `App.tsx` to fetch data from `profiles.ts`

Add this import at the top:

```tsx
import { profiles } from './data/profiles';
```

Remove all three `<ProfileCard>` tags and replace with:

```tsx
{profiles.map(profile => (
  <ProfileCard
    key={profile.id}
    name={profile.name}
    role={profile.role}
    skills={profile.skills}
    bio={profile.bio}
    avatarUrl={profile.avatarUrl}
    featured={profile.featured}
    isActive={profile.isActive}
    onSelect={handleSelectManager}
  />
))}
```

Test in the browser — it should work the same but now with 6 portfolio cards.

---

## 7. Refactor Skills in a Separate Component [EXTRA]

Extract the badge element from `ProfileCard` into its own reusable component. This is the *'Extract When Repeated'* principle from the slides.

### Create `src/components/SkillBadge.tsx`

```tsx
import React from 'react';

// TypeScript interface for props
interface SkillBadgeProps {
  label: string;
  color?: string;  // optional — defaults to teal
}

// Colour map: skill name → background colour
const colorMap: Record<string, string> = {
  React: '#0D9488',
  TypeScript: '#3B82F6',
  JavaScript: '#F59E0B',
  'Node.js': '#22C55E',
  CSS: '#A855F7',
  'CSS Modules': '#7C3AED',
  Vite: '#646CFF',
  Figma: '#EF4444',
  Tailwind: '#06B6D4',
  Docker: '#2563EB',
  Storybook: '#FF4785',
  PostgreSQL: '#336791',
};

const SkillBadge = ({ label, color }: SkillBadgeProps) => {
  // Inline style: dynamic background from colorMap or prop
  const style: React.CSSProperties = {
    backgroundColor: color ?? colorMap[label] ?? '#0D9488',
    color: '#ffffff',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: 600,
    display: 'inline-block',
    margin: '3px',
    letterSpacing: '0.02em',
  };

  return <span style={style}>{label}</span>;
};

export default SkillBadge;
```

---

## 8. Refactor ProfileCard — Styles [EXTRA]

### Create `ProfileCard.module.css`

```css
.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.featured {
  border-color: #0D9488;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.18);
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0D9488;
}

.avatarPlaceholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #0D9488;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
}

.name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1A2B4A;
  margin: 0;
}

.role {
  font-size: 0.875rem;
  color: #0D9488;
  font-weight: 500;
  margin: 0;
}

.bio {
  font-size: 0.9rem;
  color: #64748B;
  line-height: 1.6;
}

.skillsSection {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.featuredBadge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #0D9488;
  border: 1px solid #0D9488;
  border-radius: 4px;
  padding: 2px 8px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.pactive {
  background: rgba(34, 197, 94, 0.2);
  color: rgb(46 164 89);
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 12px;
}

.pinactive {
  background: rgba(68, 35, 35, 0.2);
  color: rgb(206 64 64);
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 12px;
}
```

### Rewrite `ProfileCard.tsx` with CSS Module and `SkillBadge`

```tsx
// src/components/ProfileCard.tsx

import SkillBadge from './SkillBadge';
import styles from './ProfileCard.module.css';
import { Profile } from '../data/profiles';

// Re-use the Profile interface as props
// Omit id since the card doesn't need it
type ProfileCardProps = Omit<Profile, 'id'>;

function ProfileCard({
  name,
  role,
  bio,
  skills,
  avatarUrl,
  isActive = true,
  featured = false,  // default prop value
  onSelect
}: ProfileCardProps) {

  // Derive initials for avatar placeholder
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('');

  // Compose class names: always .card, add .featured if prop is true
  const cardClass = [
    styles.card,
    featured ? styles.featured : '',
  ].join(' ');

  return (
    <div className={cardClass}>

      {/* Header row: avatar + name/role */}
      <div className={styles.header}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{initials}</div>
        )}

        <div>
          <p className={styles.name}>{name}</p>
          <p className={styles.role}>{role}</p>
        </div>

        {featured && (
          <span className={styles.featuredBadge}>Featured</span>
        )}

        <span className={isActive ? styles.pactive : styles.pinactive}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Bio */}
      <p className={styles.bio}>{bio}</p>

      {/* Skills — reusable SkillBadge components */}
      <div className={styles.skillsSection}>
        {skills.map((skill) => (
          <SkillBadge key={skill} label={skill} />
        ))}
      </div>
       <button
        onClick={() => onSelect?.(name)}
        style={{
          marginTop: '1rem',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          background: 'rgba(13, 148, 136,0.6)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '13px',
          width:'15%'
        }}
      >
        Select Manager
      </button>
    </div>
  );
}

export default ProfileCard;
```

---

## 9. Update Global Styles

Update the global stylesheet to add a flex grid layout for multiple cards.

### Replace `src/App.css` with the following:

```css
/* CSS Custom Properties (theme variables) */
:root {
  --color-primary: #0D9488;
  --color-navy: #1A2B4A;
  --color-bg: #F0FDFA;
  --font-sans: 'Inter', system-ui, sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-navy);
}

.app {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.app-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.app-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-navy);
  margin-bottom: 0.5rem;
}

.app-header p {
  color: #64748B;
  font-size: 1rem;
}

/* Card grid — responsive */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

Then add this import at the top of `App.tsx`:

```tsx
import './App.css'
```
