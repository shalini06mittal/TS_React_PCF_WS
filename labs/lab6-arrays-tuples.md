# Lab 3 — Arrays & Tuples

**Estimated time:** 30–40 minutes  
**Prerequisites:** Labs 1 & 2 completed

---

## Objectives

- Declare typed arrays using both `number[]` and `Array<T>` syntax
- Use `readonly` arrays to prevent mutation
- Work with multi-dimensional and object arrays
- Define and destructure tuples with mixed types
- Apply named tuples and optional/rest tuple elements

---

## Setup

Continue in your existing project or:

```bash
mkdir arrays-tuples && cd arrays-tuples
npm init -y && npm install typescript --save-dev
npx tsc --init && mkdir src
```

---

## Part A — Typed Arrays: number[] Syntax

Create `src/arrays-basic.ts`:

```typescript
// ── Declaring typed arrays ────────────────────────────────────
let scores: number[] = [88, 92, 75, 96, 84];
let names: string[] = ["Alice", "Bob", "Carol"];
let flags: boolean[] = [true, false, true, true];

// ── TypeScript enforces element types ────────────────────────
scores.push(100);         // ✓
// scores.push("A+");     // ✗ Uncomment to see error

names.push("Dave");       // ✓
// names.push(42);        // ✗ Uncomment to see error

// ── Common array operations ───────────────────────────────────
console.log("Scores:", scores);
console.log("Average:", scores.reduce((a, b) => a + b, 0) / scores.length);
console.log("Max:", Math.max(...scores));
console.log("Min:", Math.min(...scores));
console.log("Sorted:", [...scores].sort((a, b) => a - b));

// ── Filtering and transforming ────────────────────────────────
const passing: number[] = scores.filter(s => s >= 80);
const grades: string[] = scores.map(s => s >= 90 ? "A" : s >= 80 ? "B" : "C");

console.log("Passing:", passing);
console.log("Grades:", grades);

// ── Type inference with arrays ────────────────────────────────
const inferred = [1, 2, 3];         // TypeScript infers: number[]
const mixed = [1, "two", true];     // TypeScript infers: (number | string | boolean)[]

console.log("Names:", names);
```

Compile and run:
```bash
npx tsc && node dist/arrays-basic.js
```

---

## Part B — Array<T> Generic Syntax

Create `src/arrays-generic.ts`:

```typescript
// Both syntaxes are equivalent — pick one and be consistent
let nums1: number[] = [1, 2, 3];
let nums2: Array<number> = [1, 2, 3];

// ── Generic syntax shines with complex types ──────────────────
interface Student {
  name: string;
  score: number;
}

// Array<T> reads more naturally with object types
let students: Array<Student> = [
  { name: "Alice", score: 92 },
  { name: "Bob",   score: 78 },
  { name: "Carol", score: 85 },
];

// ── Union type arrays ─────────────────────────────────────────
let ids: Array<string | number> = ["A1", 2, "B3", 4];

// ── Nested generic arrays ─────────────────────────────────────
let matrix: Array<Array<number>> = [
  [1, 2, 3],
  [4, 5, 6],
];

// ── Array methods with typed callbacks ───────────────────────
const topStudents: Array<Student> = students.filter(s => s.score >= 85);
const justNames: Array<string> = students.map(s => s.name);
const total: number = students.reduce((sum, s) => sum + s.score, 0);
const average: number = total / students.length;

console.log("Students:", students);
console.log("Top students:", topStudents);
console.log("Names:", justNames);
console.log(`Average score: ${average.toFixed(1)}`);

// ── Find and some/every ───────────────────────────────────────
const alice = students.find(s => s.name === "Alice");
const allPassing = students.every(s => s.score >= 60);
const anyA = students.some(s => s.score >= 90);

console.log("Alice:", alice);
console.log("All passing:", allPassing);
console.log("Any A grade:", anyA);
```

Compile and run:
```bash
npx tsc && node dist/arrays-generic.js
```

**Exercise:** Add a function `topN(students: Array<Student>, n: number): Array<Student>` that returns the top `n` students by score. Annotate all types explicitly.

---

## Part C — Readonly Arrays

Create `src/readonly-arrays.ts`:

```typescript
// readonly prevents mutation after creation
const SEASONS: readonly string[] = ["Spring", "Summer", "Autumn", "Winter"];

console.log("Seasons:", SEASONS);
console.log("First:", SEASONS[0]);

// These are all compile errors — uncomment to verify:
// SEASONS.push("Extra");      // ✗ push does not exist on readonly
// SEASONS.pop();              // ✗
// SEASONS[0] = "Rainy";       // ✗

// ── Alternative syntax ────────────────────────────────────────
const PRIMES: ReadonlyArray<number> = [2, 3, 5, 7, 11, 13];
console.log("Primes:", PRIMES);

// ── Readonly in function parameters ──────────────────────────
function sum(nums: readonly number[]): number {
  return nums.reduce((a, b) => a + b, 0);
  // nums.push(0);  // ✗ Error: cannot mutate a readonly parameter
}

console.log("Sum:", sum([1, 2, 3, 4, 5]));

// ── Creating modified copies (spread) ────────────────────────
const morePrimes: number[] = [...PRIMES, 17, 19];
console.log("More primes:", morePrimes);

// ── Readonly object arrays ────────────────────────────────────
interface Config {
  key: string;
  value: string;
}

const DEFAULTS: readonly Config[] = [
  { key: "theme", value: "dark" },
  { key: "lang",  value: "en" },
];

// Can read
console.log("Theme:", DEFAULTS.find(c => c.key === "theme")?.value);
// Cannot push/pop, but object properties themselves are still mutable
// (For deep immutability use Readonly<Config>)
```

Compile and run:
```bash
npx tsc && node dist/readonly-arrays.js
```

**Questions:**
1. What is the difference between `readonly string[]` and `ReadonlyArray<string>`?
2. If you have `readonly Config[]`, can you still do `DEFAULTS[0].value = "light"`? Why?

---

## Part D — Multi-dimensional Arrays

Create `src/multi-dim.ts`:

```typescript
// 2D matrix of numbers
let board: number[][] = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

// Place a value
board[1][1] = 1;  // center

function printBoard(b: number[][]): void {
  b.forEach(row => console.log(row.join(" | ")));
}
printBoard(board);

// ── Tic-tac-toe grid ──────────────────────────────────────────
type Cell = "X" | "O" | null;
type Grid = Cell[][];

const grid: Grid = [
  ["X", null, "O"],
  [null, "X",  null],
  ["O", null, "X"],
];

function checkWinner(g: Grid): Cell {
  // Check diagonals only (simplified)
  if (g[0][0] && g[0][0] === g[1][1] && g[1][1] === g[2][2]) {
    return g[0][0];
  }
  return null;
}

console.log("Winner:", checkWinner(grid)); // X

// ── Array of typed objects ─────────────────────────────────────
interface Point { x: number; y: number; }

const polygon: Point[] = [
  { x: 0, y: 0 },
  { x: 4, y: 0 },
  { x: 4, y: 3 },
  { x: 0, y: 3 },
];

function perimeter(pts: Point[]): number {
  return pts.reduce((total, pt, i) => {
    const next = pts[(i + 1) % pts.length];
    const dx = next.x - pt.x;
    const dy = next.y - pt.y;
    return total + Math.sqrt(dx * dx + dy * dy);
  }, 0);
}

console.log("Perimeter:", perimeter(polygon)); // 14
```

Compile and run:
```bash
npx tsc && node dist/multi-dim.js
```

---

## Part E — Tuples

Create `src/tuples.ts`:

```typescript
// ── Basic tuple ───────────────────────────────────────────────
let point: [number, number] = [10, 20];
console.log(`Point: (${point[0]}, ${point[1]})`);

// Destructuring
const [x, y] = point;
console.log(`x=${x}, y=${y}`);

// ── Named tuples (TypeScript 4.0+) ───────────────────────────
let coord: [lat: number, lon: number] = [19.076, 72.877]; // Mumbai
const [lat, lon] = coord;
console.log(`Mumbai: ${lat}°N, ${lon}°E`);

// ── Mixed-type tuple ──────────────────────────────────────────
type Employee = [id: number, name: string, isActive: boolean];
const emp: Employee = [1, "Alice", true];
const [id, name, active] = emp;
console.log(`Employee ${id}: ${name} (${active ? "active" : "inactive"})`);

// ── Optional tuple element ────────────────────────────────────
type PersonWithNickname = [string, number, string?];
const person1: PersonWithNickname = ["Bob", 25, "Bobby"];
const person2: PersonWithNickname = ["Carol", 30];   // no nickname

console.log(`${person1[0]} (${person1[2] ?? "no nickname"})`);
console.log(`${person2[0]} (${person2[2] ?? "no nickname"})`);

// ── Rest element in tuple ─────────────────────────────────────
type StudentRecord = [name: string, ...scores: number[]];

const record1: StudentRecord = ["Alice", 92, 88, 95, 91];
const record2: StudentRecord = ["Bob", 75, 80];

function average([, ...scores]: StudentRecord): number {
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

console.log(`Alice avg: ${average(record1).toFixed(1)}`);
console.log(`Bob avg:   ${average(record2).toFixed(1)}`);

// ── Readonly tuple ────────────────────────────────────────────
const RGB: readonly [number, number, number] = [255, 128, 0];
// RGB[0] = 0;  // ✗ Error
console.log(`RGB: rgb(${RGB.join(",")})`);
```

Compile and run:
```bash
npx tsc && node dist/tuples.js
```

---

## Part F — Real-world Tuple Patterns

Create `src/tuple-patterns.ts`:

```typescript
// ── useState-style return type ────────────────────────────────
function createToggle(initial: boolean): [boolean, () => void] {
  let state = initial;
  const toggle = () => { state = !state; };
  return [state, toggle];
}

const [isOpen, toggle] = createToggle(false);
console.log("isOpen:", isOpen);   // false
toggle();
// (state updates are internal — for demo purposes)
console.log("toggled!");

// ── CSV row type ──────────────────────────────────────────────
type CsvRow = [date: string, product: string, quantity: number, price: number];

const salesData: CsvRow[] = [
  ["2024-01-15", "Widget A", 100, 9.99],
  ["2024-01-16", "Widget B",  50, 24.99],
  ["2024-01-17", "Widget A",  75, 9.99],
];

function totalRevenue(rows: CsvRow[]): number {
  return rows.reduce((sum, [, , qty, price]) => sum + qty * price, 0);
}

console.log(`Total revenue: $${totalRevenue(salesData).toFixed(2)}`);

// ── Key-value pair ────────────────────────────────────────────
type KV<K, V> = [key: K, value: V];

const settings: KV<string, string>[] = [
  ["theme", "dark"],
  ["locale", "en-IN"],
  ["timezone", "Asia/Kolkata"],
];

function toObject<K extends string, V>(pairs: KV<K, V>[]): Record<K, V> {
  return Object.fromEntries(pairs) as Record<K, V>;
}

console.log("Settings:", toObject(settings));

// ── HTTP response tuple ───────────────────────────────────────
type HttpResponse<T> = [statusCode: number, body: T, headers?: Record<string, string>];

function ok<T>(data: T): HttpResponse<T> {
  return [200, data, { "Content-Type": "application/json" }];
}

function notFound(): HttpResponse<{ error: string }> {
  return [404, { error: "Not found" }];
}

const [status, body] = ok({ name: "Alice" });
console.log(`Status: ${status}, Body:`, body);
```

Compile and run:
```bash
npx tsc && node dist/tuple-patterns.js
```

---

## Challenge Exercise

Build a typed `Stack<T>` using a tuple pair `[items: T[], size: number]`:

1. `createStack<T>(): [T[], number]` — returns an empty stack tuple
2. `push<T>(stack: [T[], number], item: T): [T[], number]` — returns a new stack with item added
3. `pop<T>(stack: [T[], number]): [[T[], number], T | undefined]` — returns `[newStack, poppedItem]`
4. Test with a stack of numbers: push 1, 2, 3 then pop twice

All functions must have explicit generic type parameters and tuple return types.

---

## Summary Checklist

- [ ] Declared arrays with `number[]` shorthand syntax
- [ ] Declared arrays with `Array<T>` generic syntax
- [ ] Observed TypeScript prevent pushing wrong element types
- [ ] Created `readonly` arrays and verified mutation is blocked
- [ ] Worked with multi-dimensional `number[][]` arrays
- [ ] Created arrays of typed objects using an `interface`
- [ ] Declared basic tuples with `[string, number]` syntax
- [ ] Used named tuple elements (`[name: string, age: number]`)
- [ ] Used optional `?` and rest `...` elements in tuples
- [ ] Destructured tuples in function parameters
- [ ] Returned tuples from functions (useState-style pattern)
