# Lab 1 — Primitive Types

**Estimated time:** 25–35 minutes  
**Prerequisites:** Node.js installed, TypeScript installed (`npm install -g typescript`)

---

## Objectives

- Declare and use all six primitive types with explicit annotations
- Observe type errors when values are reassigned to wrong types
- Understand `strictNullChecks` and how `null`/`undefined` behave
- Explore `bigint` and `symbol` in practice

---

## Setup

```bash
mkdir primitive-types && cd primitive-types
npm init -y
npm install typescript --save-dev
npx tsc --init
mkdir src
```

In `tsconfig.json`, ensure these are set:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

---

## Part A — string, number, boolean

Create `src/primitives.ts`:

```typescript
// ── string ────────────────────────────────────────────────────
let firstName: string = "Alice";
let lastName: string = 'Wonderland';
let greeting: string = `Hello, ${firstName} ${lastName}!`;

console.log(greeting);
console.log("Length:", firstName.length);
console.log("Uppercase:", firstName.toUpperCase());

// ── number ────────────────────────────────────────────────────
let age: number = 28;
let price: number = 19.99;
let hexColor: number = 0xff5733;
let binaryVal: number = 0b1010;

console.log(`Age: ${age}, Price: ${price}`);
console.log(`Hex: ${hexColor}, Binary: ${binaryVal}`);
console.log("Is NaN:", isNaN(Number("hello")));

// ── boolean ───────────────────────────────────────────────────
let isLoggedIn: boolean = true;
let hasPermission: boolean = false;
let isAdult: boolean = age >= 18;

console.log(`Logged in: ${isLoggedIn}, Adult: ${isAdult}`);
```

Compile and run:
```bash
npx tsc && node dist/primitives.js
```

**Now trigger type errors — add these lines and compile again:**
```typescript
// Uncomment each line one at a time and observe the error:
// firstName = 42;
// age = "twenty-eight";
// isLoggedIn = 1;
```

**Questions:**
1. What error message appears for each? What does "not assignable to type" mean?
2. Why can't `1` be assigned to a `boolean` in TypeScript even though JavaScript treats it as truthy?

---

## Part B — null & undefined

Create `src/nullish.ts`:

```typescript
// Without strictNullChecks these would be silently allowed
// With strict: true they require explicit union types

let username: string | null = null;
let nickname: string | undefined = undefined;

console.log("username:", username);
console.log("nickname:", nickname);

// Assign real values later
username = "alice123";
nickname = "Ali";

console.log("username:", username);
console.log("nickname:", nickname);

// ── Optional chaining ─────────────────────────────────────────
let maybeUser: { name: string } | null = null;
console.log("Name:", maybeUser?.name);   // undefined, not an error

maybeUser = { name: "Bob" };
console.log("Name:", maybeUser?.name);   // "Bob"

// ── Nullish coalescing ────────────────────────────────────────
let displayName = username ?? "Guest";
console.log("Display:", displayName);

// ── Type narrowing with null check ────────────────────────────
function greetUser(name: string | null): string {
  if (name === null) {
    return "Hello, Guest!";
  }
  return `Hello, ${name}!`;
}

console.log(greetUser(null));
console.log(greetUser("Carol"));
```

Compile and run:
```bash
npx tsc && node dist/nullish.js
```

**Exercise:** Write a function `getLength(value: string | null | undefined): number` that returns the string length if it has a value, or `0` otherwise. Use type narrowing (if checks) — no type assertions allowed.

---

## Part C — bigint

Create `src/bigint-demo.ts`:

```typescript
// Regular number has a maximum safe integer
console.log("Max safe integer:", Number.MAX_SAFE_INTEGER);
// 9007199254740991

// Beyond that, precision is lost
const unsafe = Number.MAX_SAFE_INTEGER + 1;
const unsafe2 = Number.MAX_SAFE_INTEGER + 2;
console.log("Are they equal?", unsafe === unsafe2); // true! (bug)

// bigint handles this correctly
const big1: bigint = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
const big2: bigint = BigInt(Number.MAX_SAFE_INTEGER) + 2n;
console.log("bigint equal?", big1 === big2); // false (correct)

// bigint literals use the n suffix
let factorial: bigint = 1n;
for (let i = 1n; i <= 20n; i++) {
  factorial *= i;
}
console.log("20! =", factorial);

// Arithmetic
const a: bigint = 100n;
const b: bigint = 3n;
console.log("Division:", a / b);      // 33n (integer division)
console.log("Modulo:", a % b);        // 1n
console.log("Power:", 2n ** 64n);

// ── IMPORTANT: Cannot mix bigint and number ───────────────────
// const mixed = a + 1;   // ✗ Uncomment to see error
const converted = a + BigInt(1);  // ✓ convert first
console.log("Converted:", converted);
```

Compile and run:
```bash
npx tsc && node dist/bigint-demo.js
```

**Questions:**
1. What is the output of `20!`? Could a regular `number` store this accurately?
2. Uncomment the `mixed` line — what error does TypeScript report?

---

## Part D — symbol

Create `src/symbol-demo.ts`:

```typescript
// Every Symbol() call creates a unique value
const id1: symbol = Symbol("id");
const id2: symbol = Symbol("id");

console.log("Same description, equal?", id1 === id2); // false
console.log("id1:", id1.toString());
console.log("Description:", id1.description);

// ── Symbol as object property key ─────────────────────────────
const SECRET = Symbol("secret");
const VERSION = Symbol("version");

const config = {
  host: "localhost",
  [SECRET]: "super-secret-token",
  [VERSION]: 3,
};

console.log("host:", config.host);
console.log("secret:", config[SECRET]);
console.log("version:", config[VERSION]);

// Symbol keys are NOT included in normal iteration
console.log("Object.keys:", Object.keys(config));         // ["host"]
console.log("JSON.stringify:", JSON.stringify(config));    // {"host":"localhost"}

// ── Symbol.for() creates shared symbols ───────────────────────
const s1 = Symbol.for("shared");
const s2 = Symbol.for("shared");
console.log("Symbol.for equal?", s1 === s2); // true
```

Compile and run:
```bash
npx tsc && node dist/symbol-demo.js
```

---

## Part E — All Primitives Together

Create `src/all-primitives.ts` — a typed "user profile" object using every primitive type:

```typescript
interface UserProfile {
  name: string;
  age: number;
  isVerified: boolean;
  nickname: string | null;
  lastSeen: string | undefined;
  accountId: bigint;
  sessionKey: symbol;
}

const user: UserProfile = {
  name: "Alice",
  age: 30,
  isVerified: true,
  nickname: null,           // not set yet
  lastSeen: undefined,      // never logged in
  accountId: 9007199254740993n,
  sessionKey: Symbol("session"),
};

function describeUser(u: UserProfile): void {
  console.log(`--- ${u.name} ---`);
  console.log(`Age: ${u.age}`);
  console.log(`Verified: ${u.isVerified}`);
  console.log(`Nickname: ${u.nickname ?? "(none)"}`);
  console.log(`Last seen: ${u.lastSeen ?? "never"}`);
  console.log(`Account ID: ${u.accountId}`);
  console.log(`Session: ${u.sessionKey.toString()}`);
}

describeUser(user);
```

Compile and run:
```bash
npx tsc && node dist/all-primitives.js
```

---

## Challenge Exercise

Write a function `formatValue(value: string | number | boolean | null | undefined): string` that:
- Returns the string in quotes if it's a `string`
- Returns the number as-is if it's a `number`
- Returns `"yes"` or `"no"` if it's a `boolean`
- Returns `"(null)"` for `null`
- Returns `"(not set)"` for `undefined`

Use `typeof` narrowing — no type assertions (`as`) allowed.

---

## Summary Checklist

- [ ] Declared variables of all six primitive types with explicit annotations
- [ ] Observed compile-time errors when assigning wrong types
- [ ] Used `string | null` union type with `strictNullChecks`
- [ ] Used optional chaining `?.` and nullish coalescing `??`
- [ ] Created `bigint` literals with the `n` suffix
- [ ] Created unique `symbol` values and used them as object keys
