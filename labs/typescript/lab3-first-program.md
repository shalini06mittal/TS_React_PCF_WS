# Lab 3 — Your First TypeScript Program

**Estimated time:** 30–40 minutes  
**Prerequisites:** Lab 2 completed — Node.js, TypeScript, and tsconfig.json ready

---

## Objectives

By the end of this lab you will:
- Write TypeScript with explicit type annotations
- Understand where TypeScript infers types automatically
- Compile and run a complete TypeScript program

---

## Setup

Use the `ts-workspace` folder from Lab 2, or create a fresh one:

```bash
mkdir first-ts-program && cd first-ts-program
npm init -y
npm install typescript --save-dev
npx tsc --init
mkdir src dist
```

Ensure `tsconfig.json` has `"rootDir": "./src"` and `"outDir": "./dist"`.

---

## Part A — Basic Syntax and Annotations

Create `src/basics.ts`:

```typescript
// ─── Primitive types ───────────────────────────────────────
let firstName: string = "Alice";
let age: number = 28;
let isStudent: boolean = true;

// ─── TypeScript can infer without annotations ──────────────
let city = "Mumbai";        // inferred: string
let score = 95.5;           // inferred: number
let active = true;          // inferred: boolean

// ─── Logging values and types ──────────────────────────────
console.log(`Name: ${firstName}, Age: ${age}, Student: ${isStudent}`);
console.log(`City: ${city}, Score: ${score}`);

// ─── Try to break the type contract ────────────────────────
// Uncomment the line below and compile — observe the error:
// age = "twenty eight";
```

Compile and run:

```bash
npx tsc && node dist/basics.js
```

**Questions:**
1. What did the program print?
2. Uncomment the `age = "twenty eight"` line. What error appears?
3. Put `age` back to a number. Which variables have explicit annotations vs inferred?

---

## Part B — Functions with Types

Create `src/functions.ts`:

```typescript
// ─── Typed parameters and return type ─────────────────────
function greet(name: string, greeting: string): string {
  return `${greeting}, ${name}!`;
}

// ─── Optional parameters (use ?) ───────────────────────────
function introduce(name: string, role?: string): string {
  if (role) {
    return `I'm ${name}, a ${role}.`;
  }
  return `I'm ${name}.`;
}

// ─── Default parameter values ───────────────────────────────
function power(base: number, exponent: number = 2): number {
  return Math.pow(base, exponent);
}

// ─── Arrow function syntax ──────────────────────────────────
const multiply = (a: number, b: number): number => a * b;

// ─── Test the functions ─────────────────────────────────────
console.log(greet("Alice", "Hello"));
console.log(introduce("Bob"));
console.log(introduce("Carol", "developer"));
console.log(`2^10 = ${power(2, 10)}`);
console.log(`3^2 = ${power(3)}`);
console.log(`6 × 7 = ${multiply(6, 7)}`);
```

Compile and run:

```bash
npx tsc && node dist/functions.js
```

**Exercise:** Add a function `clamp(value: number, min: number, max: number): number` that returns `value` clamped between `min` and `max`. Call it with a few test values.

---

## Part C — Type Inference Deep Dive

Create `src/inference.ts`:

```typescript
// TypeScript infers the type from the initial value
let count = 0;
count = count + 1;
// count = "hello";    // ← Uncomment to see error — type is LOCKED after inference

// Inference in arrays
let numbers = [1, 2, 3];          // inferred: number[]
let words = ["hello", "world"];   // inferred: string[]
// numbers.push("four");           // ← Error: string not assignable to number

// Inference from function return
function getUser() {
  return { name: "Alice", age: 30 };
}
// TypeScript knows the shape of what getUser() returns
const user = getUser();
console.log(user.name.toUpperCase());   // ✓ IntelliSense knows .name is a string
// console.log(user.nme);               // ← Uncomment: TypeScript catches the typo

// When inference isn't enough — use explicit types
let data: string | number;   // union type — can be either
data = "hello";
data = 42;
// data = true;               // ← Error

console.log("count:", count);
console.log("user:", user.name, user.age);
console.log("data:", data);
```

Compile and run:

```bash
npx tsc && node dist/inference.js
```

---

## Part D — Interfaces and Object Types

Create `src/objects.ts`:

```typescript
// ─── Define an interface (object shape) ───────────────────
interface Student {
  id: number;
  name: string;
  grade: string;
  score?: number;   // optional property
}

// ─── Create objects that match the interface ───────────────
const student1: Student = {
  id: 1,
  name: "Alice",
  grade: "A",
  score: 95,
};

const student2: Student = {
  id: 2,
  name: "Bob",
  grade: "B",
  // score is optional — can be omitted
};

// ─── Function that accepts the interface ───────────────────
function printStudent(s: Student): void {
  const scoreText = s.score !== undefined ? ` (${s.score}%)` : "";
  console.log(`[${s.id}] ${s.name} — Grade: ${s.grade}${scoreText}`);
}

// ─── Arrays of typed objects ───────────────────────────────
const roster: Student[] = [student1, student2];

roster.forEach(printStudent);

// ─── Try violating the interface ───────────────────────────
// Uncomment the block below and see all three errors:
/*
const invalid: Student = {
  id: "three",          // Error: string not assignable to number
  name: "Carol",
  grade: "C",
  extra: "field",       // Error: extra property not in interface
};
*/
```

Compile and run:

```bash
npx tsc && node dist/objects.js
```

---

## Part E — Putting It All Together

Create `src/app.ts` — a mini student grade calculator:

```typescript
interface Student {
  name: string;
  scores: number[];
}

function average(scores: number[]): number {
  const sum = scores.reduce((acc, s) => acc + s, 0);
  return sum / scores.length;
}

function letterGrade(avg: number): string {
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 70) return "C";
  if (avg >= 60) return "D";
  return "F";
}

function report(student: Student): string {
  const avg = average(student.scores);
  const grade = letterGrade(avg);
  return `${student.name}: avg ${avg.toFixed(1)} → ${grade}`;
}

// ─── Data ─────────────────────────────────────────────────
const students: Student[] = [
  { name: "Alice", scores: [92, 88, 95, 91] },
  { name: "Bob",   scores: [74, 68, 79, 72] },
  { name: "Carol", scores: [85, 90, 88, 92] },
];

console.log("=== Grade Report ===");
students.forEach(s => console.log(report(s)));
```

Compile and run:

```bash
npx tsc && node dist/app.js
```

**Expected output:**
```
=== Grade Report ===
Alice: avg 91.5 → A
Bob: avg 73.3 → C
Carol: avg 88.8 → B
```

---

## Challenge Exercise

Extend `src/app.ts` with:

1. A `topStudent(students: Student[]): Student` function that returns the student with the highest average.
2. A `failing(students: Student[]): Student[]` function that returns all students with an average below 60.
3. Print the results using the `report()` function.

All functions must have explicit parameter and return type annotations.

---

## Summary Checklist

- [ ] Wrote variables with explicit `: type` annotations
- [ ] Observed TypeScript inferring types automatically
- [ ] Created a typed function with optional and default parameters
- [ ] Defined an `interface` and used it as a type
- [ ] Compiled with `npx tsc` and ran with `node dist/app.js`
- [ ] Intentionally triggered at least two type errors and understood the messages
