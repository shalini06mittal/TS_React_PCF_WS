# PCF — PowerApps Component Framework
### *A Complete Beginner's Guide*
> From Zero to Your First Component

---

## Table of Contents

- [Chapter 1: What is PCF?](#chapter-1-what-is-pcf)
- [Chapter 2: Why Use PCF?](#chapter-2-why-use-pcf)
- [Chapter 3: Where is PCF Used?](#chapter-3-where-is-pcf-used)
- [Chapter 4: Core Concepts](#chapter-4-core-concepts)
- [Chapter 5: Key Terminology](#chapter-5-key-terminology)
- [Chapter 6: How PCF Works (Architecture)](#chapter-6-how-pcf-works-architecture)
- [Chapter 7: Prerequisites & Tools](#chapter-7-prerequisites--tools)
- [Chapter 8: Setup on Mac — Step by Step](#chapter-8-setup-on-mac--step-by-step)
- [Chapter 9: Setup on Windows — Step by Step](#chapter-9-setup-on-windows--step-by-step)
- [Chapter 10: Creating Your First PCF Component](#chapter-10-creating-your-first-pcf-component)
- [Chapter 11: Add .css (Styling)](#chapter-11-add-css-styling)
- [Chapter 12: Testing & Debugging](#chapter-12-testing--debugging)
- [Chapter 13: Deploying to Power Platform](#chapter-13-deploying-to-power-platform)
- [Chapter 14: Integration](#chapter-14-integration)
- [Chapter 15: Common Errors & Fixes](#chapter-15-common-errors--fixes)
- [Chapter 16: Quick Reference](#chapter-16-quick-reference)
- [Chapter 17: Next Steps](#chapter-17-next-steps)

---

## Chapter 1: What is PCF?

PCF stands for **PowerApps Component Framework**. It is a modern development framework created by Microsoft that allows developers to build custom, reusable UI controls for Microsoft Power Platform applications — including model-driven apps, canvas apps, and Dynamics 365.

Power Platform – A collection of tools that lets you analyze data, build solutions, automate processes and more. Consists of Power BI, Power Apps, Power Automate and Power Virtual Agents.

“Power Apps is a suite of apps, services, and connectors, as well as a data platform, that provides a rapid development environment to build custom apps for your business needs” (Microsoft docs).

You can create three types of Power Apps; Canvas apps, Model driven apps or Portals.

Power App Component framework fit in the bigger picture is a framework to create (code) components that can be used accross apps. You can add a PCF component to model driven apps, canvas apps and portals. You can also add them in Dynamics 365 forms/views.

Think of PCF components as custom-built building blocks. Just like you can use a pre-built button or text input in an app, with PCF you can design and deploy your own specialized controls that look and behave exactly how you want.

Think of PCF components as custom-built building blocks. Just like you can use a pre-built button or text input in an app, with PCF you can design and deploy your own specialized controls that look and behave exactly how you want.

### A Simple Analogy

Imagine Power Platform as a house. Microsoft gives you standard furniture: chairs, tables, beds. But sometimes you need custom furniture — like a special workbench or a built-in bookcase. PCF is the toolkit that lets you build that custom furniture to fit perfectly in the house.

### Why does it exist?

Power Apps targets both low-code makers and professional developers. The built-in controls cover most use cases, but enterprises regularly need:

- **Custom UI** — branded controls that match corporate design systems exactly.
- **Rich visualisations** — charts, graphs, maps, or data grids beyond the standard controls.
- **Specialist input** — signature pads, colour pickers, barcode scanners, rich text editors.
- **Reusability** — build once, deploy across any number of apps and environments.

### What does "framework" mean here?

PCF is a framework in the sense that it provides a **contract**. Microsoft defines the interfaces your code must implement. As long as your component follows that contract, Power Platform handles everything else — hosting, data binding, theming, and accessibility context.

> **⚠️ PCF is not a no-code tool**
>
> PCF requires knowledge of TypeScript, command-line tooling, and Power Platform deployment. It sits in the **pro-developer tier** of the Power Platform stack.

---

## Chapter 2: Why Use PCF?

Power Platform apps are built for business users — they're quick to create but have limited UI customization out-of-the-box. PCF fills this gap by allowing professional developers to extend the platform's capabilities without leaving the Microsoft ecosystem.

### Top Reasons to Use PCF

- **Better User Experience** — Create controls tailored exactly to your business need, like a signature pad, map picker, or advanced date selector.
- **Code with Web Standards** — PCF uses TypeScript, HTML, and CSS — skills you likely already have.
- **Reusable Across Apps** — Build once, deploy to multiple apps and environments.
- **Tight Platform Integration** — Access Dynamics 365 data, user context, and platform APIs natively.
- **Replace Outdated Controls** — Modernize old Dynamics 365 forms without full rewrites.
- **Community & Marketplace** — Thousands of open-source PCF controls available on PCF Gallery.

### When Should You Use PCF?

Use PCF when the built-in controls in Power Apps simply cannot achieve the user experience you need. Common scenarios include:

- You need a barcode scanner or camera capture within a form
- You want a drag-and-drop interface for reordering items
- You need a chart or visualization beyond what's available
- You want a custom input like sliders, toggles, or star ratings
- You need to display rich formatted content (HTML, markdown, PDF viewer)

### PCF vs. Other Options

| **Approach** | **Pros** | **Cons** |
|---|---|---|
| PCF | Native, secure, reusable, platform-integrated | Requires TypeScript/dev skills |
| iFrame/Web Resource | Simpler to embed web content | Limited platform access, security issues |
| Power Apps Formulas | No code needed | Very limited UI customization |
| Plugin | Server-side logic | Not for UI controls |

---

## Chapter 3: Where is PCF Used?

### Supported Platforms

- **Model-Driven Apps** — Full support for both field and dataset controls
- **Canvas Apps** — Field component support (experimental dataset)
- **Dynamics 365 Apps** — Sales, Service, Finance, Supply Chain, etc.
- **Power Pages (Portal)** — Limited support

### Real-World Use Cases

**1. Finance & Banking**
Custom loan calculators, amortization schedule viewers, currency amount sliders with live formatting.

**2. Healthcare**
Patient intake forms with body map selectors, custom appointment calendar pickers, medical image viewers.

**3. Manufacturing / Field Service**
Barcode/QR code scanners, GPS location pickers on maps, signature capture for work order completion.

**4. Retail & E-Commerce**
Product image galleries, star rating controls for reviews, color/size swatch selectors.

**5. HR / Education**
Org chart viewers, skill matrix displays, interactive timeline components.

### Where PCF Cannot Be Used

- Native mobile apps (Power Apps Mobile has limited PCF support)
- Power Automate flows (server-side, no UI)
- Power BI (has its own custom visuals framework)

> **📌 Important Note:** Always check the Microsoft documentation for the latest platform compatibility, as support is expanding with each release.

---

## Chapter 4: Core Concepts

Six ideas you must understand before writing a single line of PCF code. Each one maps directly to something you will see in the project files.

### 1 — The Component Contract

Every PCF component must implement the `ComponentFramework.StandardControl` interface. This interface defines **four methods** that Power Platform will call at specific moments. You write the implementations; Power Platform decides when to call them.

> **💡 Analogy**
>
> Think of it like a job contract. Power Platform is the employer. It will call you at specific times (`init`, `updateView`, `getOutputs`, `destroy`). What you do when it calls is entirely up to you — as long as you show up.

### 2 — Context Object

When Power Platform calls your methods, it passes a `context` object. This is the bridge between your component and the platform. Through context you can read field values, access device capabilities, call web API, retrieve user settings, and more.

### 3 — Properties (Parameters)

Properties are the **inputs and outputs** your component declares in its manifest file. They tell Power Platform what data your component needs (bound field value, configuration options) and what data it produces back (the new field value after the user interacts).

### 4 — The Container Element

Power Platform provides your component with a single `<div>` element called the **container**. You own that container entirely — you can put any HTML inside it. Power Platform handles the surrounding page; you handle what is inside your box.

### 5 — Notify Output Changed

`notifyOutputChanged` is a callback function Power Platform hands to your component at initialisation. When the user changes a value inside your component, you call this function to tell Power Platform: *I have new output, please read it*. Power Platform then calls your `getOutputs()` method to collect the new value.

### 6 — Manifest-Driven Configuration

Everything about your component — its name, version, inputs, outputs, resources — is declared in an XML file called `ControlManifest.Input.xml`. Power Platform reads this manifest at deployment time to understand your component before running any code.

> **🧠 Mental model to carry forward**
>
> PCF is a **host ↔ guest** relationship. Power Platform is the host. Your component is the guest. The host provides a room (the container), utilities (context), and a doorbell (notifyOutputChanged). The guest decorates the room however it likes and rings the bell when something changes.

---

## Chapter 5: Key Terminology

PCF has its own vocabulary. Every term below maps to a concrete object, file, or call in your component project.

| **Term** | **What it means** |
|---|---|
| PCF | Power Apps Component Framework. The entire system for building custom controls for Power Platform. |
| Control | The custom component you build. Also called a *code component* in Microsoft documentation. |
| Field component | A control that replaces the UI for a single column/field on a form. |
| Dataset component | A control that replaces a view, subgrid, or gallery — renders a collection of records. |
| ControlManifest | The XML file that declares everything about your component: name, version, properties, resources. |
| Property | An input or output declared in the manifest. Bound properties link to a real Dataverse column. |
| Bound property | A property whose value comes directly from a Dataverse column in the form's record. |
| Input property | A property whose value is set by the app maker in configuration — read-only for your code. |
| context | The object Power Platform passes to your methods. Contains field values, utilities, and platform APIs. |
| container | The HTML `<div>` element Power Platform gives you to render into. |
| notifyOutputChanged | The callback you call when your component has a new output value to report back. |
| getOutputs() | The method Power Platform calls after notifyOutputChanged to collect your new output values. |
| init() | Called once when the component first loads. You set up your UI here. |
| updateView() | Called every time the field value or context changes. You refresh your UI here. |
| destroy() | Called when the component is removed. You clean up event listeners here. |
| pac cli | Power Platform CLI — the command-line tool used to create, build, test, and deploy PCF projects. |
| pcf-scripts | The npm package that compiles and bundles your TypeScript into something Power Platform can run. |
| Solution | A Power Platform container (ZIP file) that packages your component for deployment to an environment. |
| Publisher | An identity in Power Platform that owns solutions. Used as a prefix on component names. |
| Environment | A Power Platform instance (Dev, Test, Production). You deploy solutions to environments. |
| Managed solution | A locked solution for production — cannot be edited in the target environment. |
| Unmanaged solution | An editable solution, typically used in development environments. |
| Dataverse | The cloud database behind Model-driven apps. Columns in Dataverse tables are what PCF field components bind to. |

### PCF Component Types

- **Field Component** — Replaces a single field in a form (e.g., replace a plain text box with a rich text editor)
- **Dataset Component** — Works with tables/lists of records (e.g., replace a boring grid with a Kanban board)

---

## Chapter 6: How PCF Works (Architecture)

Understanding how PCF works internally helps you build better components and debug issues faster.

### The PCF Lifecycle

Every PCF component implements a TypeScript class with four key lifecycle methods:

#### The Component Lifecycle — Call Order

| **Method / Event** | **When it is called** | **What to do** |
|---|---|---|
| `init()` | Once on first mount | Build the DOM, store context and notifyOutputChanged |
| `updateView()` | On every data or context change | Re-read context.parameters, refresh the UI |
| User interacts | User-driven (click, type, etc.) | Your event handler fires inside your component |
| `notifyOutputChanged()` | You call it after user changes | Signals that new output is ready |
| `getOutputs()` | Platform calls after notifyOutputChanged | Return object with your new output values |
| `destroy()` | When component is removed from form | Remove event listeners, cancel timers/fetches |

### `init()` in detail

**Signature:** `init(context, notifyOutputChanged, state, container)`

| **Parameter** | **Type** | **What to do with it** |
|---|---|---|
| context | `ComponentFramework.Context` | Store it. Read field values from `context.parameters.yourProperty.raw` |
| notifyOutputChanged | `() => void` | Store it. Call it any time the user changes a value in your component. |
| state | `ComponentFramework.Dictionary` | Persistent state bag from the previous session. |
| container | `HTMLDivElement` | The DOM node you own. Append your HTML into this element. |

### `updateView()` in detail

Called whenever: the bound field value changes, any input property changes, or the form context changes (e.g. the record is saved). Your component must re-read `context.parameters` and refresh the UI.

### `getOutputs()` in detail

Returns a plain object whose keys are the names of your bound/output properties and whose values are the new values. You must keep your new value stored somewhere (an instance variable) so this method can read it.

### `destroy()` in detail

Remove any DOM event listeners you attached, cancel any pending timers or network calls, and release references. Memory leaks in PCF components degrade the entire form's performance.

> **⚠️ Common mistake**
>
> Do not build your entire UI inside `updateView()`. That method is called repeatedly. Only **create DOM elements in `init()`** — just update their values in `updateView()`.

---

## Chapter 7: Prerequisites & Tools

### What You Need to Know

- Basic TypeScript or JavaScript (PCF uses TypeScript)
- Basic HTML and CSS
- Command line / Terminal basics
- Basic understanding of Microsoft Power Apps (helpful but not required)

### Software You Will Install

| **Tool** | **Purpose** | **Required?** |
|---|---|---|
| Node.js (LTS) | JavaScript runtime for build tools | Yes |
| npm | Package manager (comes with Node.js) | Yes |
| pac CLI | Power Platform CLI for PCF commands | Yes |
| VS Code | Best IDE for PCF development | Recommended |
| Power Platform Tools (VS Code extension) | IntelliSense & deploy from IDE | Recommended |
| .NET SDK | Required by pac CLI | Yes |
| Git | Version control | Recommended |

### Account Requirements

- A Microsoft 365 account with Power Apps license (or a free Developer Plan)
- Access to a Power Platform environment

> **🆓 Free Developer Plan:** Microsoft offers a free Power Apps Developer Plan at [make.powerapps.com/developerplan](https://make.powerapps.com/developerplan) — perfect for learning PCF without any cost.

---

## Chapter 8: Setup on Mac — Step by Step

> **Mac Requirements:** macOS 10.15 Catalina or later. These steps are tested on macOS Ventura and Sonoma (Apple Silicon and Intel).

### Step 1: Install Homebrew (Package Manager)

Homebrew is the easiest way to install developer tools on a Mac. Open Terminal (Cmd + Space, type 'Terminal').

```bash
# Check if Homebrew is already installed:
brew --version

# If not installed, run this command:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# After install, verify:
brew --version

# Expected output: Homebrew 4.x.x
```

### Step 2: Install Node.js

PCF requires Node.js LTS (Long Term Support) version. Do NOT install the latest/current version.

```bash
# Install Node.js LTS via Homebrew:
brew install node@20

# Add to your PATH (add this to ~/.zshrc or ~/.bash_profile):
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc

# Reload your shell:
source ~/.zshrc

# Verify installation:
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
```

> **Apple Silicon Macs:** On M1/M2/M3 Macs, Homebrew installs to `/opt/homebrew`. On Intel Macs it installs to `/usr/local`. The PATH export above is for Apple Silicon — adjust if needed.

### Step 3: Install .NET SDK

The pac CLI requires .NET SDK to run.

```bash
# Install .NET SDK via Homebrew:
brew install --cask dotnet-sdk

# Verify:
dotnet --version   # Should show 8.x.x or later
```

### Step 4: Install Power Platform CLI (pac)

The pac CLI is the main tool for all PCF operations.

```bash
# Install pac CLI as a .NET global tool:
dotnet tool install --global Microsoft.PowerApps.CLI.Tool

# Add .NET tools to your PATH (add to ~/.zshrc):
export PATH="$PATH:$HOME/.dotnet/tools"

source ~/.zshrc

# Verify pac CLI:
pac --version

# Expected output: Microsoft PowerApps CLI
# Version: 1.x.x
```

### Step 5: Install Visual Studio Code

VS Code is the recommended editor for PCF development.

```bash
# Install via Homebrew Cask:
brew install --cask visual-studio-code

# Open VS Code from Terminal anywhere:
code .

# If 'code' command not found, open VS Code manually,
# press Cmd+Shift+P, type 'Shell Command: Install code in PATH'
```

### Step 6: Install VS Code Extensions

Open VS Code and install these extensions (Cmd+Shift+X to open Extensions panel):

- **Power Platform Tools** — official Microsoft extension
- **ESLint** — code quality
- **Prettier** — code formatting
- **TypeScript + JavaScript** — usually pre-installed

### Step 7: Verify Full Setup on Mac

```bash
# Run all version checks:
node --version    # v20.x.x
npm --version     # 10.x.x
dotnet --version  # 8.x.x
pac --version     # Microsoft PowerApps CLI 1.x.x
code --version    # Code 1.x.x

# If all show version numbers — you are ready!
```

> **Troubleshooting tip:** If `pac` is not found after install, close your terminal and open a new one. If still not found, check that `~/.dotnet/tools` is in your PATH.

---

## Chapter 9: Setup on Windows — Step by Step

> **Windows Requirements:** Windows 10 (version 1903+) or Windows 11. Run PowerShell or Command Prompt as Administrator for all steps.

### Step 1: Install Node.js

Download Node.js LTS from the official website.

- Go to [https://nodejs.org](https://nodejs.org) in your browser
- Click the LTS version button (e.g., 20.x.x LTS)
- Download and run the `.msi` installer
- Accept all defaults — make sure 'Add to PATH' checkbox is checked
- Restart your computer after installation

```powershell
# After restart, open PowerShell and verify:
node --version   # v20.x.x
npm --version    # 10.x.x
```

### Step 2: Install .NET SDK

- Go to [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download)
- Click '.NET 8.0' (LTS) and download the Windows installer
- Run the installer with all defaults

```powershell
# Verify in a new PowerShell window:
dotnet --version   # 8.x.x
```

### Step 3: Install Power Platform CLI (pac)

There are two ways to install pac CLI on Windows — use Option A (recommended):

**Option A: Via .NET Global Tool (Recommended)**

```powershell
# Open PowerShell as Administrator and run:
dotnet tool install --global Microsoft.PowerApps.CLI.Tool

# Verify:
pac --version
```

**Option B: Via Windows Package Manager (winget)**

```powershell
# If you prefer using winget (Windows 10/11):
winget install Microsoft.PowerAppsCLI

# Verify:
pac --version
```

### Step 4: Install Visual Studio Code

- Go to [https://code.visualstudio.com](https://code.visualstudio.com)
- Click 'Download for Windows'
- Run the installer — check 'Add to PATH' and 'Add Open with Code action'
- Restart your machine

```powershell
# Verify in PowerShell:
code --version
```

### Step 5: Install VS Code Extensions

Open VS Code (Win+S, type 'VS Code'). Press Ctrl+Shift+X for Extensions and install:

- **Power Platform Tools**
- **ESLint**
- **Prettier - Code formatter**

### Step 6: Set PowerShell Execution Policy

By default, Windows blocks running scripts. You need to allow it for PCF builds to work.

> **⚠️ Important:** Run PowerShell as Administrator (right-click PowerShell > Run as Administrator) before executing the command below.

```powershell
# Allow running local scripts:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Type Y and press Enter to confirm
```

### Step 7: Verify Full Setup on Windows

```powershell
# Open a fresh PowerShell window and run:
node --version    # v20.x.x
npm --version     # 10.x.x
dotnet --version  # 8.x.x
pac --version     # Microsoft PowerApps CLI 1.x.x
code --version    # 1.x.x

# If all commands show version numbers, you are ready!
```

---

## Chapter 10: Creating Your First PCF Component

We will build a simple **Hello World** component — a text control that displays a greeting message with a customizable name. This teaches you the complete PCF workflow from scratch.

> **Same for Mac & Windows:** From this point forward, all commands work the same on both Mac (Terminal) and Windows (PowerShell). Just open your terminal of choice.

### Step 1: Create Your Project Folder

```bash
# Navigate to where you want your projects:
# Mac:
cd ~/Documents

# Windows:
cd C:\Users\YourName\Documents

# Create and enter a new folder:
mkdir PCFProjects
cd PCFProjects
```

### Step 2: Initialize the PCF Component

The `pac pcf init` command creates the project scaffold for you.

```bash
# Create a new folder for your component:
mkdir HelloWorldControl
cd HelloWorldControl

# Initialize the PCF project:
pac pcf init --namespace MyNamespace --name HelloWorldControl --template field

# Breaking down the flags:
# --namespace   Your company/personal namespace (no spaces, no special chars)
# --name        Your component name (PascalCase, no spaces)
# --template    'field' for single-field controls, 'dataset' for grids/lists
```

You should see output like:

```
PCF project created successfully in current directory.
Don't forget to run 'npm install' to install project dependencies.
```

### PCF File Structure

When you create a new PCF project, this is the folder structure generated:

```
HelloWorldControl/
├── HelloWorldControl/
│   ├── generated/
│   │   └── ManifestTypes.d.ts   ← Tells what inputs, outputs, and properties your control has.
│   ├── index.ts                  ← Your main component code
│   ├── ControlManifest.Input.xml ← Describes properties & inputs
│   ├── css/
│   │   └── HelloWorldControl.css ← Styles
│   └── img/                      ← Images (optional)
├── HelloWorldControl.pcfproj     ← Tells the build system how to compile, package, and treat your control.
├── package.json                  ← Node.js dependencies
├── tsconfig.json                 ← TypeScript config
└── node_modules/                 ← Installed packages (auto-generated)
```

### Step 3: Install Dependencies

```bash
# Install all required npm packages:
npm install

# This downloads TypeScript definitions, PCF types,
# webpack, and other build tools. Takes 1-3 minutes.
# You will see a node_modules/ folder created.
```

### Step 4: Open in VS Code

```bash
# Open the entire folder in VS Code:
code .
```

### Step 5: Understand the Manifest Types File

`ManifestTypes.d.ts` is a TypeScript definition file that gives **strong typing** for your PCF control's manifest (`ControlManifest.Input.xml`). It tells TypeScript what inputs, outputs, and properties your control has.

**Where it comes from:**
- It is auto-generated based on your `ControlManifest.Input.xml`
- Generated during build (`npm run build` or `pac pcf build`)
- You should **not** manually edit it

**What problem it solves:**

Without it:
```typescript
context.parameters.myField.raw
// TypeScript doesn't know what myField is → no IntelliSense, more errors
```

With it:
```typescript
context.parameters.myField.raw
// Fully typed → autocomplete + validation
```

### Step 6: Understand the `.pcfproj` File

It's a .NET-style project file (similar to `.csproj`) used by the Microsoft Power Platform CLI and MSBuild. It defines how your PCF control is built and packaged into a solution.

**Why it exists:** Even though you're writing TypeScript, PCF controls are ultimately packaged into a Dataverse solution using MSBuild and the .NET project system. This file acts as a bridge between your TypeScript code and Power Platform packaging.

**What it contains (key parts):**

```xml
<Project Sdk="Microsoft.PowerApps.MSBuild.PcfControl">
  <PropertyGroup>
    <Name>HelloWorldControl</Name>
    <ProjectGuid>...</ProjectGuid>
  </PropertyGroup>

  <ItemGroup>
    <Manifest Include="ControlManifest.Input.xml" />
  </ItemGroup>
</Project>
```

**Key things inside:**

1. **Project metadata:** `<Name>HelloWorldControl</Name>` — Name of your control
2. **Manifest reference:** `<Manifest Include="ControlManifest.Input.xml" />` — Points to your manifest file
3. **Build SDK:** `Sdk="Microsoft.PowerApps.MSBuild.PcfControl"` — Tells MSBuild: "This is a PCF control project"

**What it is used for:**

During build (`pac pcf build`), this file tells:
- Where your manifest is
- How to package the control
- What to include in output

During solution packaging (`pac solution add-reference --path <pcfproj>`), it links your control to a Dataverse solution.

### Step 7: Understand the ControlManifest File

Open `HelloWorldControl/ControlManifest.Input.xml` — this is where you declare what inputs your component accepts.

Find the `<property>` element and update it to look like this:

```xml
<property name="sampleProperty"
  display-name-key="sampleProperty_Display_Key"
  description-key="sampleProperty_Desc_Key"
  of-type="SingleLine.Text"
  usage="bound"
  required="true" />
```

This declares that your component will accept a text input called `sampleProperty` that is bound to a field in the form.

**Common `of-type` values:**

| **of-type** | **Maps to Dataverse column type** |
|---|---|
| `SingleLine.Text` | Single line of text |
| `Whole.None` | Whole number (integer) |
| `Decimal` | Decimal number |
| `TwoOptions` | Yes/No (boolean) |
| `DateAndTime.DateOnly` | Date only |
| `DateAndTime.DateAndTime` | Date and time |
| `OptionSet` | Choice (single select) |
| `MultiSelectOptionSet` | Choices (multi-select) |
| `Lookup.Simple` | Lookup column |

### Step 8: Write Your Component Code

Open `HelloWorldControl/index.ts`. Either replace the entire contents with the following code or add the **highlighted** sections to understand the code better.

```typescript
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class HelloWorldControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  // Container element that Power Platform gives us  ← highlighted
  private _container: HTMLDivElement;               // ← highlighted

  // The current value from the bound field          ← highlighted
  private _context: ComponentFramework.Context<IInputs>; // ← highlighted

  // The HTML div element                            ← highlighted
  private _greeting: HTMLDivElement;                // ← highlighted

  // ============ LIFECYCLE METHOD 1: init ============
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._container = container;    // ← highlighted
    this._context = context;        // ← highlighted

    this._greeting = document.createElement('div'); // ← highlighted

    // Create a styled greeting element              // ← highlighted
    this._greeting.style.padding = '16px';          // ← highlighted
    this._greeting.style.background = 'linear-gradient(135deg, #667eea, #764ba2)'; // ← highlighted
    this._greeting.style.color = 'white';           // ← highlighted
    this._greeting.style.borderRadius = '8px';      // ← highlighted
    this._greeting.style.fontSize = '20px';         // ← highlighted
    this._greeting.style.fontWeight = 'bold';       // ← highlighted
    this._greeting.style.textAlign = 'center';      // ← highlighted
    this._greeting.innerText = `Hello, Guest! 👋`;  // ← highlighted
    this._container.appendChild(this._greeting);    // ← highlighted
  }

  // ============ LIFECYCLE METHOD 2: updateView ============
  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): void {
    // Get the value from the bound field            // ← highlighted
    const name = context.parameters.sampleProperty.raw || 'World'; // ← highlighted
    this._greeting.innerText = `Hello, ${name}! 👋`; // ← highlighted
  }

  // ============ LIFECYCLE METHOD 3: getOutputs ============
  public getOutputs(): IOutputs {
    // This component is read-only, so no outputs
    return {};
  }

  // ============ LIFECYCLE METHOD 4: destroy ============
  public destroy(): void {
    // Clean up if needed                            // ← highlighted
    this._container.innerHTML = '';                 // ← highlighted
  }
}
```

### Step 9: Build the Component

Compile your TypeScript to JavaScript and check for errors:

```bash
# Build in development mode:
npm run build

# You should see output ending with:
# Webpack 5.x.x compiled successfully in xxxms

# If you see TypeScript errors — check your code against the example above.
```

### Step 10: Test in the Local Harness

PCF provides a local browser-based test harness so you can test your component without deploying to Power Platform.

```bash
# Start the local test server:
npm start watch

# Your browser will open automatically at:
# http://localhost:8181

# You will see your component in a test harness.
# There is an input field on the left panel — type a name in it.
# Your component should update to say 'Hello, [name]!'
```

Press `Ctrl+C` in the terminal to stop the test server when done.

### Step 11: Add More Properties in Manifest

Add below lines in the Manifest file just below the previous `<property>` tag:

```xml
<property name="samplePropertyTextSize"
  display-name-key="samplePropertyTextSize_Display_Key"
  description-key="samplePropertyTextSize_Desc_Key"
  of-type="SingleLine.Text" usage="bound" required="true"
  default-value="20px" />   <!-- ← highlighted -->

<property name="samplePropertyTextColor"
  display-name-key="samplePropertyTextColor_Display_Key"
  description-key="samplePropertyTextColor_Desc_Key"
  of-type="SingleLine.Text"
  usage="input" default-value="red"   <!-- ← highlighted -->
  required="true" />

<property name="samplePropertyTextWeight"
  display-name-key="samplePropertyTextWeight_Display_Key"
  description-key="samplePropertyTextWeight_Desc_Key"
  of-type="SingleLine.Text" usage="bound" required="true" />

<property name="inputText" display-name-key="Input Text"
  description-key="Input from parent" of-type="SingleLine.Text"
  usage="input" default-value="Hello!" />

<property name="outputText" display-name-key="Output Text"
  description-key="Output from control" of-type="SingleLine.Text"
  usage="output" />
```

> As you save the Manifest, `ManifestTypes.d.ts` should be updated with properties. You will notice **ONLY** the properties with `usage="bound"` have both `IInputs` and `IOutputs`. Properties with `usage="input"` have only `IInputs` and `usage="output"` have only `IOutputs`.

Add below instance variables in `index.ts`:

```typescript
private _outputText: string = "";
private _notifyOutputChanged: () => void;
```

Add below in `init()`:

```typescript
this._notifyOutputChanged = notifyOutputChanged;
this._outputText = context.parameters.inputText?.raw ?? "Default";
```

**Update the respective properties to read the defaults:**

```typescript
this._greeting.style.color = this._context.parameters.samplePropertyTextColor.raw ?? 'white';
this._greeting.style.fontSize = this._context.parameters.samplePropertyTextSize.raw ?? '14px';
this._greeting.style.fontWeight = this._context.parameters.samplePropertyTextWeight.raw ?? 'bold';
```

Add below in the `updateView()` method to fetch default values if they exist from the ControlManifest file:

```typescript
this._greeting.style.color = this._context.parameters.samplePropertyTextColor.raw ?? 'white';
this._greeting.style.fontSize = this._context.parameters.samplePropertyTextSize.raw ?? '14px';
this._greeting.style.fontWeight = this._context.parameters.samplePropertyTextWeight.raw ?? 'bold';

const newValue = (context.parameters.inputText?.raw ?? "") + " at " + new Date().toLocaleTimeString();

// Update the output property
this._outputText = newValue;

// Notify app that output has changed
this._notifyOutputChanged();
```

**Update the `getOutputs()` method:**

```typescript
public getOutputs(): IOutputs {
  return { outputText: this._outputText };
}
```

- **`_outputText`** → internal storage for your output.
- **`notifyOutputChanged()`** → tells the app that `getOutputs()` has a new value.
- **`getOutputs()`** → returns the actual value to the app.

### Behavior in Test Harness

- The Test Harness shows an **"Output" section** for your output properties.
- When you click **"Run"**, your control updates the output via `notifyOutputChanged()`.
- You can **see the output value update live** in the harness.

**Example:**

| **Input Text** | **Output Text (shown in harness)** |
|---|---|
| Hello | Hello at 10:15:30 AM |
| PCF Test | PCF Test at 10:16:05 AM |

### Behavior in Model-Driven App / Canvas App

- **Bound properties** → update the data in the app automatically.
- **Output properties** → the app **reads the value you provide** via `getOutputs()`.

**Example usage in Canvas App:**
- You have a PCF control on a form.
- `outputText` is mapped to a field or variable in the app.
- When the user interacts with your PCF control, the control sets the output, which **automatically updates the mapped field/variable**.

### Property Usage Types

| **Usage Type** | **Meaning / Typical Scenario** | **Can default-value be used?** | **Controlled by parent** | **Can the control modify it?** |
|---|---|---|---|---|
| `bound` | Bound to a field in a model-driven or canvas app | Yes, default value sets initial value if field is empty | Bound to a field in app | Control can modify it, and changes propagate to app field |
| `input` | Passed from parent / app to the component (unbound) | Yes, default-value works as fallback if parent does not provide a value | Parent app provides it | Should not modify directly; it's read-only from the control's perspective |
| `output` | Used to send data from component to app | Not applicable; output doesn't have a manifest default | App sees it | Control sets this |

```
┌───────────────────────────────┐
│         Parent App            │
│  (Canvas / Model-Driven App)  │
└─────────────┬─────────────────┘
              │
      Passes value to control
              │
    ┌─────────┴─────────┐
    │                   │
Input (usage="input")  Bound (usage="bound")
    │                   │
    ▼                   ▼
┌───────────┐     ┌───────────┐
│ Read-only │     │Read+Write │
│ Cannot    │     │Can update │
│push back  │     │ app field │
└───────────┘     └───────────┘
```

### Understand Context Object

`context` = everything your control needs to know about the app, data, and environment.

It is passed into:
```typescript
init(context, ...)
updateView(context)
```

**Most important sections:**

**`context.parameters` (MOST USED)** — Gives data from your manifest properties

```typescript
const name = context.parameters.sampleProperty.raw;
```

Contains:
- `.raw` → actual value
- `.formatted` → display value
- `.attributes` → metadata

```typescript
context.parameters.rating.raw        // 4
context.parameters.rating.formatted  // "4"
```

**`context.mode`** — Tells you about control state

```typescript
context.mode.isControlDisabled
context.mode.isVisible
```
Use cases: Disable input, Show read-only UI

**`context.userSettings`** — Info about current user

```typescript
context.userSettings.userName
context.userSettings.languageId
```

**`context.client`** — Info about device & client

```typescript
context.client.getClient()      // Web, Mobile
context.client.getFormFactor()  // Tablet, Phone
```

**`context.resources`** — Access localization & resources

```typescript
context.resources.getString("My_Label_Key")
```

**`context.navigation`** — Open dialogs, navigate

```typescript
context.navigation.openAlertDialog({ text: "Hello!" });
```

**`context.webAPI` (powerful)** — Call Dataverse APIs

```typescript
context.webAPI.retrieveRecord("account", id, "?$select=name");
```

**`context.formatting`** — Format values

```typescript
context.formatting.formatCurrency(1000, "USD");
```

**`context.updatedProperties`** — Tells what changed (advanced optimization)

---

## Chapter 11: Add .css (Styling)

To apply custom external styles, follow these steps:

### Step 1: Create CSS file

Create a `css` folder within the `HelloWorldControl` folder and add `HelloWorldControl.css`. Folder structure:

```
HelloWorldControl/
└── HelloWorldControl/
    └── css/
        └── HelloWorldControl.css
```

Add the following to the `.css` file:

```css
.glow {
  -webkit-animation: glow 1s ease-in-out infinite alternate;
  -moz-animation: glow 1s ease-in-out infinite alternate;
  animation: glow 1s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073,
                 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
  }
  to {
    text-shadow: 0 0 20px #fff, 0 0 30px #4d68ff, 0 0 40px #ff4da6,
                 0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
  }
}
```

### Step 2: Modify the ControlManifest file to include the CSS file

Search for the `<resources>` tag and add the **highlighted** line:

```xml
<resources>
  <code path="index.ts" order="1"/>
  <css path="css/HelloWorldControl.css" order="1" />  <!-- ← highlighted -->
  <!-- UNCOMMENT TO ADD MORE RESOURCES
  <resx path="strings/HelloWorldControl.1033.resx" version="1.0.0" />
  -->
</resources>
```

### Step 3: Add style to your control

Add the following line just before calling `appendChild()`:

```typescript
this._greeting.classList.add('glow');
```

### Step 4: Test

> **⚠️ STOP THE SERVER: Hit `CTRL+C`**

```bash
# Restart — whenever the folder structure changes, need to restart:
npm run build

# Now start again:
npm start watch
# Text should now be glowing!  ← highlighted
```

---

## Chapter 12: Testing & Debugging

### Local Test Harness

The `npm start watch` command opens a test harness **at localhost:8181**. This harness simulates the Power Apps environment and lets you:

- Set values for your component's input properties
- See real-time updates as you change the value
- Test resize behavior by dragging the component border
- Toggle dark mode, RTL (right-to-left), and other settings

### Debugging with Browser DevTools

While the harness is running, press `F12` in your browser to open DevTools:

- **Console tab** — See any JavaScript errors or `console.log()` output
- **Sources tab** — Set breakpoints in your TypeScript (source maps are enabled)
- **Elements tab** — Inspect the HTML your component renders

### Useful Debug Tips

- Add `console.log(context.parameters.sampleProperty.raw)` in `updateView` to see incoming values
- Use `context.mode.isControlDisabled` to check if the control is read-only
- Use `context.userSettings.userName` to get the current user's name

---

## Chapter 13: Deploying to Power Platform

### Step 1: Create a Solution Project

PCF components are deployed as part of a Power Platform solution.

```bash
# Go back to your PCFProjects folder:
cd ..

# Create a solution project:
pac solution init --publisher-name MyPublisher --publisher-prefix mypub

# Add your PCF control to the solution:
pac solution add-reference --path HelloWorldControl
```

### Step 2: Build the Solution

```bash
# Build the full solution (creates a .zip file):
msbuild /t:build /restore

# On Mac, if msbuild is not found, use dotnet build:
dotnet build

# The solution .zip will appear in:
# bin/Debug/ or bin/Release/
```

> You may choose to import the Solution zip directly within your Power Apps environment as well. Then no need to follow Steps 3 and 4.

### Step 3: Connect to Your Environment

```bash
# Authenticate with your Power Platform tenant:
pac auth create --url https://yourorg.crm.dynamics.com

# This opens a browser window for Microsoft login.
# After login, you'll see: Connected as user@yourorg.com
```

### Step 4: Push Directly (For Development)

During development, you can push changes directly without building a full solution:

```bash
# Push component directly to your environment:
pac pcf push --publisher-prefix mypub

# This is the fastest way to test in a real environment.
# Note: Only works with 'pac auth create' done first.
```

---

## Chapter 14: Integration

### Accessing in a Model-Driven App

Once deployed, you configure a PCF field component through the form editor in Power Apps. No code required — it is entirely point-and-click.

Model-driven apps are tightly coupled to Dataverse. Your PCF field component replaces the default control for a specific column on a form. The column's data type must match the `of-type` you declared in the manifest.

**1. Open the form in the form editor**

Navigate to `make.powerapps.com` → Tables → [Your Table] → Forms. Open the form you want to add the component to. The modern form editor opens.

**2. Select the column you want to customise**

Click the column on the form canvas. The right panel shows the column's properties.

**3. Open Components for that column**

In the right-hand properties panel, scroll down and click **"+ Component"**. A dialog lists all available components compatible with this column's data type.

**4. Find and add your PCF component**

Your deployed component appears in the list under your publisher name. Select it and click **Add**. If you declared any input properties in the manifest, they now appear as configurable fields in the panel.

**5. Save and publish**

Click **Save** then **Publish** in the form editor toolbar. Open a record in the model-driven app — your PCF component is now rendering in place of the default control.

> **💡 One component, multiple forms**
>
> You can add the same PCF component to as many forms and tables as you like, as long as the column's data type matches the manifest's `of-type`. Each instance can have its own input property values.

> **📌 Also available in views**
>
> PCF components can also be applied to view columns (not just forms). In the view editor, select a column, click the component selector, and apply your PCF component there too — it renders inside the list view grid.

### Accessing in a Canvas App

Canvas apps require a separate step to enable PCF components — they are not on by default.

**Step 1 — Enable code components for the environment**

1. Navigate to the **Power Platform Admin Centre**

   Go to `admin.powerplatform.microsoft.com` → Environments → [Your Environment] → Settings → Features.

2. **Enable the canvas setting**

   Toggle on "Power Apps component framework for canvas apps" and save. This is a one-time step per environment.

**Step 2 — Add the component to a canvas app**

3. **Open your canvas app in Power Apps Studio**

   Navigate to `make.powerapps.com` → Apps → [Your App] → Edit.

4. **Import the component**

   In the left panel, click `+Insert` → Custom → Import components. Switch to the **Code** tab. Tick the checkbox next to your component and click **Import**.

5. **Insert the component onto the screen**

   After importing, go to `+Insert` → Code components. Click your component to place it on the screen. Resize and position it freely.

6. **Bind properties in the formula bar**

   Select the component on the canvas. Set the `value` property in the formula bar.

---

## Chapter 15: Common Errors & Fixes

| **Error** | **Cause** | **Fix** |
|---|---|---|
| `'pac' is not recognized` | pac CLI not in PATH | Restart terminal; re-add `~/.dotnet/tools` to PATH |
| `npm install` fails with EACCES | Permission issue on Mac | Run: `sudo chown -R $USER ~/.npm` |
| Cannot find module `'./generated/ManifestTypes'` | Build not run yet | Run `npm run build` first |
| `localhost:8181` blank page | Build errors present | Check terminal for TypeScript errors |
| PowerShell script blocked | Execution policy | Run `Set-ExecutionPolicy RemoteSigned` |
| `msbuild` not found on Mac | .NET build tools missing | Use `dotnet build` instead of `msbuild` |
| `pac pcf push` fails 401 error | Not authenticated | Run `pac auth create` first |
| Component not in Add Control list | Not deployed yet | Run `pac pcf push`, wait 5 min, refresh |

---

## Chapter 16: Quick Reference

| **Concept** | **Key point** |
|---|---|
| PCF stands for | Power Apps Component Framework |
| Two component types | Field (replaces a column control) · Dataset (replaces a view/subgrid) |
| 4 lifecycle methods | `init()` · `updateView()` · `getOutputs()` · `destroy()` |
| Create project | `pac pcf init --namespace X --name Y --template field` |
| Start test harness | `npm start watch` |
| Build for production | `npm run build` |
| Quick deploy (dev) | `pac pcf push --publisher-prefix myco` |
| Manifest file | `ControlManifest.Input.xml` — declares all properties and resources |
| Property usage: bound | Reads from and writes to a Dataverse column |
| Property usage: input | Read-only configuration set by the maker |
| context object | Passed into init/updateView — access field values via `context.parameters.propName.raw` |
| notifyOutputChanged | Call this when user changes a value — triggers `getOutputs()` |
| Model-driven usage | Form editor → select column → + Component → choose your PCF control |
| Canvas usage | Admin enables PCF → Insert → Custom → Import components → Code tab → use in formula bar |
| Solution for ALM | `pac solution init` + `add-reference` + `dotnet build` → import ZIP to environments |

### Model-Driven App vs Canvas App Comparison

| **Aspect** | **Model-Driven App** | **Canvas App** |
|---|---|---|
| Data binding | Automatic via column binding | Manual via Power Fx formula |
| Positioning | Fixed to form column layout | Free — drag anywhere on screen |
| Enable PCF | No extra setup needed | Admin must enable in environment settings |
| Import step | Not needed — use from form editor | Must import via Insert → Code components |
| Read output | Automatic on save | Reference `component.propertyName` in formula |
| Context object | Rich — includes full Dataverse context | Subset — canvas context is more limited |

---

## Chapter 17: Next Steps

### Learn More PCF Concepts

- **Context API** — Access user settings, formatting, device info
- **WebAPI** — Query and update Dataverse records from your component
- **Popups & Navigation** — Trigger record opens, dialogs, page navigation
- **Virtual Controls** — React/Angular-based components (PCF Virtual Controls)
- **Dataset Components** — Build advanced grid/list replacements

### Recommended Resources

- **Microsoft Learn:** [aka.ms/LearnPCF](https://aka.ms/LearnPCF) — Free official learning path
- **PCF Gallery:** [pcf.gallery](https://pcf.gallery) — Browse 500+ open source PCF controls
- **GitHub:** [microsoft/PowerApps-Samples/component-framework](https://github.com/microsoft/PowerApps-Samples) — Official samples
- **YouTube:** Power CAT Community channel — PCF video tutorials
- **Blog:** [powerapps.microsoft.com/blog](https://powerapps.microsoft.com/blog) — Official announcements

### Practice Projects (Increasing Difficulty)

- **Color Picker** — Input a hex color, display a colored swatch
- **Character Counter** — Count remaining characters with a progress bar
- **Star Rating** — Clickable 1-5 star rating control
- **Signature Pad** — Draw and save a signature as base64
- **Barcode Scanner** — Use the device camera to scan barcodes
- **Kanban Board** — Dataset control for drag-and-drop card management

### Join the Community

- **Power Apps Community Forum:** [powerusers.microsoft.com](https://powerusers.microsoft.com)
- **Twitter/X:** #PowerApps #PCF hashtags
- **LinkedIn:** Power Platform Community groups
- **Discord:** Power Platform Community Discord server

---

**Happy Building! 🚀**

*You are now a PCF developer.*
