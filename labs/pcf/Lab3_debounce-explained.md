# Understanding Debounce

## What is Debounce?

**Debounce** is a programming technique used to limit how often a function is called. When an event fires rapidly (like a user typing), debounce ensures the function only executes **after a specified period of inactivity** — not on every single event.

Think of it like an elevator door: it doesn't close the moment someone steps in. It waits a few seconds to see if anyone else is coming before finally closing.

---

## The Problem It Solves

Without debounce, every keystroke in a text input fires an event. If each event triggers an API call, a state update, or an expensive operation, you end up with:

- 🔴 Hundreds of unnecessary function calls
- 🔴 Poor performance and UI lag
- 🔴 Race conditions from overlapping async operations

---

## How It Works

The core idea is simple:

1. User triggers an event (e.g., types a character)
2. Start a timer (e.g., 400ms)
3. If the event fires **again before the timer ends** → cancel and restart the timer
4. If the timer **completes without interruption** → execute the function

```
User types: "H" → "He" → "Hel" → "Hell" → "Hello"
             ↑      ↑      ↑       ↑        ↑
           reset  reset  reset   reset    [400ms idle] → ✅ fire!
```

---

## Code Walkthrough

The sample code implements a **PCF (Power Apps Component Framework)** text control that uses debounce to avoid notifying the Power Apps framework on every keystroke.

### 1. Declaring the Timer

```typescript
// 🔥 Debounce timer
private _debounceTimer: ReturnType<typeof setTimeout> | null = null;
```

A class-level variable holds a reference to the active timer. `ReturnType<typeof setTimeout>` is used for cross-environment compatibility (works in both browser and Node.js). It starts as `null` — meaning no timer is running yet.

---

### 2. The Debounced Input Handler

```typescript
private _onTextChange(e: Event): void {

  this._currentValue = (e.target as HTMLInputElement).value;

  // Cancel previous timer
  if (this._debounceTimer) {
    clearTimeout(this._debounceTimer);
  }

  // Trigger output after 400ms idle
  this._debounceTimer = setTimeout(() => {
    this._notifyOutputChanged();
  }, 400);
}
```

This is the heart of the debounce pattern:

| Step | What Happens |
|------|-------------|
| User types a character | `_onTextChange` fires immediately |
| `_currentValue` is updated | The latest value is captured right away |
| Previous timer cancelled | `clearTimeout` discards any pending timer |
| New timer started | A fresh 400ms countdown begins |
| User stops typing | Timer completes → `_notifyOutputChanged()` fires once |

> **Key insight:** `_currentValue` is updated on *every* keystroke for accuracy, but `_notifyOutputChanged()` (the expensive call) only fires once after the user pauses.

---

### 3. Attaching the Handler in `init`

```typescript
this._input.addEventListener("input", this._onTextChange.bind(this));
```

The `"input"` event fires on every character change. `.bind(this)` ensures the handler has access to the class instance (and thus `_debounceTimer`, `_currentValue`, etc.).

---

### 4. Preventing Overwrite During Typing

```typescript
public updateView(context: ComponentFramework.Context<IInputs>): void {
  const newValue = context.parameters.sampleProperty.raw || "";

  if (newValue !== this._currentValue) {
    this._currentValue = newValue;
    this._input.value = newValue;
  }
}
```

`updateView` can be called by the framework at any time. The guard `newValue !== this._currentValue` prevents the input from being overwritten while the user is actively typing.

---

### 5. Cleanup in `destroy`

```typescript
public destroy(): void {
  if (this._debounceTimer) {
    clearTimeout(this._debounceTimer);
  }

  this._input.removeEventListener("input", this._onTextChange);
}
```

When the component is removed:

- Any pending timer is cancelled to prevent calling `_notifyOutputChanged` on a destroyed component
- The event listener is removed to avoid memory leaks

---

## Visual Timeline

```
Time (ms):  0   100  200  300  400  500  600  700  800  900 1000
            |    |    |    |    |    |    |    |    |    |    |
Keystrokes: [H] [e]  [l]  [l]  [o]               
Timers:      ←reset→←reset→←reset→←reset→←400ms→
                                                  ✅ notifyOutputChanged()
```

---

## When to Use Debounce

| Use Case | Why Debounce Helps |
|----------|--------------------|
| Search-as-you-type | Avoid an API call on every character |
| Form auto-save | Wait until the user pauses before saving |
| Window resize handler | Avoid layout recalculations on every pixel |
| PCF / Power Apps controls | Avoid flooding the framework with output changes |

---

## Debounce vs Throttle

These two are often confused:

| | Debounce | Throttle |
|---|----------|----------|
| **Fires when?** | After inactivity ends | At a fixed interval |
| **Use when** | You want the *final* value | You want *periodic* updates |
| **Example** | Search input | Scroll position tracker |

---

## Summary

```
Without debounce:  keystroke → notify → keystroke → notify → keystroke → notify
With debounce:     keystroke → keystroke → keystroke → [pause] → notify (once)
```

Debounce is a simple but powerful pattern. In this PCF control, it strikes the right balance: the **UI feels instant** (value updates on every keystroke) while the **framework integration is efficient** (notifications only after the user finishes typing).
