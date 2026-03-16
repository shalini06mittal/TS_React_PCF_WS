# Lab 1 — Why TypeScript?

**Estimated time:** 20–30 minutes  
**Prerequisites:** None — this lab uses plain JavaScript first, then TypeScript

---

## Objectives

By the end of this lab you will:
- Experience firsthand the type-related bugs JavaScript allows
- See how TypeScript catches the same bugs before running
- Understand static vs dynamic typing in practice

---

## Part A — The JavaScript Problem

Create a file called `buggy.js` and paste the following:

```javascript
// buggy.js

function calculateTotal(price, quantity) {
  return price * quantity;
}

// Simulate a form input (always a string from HTML)
const userPrice = "10";
const userQty = 5;

const total = calculateTotal(userPrice, userQty);
console.log("Total:", total);         // What do you expect?
console.log("Type:", typeof total);   // What type is this?
```

Run it:
```bash
node buggy.js
```

**Questions to answer:**
1. What did `total` print? Was it what you expected?
2. What JavaScript coercion caused this behaviour?
3. How would this bug manifest in a real shopping cart?

---

## Part B — More JavaScript Surprises

Add these to `buggy.js` and re-run:

```javascript
// Property name typos — no error!
const user = { name: "Alice", age: 30 };
console.log(user.nme);       // typo — what happens?
console.log(user.age + "0"); // what does this print?

// Calling something that's not a function
let doSomething = "hello";
// doSomething();  // Uncomment — what error appears and WHEN?
```

**Questions:**
1. When did each error appear — while writing, or while running?
2. If `user.nme` was buried inside 1000 lines of code, how long might it take to find?

---

## Part C — TypeScript to the Rescue

Now create `fixed.ts`:

```typescript
// fixed.ts

function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// Try passing a string — TypeScript won't allow it
const total = calculateTotal("10", 5);  // ← This should be an error
console.log("Total:", total);
```

Compile it (without installing TypeScript globally, use npx):
```bash
npx tsc fixed.ts --noEmit
```

**Expected output:**
```
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

Fix the error by changing `"10"` to `10`, then compile again — it should succeed.

---

## Part D — Static vs Dynamic in Action

Create `typing-demo.ts`:

```typescript
// Dynamic (JavaScript allows this, TypeScript does not)
let score: number = 100;
// score = "one hundred";  // ← Uncomment and see the error

// TypeScript catches property typos too
interface User {
  name: string;
  age: number;
}

const alice: User = { name: "Alice", age: 30 };
console.log(alice.nme);  // ← Should give a compile-time error
```

Compile:
```bash
npx tsc typing-demo.ts --noEmit
```

**Questions:**
1. List the two errors TypeScript reported.
2. Are these errors shown at compile-time or runtime?
3. What is the key advantage of catching them earlier?

---

## Challenge Exercise

Write a TypeScript function `parseInput` that:
- Accepts a value of type `string`
- Returns a `number`
- Uses `parseFloat()` to convert
- Is annotated with proper types

Then call it with a number argument (not a string) and observe the compiler error.

---

## Summary Checklist

- [ ] JavaScript silently coerces types at runtime
- [ ] TypeScript annotations declare the intended type
- [ ] `tsc --noEmit` checks types without producing output files
- [ ] Compile-time errors are caught before the code ever runs
