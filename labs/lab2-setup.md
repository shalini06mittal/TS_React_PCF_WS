# Lab 2 — Setting Up the TypeScript Environment

**Estimated time:** 25–35 minutes  
**Prerequisites:** Internet connection, terminal access

---

## Objectives

By the end of this lab you will:
- Have Node.js and TypeScript installed and verified
- Understand what `tsconfig.json` controls
- Be able to compile TypeScript files from the command line

---

## Part A — Install Node.js

### Step 1: Download and Install

Go to [https://nodejs.org](https://nodejs.org) and download the **LTS** version.

Run the installer (accept all defaults).

### Step 2: Verify Installation

Open a new terminal window and run:

```bash
node --version
npm --version
```

**Expected output (versions may differ):**
```
v20.11.0
10.2.4
```

> If either command is not found, restart your terminal or rerun the installer.

---

## Part B — Install TypeScript

### Global install (quick start)

```bash
npm install -g typescript
tsc --version
```

**Expected output:**
```
Version 5.x.x
```

### Project-level install (recommended for teams)

```bash
mkdir ts-workspace
cd ts-workspace
npm init -y
npm install typescript --save-dev
npx tsc --version
```

Use `npx tsc` instead of `tsc` when working with a local install.

---

## Part C — Create and Explore tsconfig.json

### Generate a default config

Inside `ts-workspace`, run:

```bash
npx tsc --init
```

Open the generated `tsconfig.json`. It will contain many commented options.

### Create a minimal config

Replace the contents of `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Create the source folder

```bash
mkdir src
```

**Option reference table:**

| Option | What it does |
|---|---|
| `target` | Which JS version to output (`ES5`, `ES2020`, `ESNext`) |
| `strict` | Enables all strict type checks (recommended) |
| `outDir` | Where compiled `.js` files are written |
| `rootDir` | Where your `.ts` source files live |
| `sourceMap` | Generates `.map` files for debugging |
| `esModuleInterop` | Allows `import x from 'y'` syntax |

---

## Part D — Your First Compile

### Create a source file

Create `src/hello.ts`:

```typescript
const message: string = "TypeScript is compiling!";
console.log(message);

function add(a: number, b: number): number {
  return a + b;
}

console.log("3 + 4 =", add(3, 4));
```

### Compile the project

```bash
npx tsc
```

### Inspect the output

```bash
ls dist/
cat dist/hello.js
```

**Questions:**
1. What differences do you notice between `src/hello.ts` and `dist/hello.js`?
2. Is there a `dist/hello.js.map` file? What is it for?
3. What happens if you change `target` to `"ES5"` and recompile?

### Run the compiled JavaScript

```bash
node dist/hello.js
```

---

## Part E — Watch Mode

Open two terminal windows side by side.

**Terminal 1 — start the compiler in watch mode:**
```bash
npx tsc --watch
```

**Terminal 2 — edit the source file:**

Add a new line to `src/hello.ts`:
```typescript
console.log("Added while watching!");
```

Save the file. Observe Terminal 1 — it should recompile automatically.

Then run the output:
```bash
node dist/hello.js
```

---

## Part F — Introducing an Error

While watch mode is running, introduce a type error in `src/hello.ts`:

```typescript
// Add this line with a deliberate type error
const count: number = "not a number";
```

**Observe:** Watch mode reports the error immediately without you running any command.

Fix the error (remove or correct the line) and watch it recover.

---

## Challenge Exercise

Configure your project so that:

1. TypeScript outputs to a folder called `build` (not `dist`)
2. Strict mode is **enabled**
3. The target is `ESNext`
4. Source maps are **disabled**

Verify by compiling and checking where the output files appear.

---

## Summary Checklist

- [ ] `node --version` and `npm --version` return a version number
- [ ] `tsc --version` (or `npx tsc --version`) works
- [ ] `tsconfig.json` is configured with `outDir` and `rootDir`
- [ ] `npx tsc` compiles `.ts` files from `src/` to `dist/`
- [ ] `npx tsc --watch` recompiles automatically on save
