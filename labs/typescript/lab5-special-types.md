# Lab 2 — Special Types: any, unknown, never, void

**Estimated time:** 30–40 minutes  
**Prerequisites:** Lab 1 completed, TypeScript project with `strict: true`

---

## Objectives

- Understand when `any` removes type safety (and why to avoid it)
- Use `unknown` safely with type narrowing
- Write functions that return `never` for exhaustiveness checking
- Correctly annotate functions that return nothing with `void`

---

## Setup

Continue in your existing project or create a fresh one:

```bash
mkdir special-types && cd special-types
npm init -y
npm install typescript --save-dev
npx tsc --init
mkdir src
```

Ensure `tsconfig.json` has `"strict": true`.

---

## Part A — any: The Escape Hatch

Create `src/any-demo.ts`:

```typescript
// any turns off ALL type checking
let value: any = "hello";
value = 42;
value = true;
value = { name: "Alice" };
value = [1, 2, 3];

// TypeScript won't warn about any of these
console.log(value.nonExistentMethod()); // Runtime crash!

// ── Where any leaks ───────────────────────────────────────────
function processData(data: any): void {
  // data is any, so result is also any
  const result = data.value;
  console.log(result.toUpperCase()); // Might crash at runtime
}

// ── The any cascade problem ───────────────────────────────────
const config: any = { port: "3000" }; // string, not number
const port: number = config.port;     // no error! but it's a string
console.log(port + 100);              // "3000100" — wrong!
```

Compile and run:
```bash
npx tsc && node dist/any-demo.js
```

**Notice:** TypeScript compiles without errors — but the runtime output is wrong.

**Controlled use of any:** Sometimes you genuinely need it. Here is the acceptable pattern:

```typescript
// Migrating legacy JS — annotate what you know, use any for the rest
function legacyProcess(input: any): string {
  // Validate before use
  if (typeof input !== "string") {
    throw new Error("Expected string input");
  }
  return input.toUpperCase();
}

console.log(legacyProcess("hello")); // "HELLO"
// console.log(legacyProcess(42));   // Throws at runtime
```

**Questions:**
1. What printed to the console when you ran the file? Where did it go wrong?
2. What is the "any cascade" problem shown in the `config` example?

---

## Part B — unknown: Safe Dynamic Typing

Create `src/unknown-demo.ts`:

```typescript
// unknown also accepts any value...
let data: unknown = "hello";
data = 42;
data = { name: "Alice" };

// ...but you CANNOT use it without narrowing first
// data.toUpperCase();       // ✗ Error
// const n: number = data;   // ✗ Error

// ── Narrowing with typeof ─────────────────────────────────────
function processInput(input: unknown): string {
  if (typeof input === "string") {
    return input.toUpperCase();   // ✓ TypeScript knows it's a string here
  }
  if (typeof input === "number") {
    return input.toFixed(2);      // ✓ TypeScript knows it's a number
  }
  if (Array.isArray(input)) {
    return input.join(", ");      // ✓ TypeScript knows it's an array
  }
  return String(input);           // fallback
}

console.log(processInput("hello"));       // HELLO
console.log(processInput(3.14159));       // 3.14
console.log(processInput([1, 2, 3]));     // 1, 2, 3
console.log(processInput(true));          // true

// ── unknown for API responses ──────────────────────────────────
async function fetchUser(id: number): Promise<unknown> {
  // Simulate an API response
  return { id, name: "Alice", age: 30 };
}

async function main() {
  const response = await fetchUser(1);

  // Must narrow before using
  if (
    typeof response === "object" &&
    response !== null &&
    "name" in response
  ) {
    const user = response as { id: number; name: string; age: number };
    console.log(`User: ${user.name}, Age: ${user.age}`);
  }
}

main();
```

Compile and run:
```bash
npx tsc && node dist/unknown-demo.js
```

**Exercise:** Write a function `safeJsonParse(json: string): unknown` that wraps `JSON.parse` in a try/catch. Then write a second function `parseUser(data: unknown): { name: string; age: number } | null` that narrows the unknown to the user shape (or returns `null` if invalid).

---

## Part C — never: Unreachable Code & Exhaustive Checks

Create `src/never-demo.ts`:

```typescript
// ── 1. Functions that always throw ────────────────────────────
function assertNever(message: string): never {
  throw new Error(`Assertion failed: ${message}`);
}

function divide(a: number, b: number): number {
  if (b === 0) {
    assertNever("Cannot divide by zero");
  }
  return a / b;
}

console.log(divide(10, 2));    // 5
// console.log(divide(10, 0)); // throws

// ── 2. Exhaustive type checking ───────────────────────────────
type Direction = "north" | "south" | "east" | "west";

function move(dir: Direction): string {
  switch (dir) {
    case "north": return "Moving up ↑";
    case "south": return "Moving down ↓";
    case "east":  return "Moving right →";
    case "west":  return "Moving left ←";
    default:
      // This line makes TypeScript catch missing cases
      const _exhaustive: never = dir;
      return _exhaustive;
  }
}

console.log(move("north"));
console.log(move("east"));

// ── What happens when you add a new variant? ──────────────────
// Try adding "up" to the Direction type:
// type Direction = "north" | "south" | "east" | "west" | "up";
// The default branch now errors — TypeScript forces you to handle it!

// ── 3. Filtering with never ───────────────────────────────────
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string
```

Compile and run:
```bash
npx tsc && node dist/never-demo.js
```

**Exercise:**
1. Add `"up"` to the `Direction` type and observe the compile error in the `default` branch.
2. Add a `case "up": return "Moving up ↑";` to fix it.
3. What does this pattern guarantee about your code?

---

## Part D — void

Create `src/void-demo.ts`:

```typescript
// ── Functions that return nothing ────────────────────────────
function logMessage(level: string, msg: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${level.toUpperCase()}] ${timestamp}: ${msg}`);
}

logMessage("info", "App started");
logMessage("warn", "Memory usage high");

// ── void vs returning undefined ───────────────────────────────
function explicit(): void {
  return;             // OK — void functions may return early
}

function returnsUndefined(): undefined {
  return undefined;   // Must explicitly return undefined
}

// ── void in callbacks ─────────────────────────────────────────
const numbers = [1, 2, 3, 4, 5];

// forEach callback returns void
numbers.forEach((n: number): void => {
  console.log(`Item: ${n}`);
});

// ── Event handler pattern ─────────────────────────────────────
type EventHandler = (event: string) => void;

const onClick: EventHandler = (event) => {
  console.log(`Clicked: ${event}`);
};

const onHover: EventHandler = (event) => {
  console.log(`Hovered: ${event}`);
  // Note: void handlers CAN return a value, but it's ignored
};

onClick("button");
onHover("menu");

// ── void vs never summary ─────────────────────────────────────
function returnsVoid(): void {
  console.log("I complete normally");
  // returns undefined implicitly
}

function returnsNever(): never {
  throw new Error("I never complete");
}
```

Compile and run:
```bash
npx tsc && node dist/void-demo.js
```

**Questions:**
1. Can a `void` function have a `return` statement? What can it return?
2. What is the difference between `void` and `undefined` as a return type?
3. A `never` function and a `void` function both have no useful return value — what is the key difference?

---

## Part E — Putting It All Together

Create `src/special-types-app.ts` — a data-processing pipeline:

```typescript
type RawInput = string | number | boolean | object | null;

// Step 1: Accept any raw input (from an external source)
function receiveInput(raw: unknown): RawInput {
  if (
    typeof raw === "string" ||
    typeof raw === "number" ||
    typeof raw === "boolean" ||
    (typeof raw === "object" && raw !== null)
  ) {
    return raw as RawInput;
  }
  throw new Error(`Invalid input: ${raw}`);
}

// Step 2: Process known types
function processValue(input: RawInput): string {
  if (typeof input === "string") return `"${input}"`;
  if (typeof input === "number") return input.toFixed(2);
  if (typeof input === "boolean") return input ? "yes" : "no";
  if (input === null) return "(null)";
  if (typeof input === "object") return JSON.stringify(input);
  // TypeScript knows this is unreachable
  const _: never = input;
  return _;
}

// Step 3: Log (void return)
function logResult(label: string, value: string): void {
  console.log(`${label}: ${value}`);
}

// Run pipeline
const inputs: unknown[] = ["hello", 42, true, { key: "val" }, null];

inputs.forEach((raw) => {
  try {
    const received = receiveInput(raw);
    const processed = processValue(received);
    logResult(typeof raw, processed);
  } catch (e) {
    console.error("Error:", (e as Error).message);
  }
});
```

Compile and run:
```bash
npx tsc && node dist/special-types-app.js
```

---

## Challenge Exercise

Create a `Result<T>` type that is either `{ ok: true; value: T }` or `{ ok: false; error: string }`. Write:

1. `safeDiv(a: number, b: number): Result<number>` — returns `ok: false` if `b === 0`
2. `unwrap<T>(result: Result<T>): T` — returns the value or calls a `never`-returning function if the result is an error
3. Test both cases

---

## Summary Checklist

- [ ] Experienced the "any cascade" problem firsthand
- [ ] Used `unknown` with `typeof` narrowing before accessing properties
- [ ] Wrote a `never`-returning function (throws)
- [ ] Implemented an exhaustive `switch` with `never` in the `default` branch
- [ ] Added a new union variant and watched TypeScript force you to handle it
- [ ] Annotated callbacks and event handlers with `void`
- [ ] Explained the difference between `void`, `never`, and `undefined` return types
