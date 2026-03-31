**Power Apps Component Framework (PCF)**

**Building a Star Rating Control with React**

*Complete Lab Guide*

## Table of Contents

- [Lab Overview](#lab-overview)
- [Prerequisites](#prerequisites)
- [Understanding PCF-React Integration](#understanding-pcf-react-integration)
- [Architecture Overview](#architecture-overview)
- [Data Flow: Platform → PCF → React → PCF → Platform](#data-flow-platform--pcf--react--pcf--platform)
- [Lab Setup](#lab-setup)
  - [Step 1: Create the PCF Project](#step-1-create-the-pcf-project)
  - [Step 2: Install React and Fluent UI Dependencies](#step-2-install-react-and-fluent-ui-dependencies)
  - [Step 3: Configure the Control Manifest](#step-3-configure-the-control-manifest)
- [Exercise 1: Basic Star Rating Display](#exercise-1-basic-star-rating-display)
  - [Step 1: Create the Star Rating React Component](#step-1-create-the-star-rating-react-component)
  - [Step 2: Integrate React with PCF Lifecycle](#step-2-integrate-react-with-pcf-lifecycle)
  - [Step 3: Build and Test](#step-3-build-and-test)
- [Exercise 2: User Clicks and Data Output](#exercise-2-user-clicks-and-data-output)
  - [Step 1: Add Click Handling to React Component](#step-1-add-click-handling-to-react-component)
  - [Step 2: Update PCF to Handle Output](#step-2-update-pcf-to-handle-output)
  - [Step 3: Test the Interaction](#step-3-test-the-interaction)
- [Exercise 3: Adding Hover Effects](#exercise-3-adding-hover-effects)
  - [Step 1: Add Hover State to React Component](#step-1-add-hover-state-to-react-component)
  - [Step 2: Test Hover Effects](#step-2-test-hover-effects)

## Lab Overview

In this comprehensive lab, you will learn how to integrate React with the Power Apps Component Framework (PCF) by building a Star Rating control from scratch. This lab covers the complete lifecycle of PCF-React integration, data flow between PCF and React components, and implementing interactive features with Fluent UI.

What You\'ll Build

A fully functional Star Rating control that:

-   Displays 5 stars with the current rating highlighted

-   Receives input from Dataverse through PCF lifecycle methods

-   Sends user selections back to Dataverse via PCF output methods

-   Implements hover effects for better user experience

-   Uses Fluent UI v8 (compatible with Dynamics 365)

## Prerequisites

-   Node.js (v14 or higher) installed

-   Power Platform CLI (pac) installed

-   Basic knowledge of TypeScript and React

-   Code editor (VS Code recommended)

-   Access to a Power Apps environment

## Understanding PCF-React Integration

Before we start coding, it\'s essential to understand how React integrates with PCF and when each lifecycle method is called.

## Architecture Overview

PCF controls follow a specific architecture where the PCF lifecycle methods act as a bridge between the Power Apps platform and your React components:

  --------------------------- ----------------------------------------------------------------------------------
  **Layer**                   **Responsibility**

  **Power Apps Platform**     Hosts the control, manages data binding, triggers lifecycle methods

  **PCF Lifecycle Methods**   Bridge between platform and React: init(), updateView(), getOutputs(), destroy()

  **React Components**        Render UI, handle user interactions, manage component state
  --------------------------- ----------------------------------------------------------------------------------

PCF Lifecycle Methods and When They\'re Called

1\. init() - Initialization

**Called:** Once when the control is first loaded on a form or screen.

**Purpose:** Initialize your React app, set up the container, create initial state.

**What happens in React integration:** This is where you call ReactDOM.render() to mount your React component tree into the PCF container element.

2\. updateView() - Data Refresh

**Called:** Whenever the platform detects a change in bound data (e.g., when a user changes the rating value, or when the form loads with existing data).

**Purpose:** Receive updated data from the platform and pass it to your React components.

**What happens in React integration:** You call ReactDOM.render() again with updated props based on the new context data. React\'s reconciliation handles efficient re-rendering.

3\. getOutputs() - Send Data Back

**Called:** When the platform needs to retrieve the current value from your control (typically after a user interaction that you notify via notifyOutputChanged()).

**Purpose:** Return the current value that should be saved to Dataverse.

**What happens in React integration:** You maintain the current value in a class variable (updated by React callbacks), and return it when the platform calls this method.

4\. destroy() - Cleanup

**Called:** When the control is removed from the DOM (form closed, navigation away, etc.).

**Purpose:** Clean up resources, unmount React components.

**What happens in React integration:** Call ReactDOM.unmountComponentAtNode() to properly clean up the React component tree.

## Data Flow: Platform → PCF → React → PCF → Platform

Understanding the complete data flow is critical for building PCF controls with React:

1.  **Platform → init():** Platform initializes control with initial data

2.  **init() → React:** PCF renders React component with initial props

3.  **Platform → updateView():** Platform sends updated data when bound field changes

4.  **updateView() → React:** PCF re-renders React with new props

5.  **User clicks star → React:** React component handles click event

6.  **React → PCF callback:** React calls onChange prop (passed from PCF)

7.  **PCF → notifyOutputChanged():** PCF tells platform data has changed

8.  **Platform → getOutputs():** Platform requests current value

9.  **getOutputs() → Platform:** PCF returns value to save to Dataverse

## Lab Setup

### Step 1: Create the PCF Project

First, we\'ll create a new PCF project using the Power Platform CLI.

**Open your terminal and run:**

mkdir StarRatingControl

cd StarRatingControl

pac pcf init \--namespace Contoso \--name StarRating \--template field

**What this does:**

-   **\--namespace Contoso:** Your publisher namespace

-   **\--name StarRating:** The control name

-   **\--template field:** Creates a field control (binds to a single data field)

### Step 2: Install React and Fluent UI Dependencies

Now we\'ll install React, ReactDOM, and Fluent UI v8 (the version compatible with Dynamics 365).

**Run the following command:**

npm install react react-dom \@fluentui/react@8.110.10 \--save

**Install TypeScript type definitions:**

npm install \@types/react \@types/react-dom \--save-dev

**Important Note on Fluent UI Versions:**

-   **Fluent UI v9 is NOT supported** in Power Apps / Dynamics 365

-   Always use **\@fluentui/react@8.x** for compatibility

-   Version 8.110.10 is tested and stable

### Step 3: Configure the Control Manifest

Open ControlManifest.Input.xml and update it to define our rating property:

\<?xml version=\"1.0\" encoding=\"utf-8\" ?\>

\<manifest\>

\<control namespace=\"Contoso\" constructor=\"StarRating\"

version=\"1.0.0\" display-name-key=\"StarRating\"

description-key=\"Star Rating Control\"\>

\<property name=\"rating\" display-name-key=\"Rating\"

description-key=\"Current rating value\"

of-type=\"Whole.None\" usage=\"bound\" required=\"true\" /\>

\<resources\>

\<code path=\"index.ts\" order=\"1\"/\>

\</resources\>

\</control\>

\</manifest\>

**Key Configuration Points:**

-   **name=\"rating\":** The property name that binds to your Dataverse field

-   **of-type=\"Whole.None\":** Defines an integer property (ratings 1-5)

-   **usage=\"bound\":** This property is bound to a field in Dataverse

## Exercise 1: Basic Star Rating Display

### Step 1: Create the Star Rating React Component

Create a new file StarRating.tsx in the StarRating folder (same level as index.ts):

import \* as React from \"react\";

import { Icon } from \"@fluentui/react/lib/Icon\";

import { Stack } from \"@fluentui/react/lib/Stack\";

interface IStarRatingProps {

rating: number; // Current rating from Dataverse

maxStars?: number; // Total stars to display

}

export const StarRating: React.FC\<IStarRatingProps\> = (props) =\> {

const { rating, maxStars = 5 } = props;

// Render star icons

const renderStars = () =\> {

const stars = \[\];

for (let i = 1; i \<= maxStars; i++) {

const isFilled = i \<= rating;

stars.push(

\<Icon

key={i}

iconName={isFilled ? \"FavoriteStarFill\" : \"FavoriteStar\"}

styles={{

root: {

fontSize: 24,

color: isFilled ? \"#FFB900\" : \"#D0D0D0\",

cursor: \"pointer\",

marginRight: 4

}

}}

/\>

);

}

return stars;

};

return (

\<Stack horizontal\>{renderStars()}\</Stack\>

);

};

**Understanding This Code:**

-   **Props interface:** Defines the data React receives from PCF

-   **rating prop:** This will be passed from PCF\'s updateView() method

-   **Fluent UI Icon:** FavoriteStarFill for filled, FavoriteStar for empty

-   **Stack:** Fluent UI layout component for horizontal arrangement

### Step 2: Integrate React with PCF Lifecycle

Now we\'ll modify index.ts to bridge PCF lifecycle methods with our React component. Open index.ts and replace its contents:

import { IInputs, IOutputs } from \"./generated/ManifestTypes\";

import \* as React from \"react\";

import \* as ReactDOM from \"react-dom\";

import { StarRating } from \"./StarRating\";

export class StarRating implements ComponentFramework.StandardControl\<IInputs, IOutputs\> {

// Container element where React will render

private \_container: HTMLDivElement;

/\*\*

\* LIFECYCLE METHOD 1: init()

\* Called once when the control is loaded

\* Use this to set up your React container

\*/

public init(

context: ComponentFramework.Context\<IInputs\>,

notifyOutputChanged: () =\> void,

state: ComponentFramework.Dictionary,

container: HTMLDivElement

): void {

// Store the container reference

this.\_container = container;

}

/\*\*

\* LIFECYCLE METHOD 2: updateView()

\* Called when bound data changes or form loads

\* This is where PCF passes data TO React

\*/

public updateView(context: ComponentFramework.Context\<IInputs\>): void {

// Get the current rating value from Dataverse

const rating = context.parameters.rating.raw ?? 0;

// Render (or re-render) the React component with updated props

ReactDOM.render(

React.createElement(StarRating, {

rating: rating

}),

this.\_container

);

}

/\*\*

\* LIFECYCLE METHOD 3: getOutputs()

\* Called when platform needs to save data

\* This is where PCF receives data FROM React

\*/

public getOutputs(): IOutputs {

// For now, return empty (we will update this in Exercise 2)

return {};

}

/\*\*

\* LIFECYCLE METHOD 4: destroy()

\* Called when the control is removed from DOM

\* Clean up React components here

\*/

public destroy(): void {

// Unmount React component

ReactDOM.unmountComponentAtNode(this.\_container);

}

}

**Critical Points to Understand:**

-   **init() stores the container:** Called once, keeps reference to where React renders

-   **updateView() passes data to React:** Calls ReactDOM.render() with rating from context.parameters

-   **React reconciliation:** React efficiently updates only what changed between renders

-   **destroy() cleans up:** Unmounts React to prevent memory leaks

### Step 3: Build and Test

**Build the control:**

npm run build

**Start the test harness:**

npm start watch

The test harness will open in your browser. You should see 5 stars displayed, with the number filled based on the test value. Try changing the rating value in the test inputs to see updateView() in action!

## Exercise 2: User Clicks and Data Output

Now we\'ll add click functionality so users can select a rating, and send that value back to PCF via getOutputs().

### Step 1: Add Click Handling to React Component

Update StarRating.tsx to accept an onChange callback and handle clicks:

import \* as React from \"react\";

import { Icon } from \"@fluentui/react/lib/Icon\";

import { Stack } from \"@fluentui/react/lib/Stack\";

interface IStarRatingProps {

rating: number;

maxStars?: number;

onChange?: (newRating: number) =\> void; // NEW: Callback to PCF

}

export const StarRating: React.FC\<IStarRatingProps\> = (props) =\> {

const { rating, maxStars = 5, onChange } = props;

// Handle star click

const handleStarClick = (starIndex: number) =\> {

if (onChange) {

onChange(starIndex); // Call PCF callback

}

};

const renderStars = () =\> {

const stars = \[\];

for (let i = 1; i \<= maxStars; i++) {

const isFilled = i \<= rating;

stars.push(

\<Icon

key={i}

iconName={isFilled ? \"FavoriteStarFill\" : \"FavoriteStar\"}

onClick={() =\> handleStarClick(i)} // NEW: Click handler

styles={{

root: {

fontSize: 24,

color: isFilled ? \"#FFB900\" : \"#D0D0D0\",

cursor: \"pointer\",

marginRight: 4

}

}}

/\>

);

}

return stars;

};

return \<Stack horizontal\>{renderStars()}\</Stack\>;

};

**What Changed:**

-   **onChange prop:** PCF will pass this callback to receive rating changes

-   **onClick handler:** When star is clicked, calls onChange with new rating

-   **Data flow:** User clicks → React handler → onChange callback → PCF receives value

### Step 2: Update PCF to Handle Output

Update index.ts to store the rating and notify the platform of changes:

import { IInputs, IOutputs } from \"./generated/ManifestTypes\";

import \* as React from \"react\";

import \* as ReactDOM from \"react-dom\";

import { StarRating } from \"./StarRating\";

export class StarRating implements ComponentFramework.StandardControl\<IInputs, IOutputs\> {

private \_container: HTMLDivElement;

private \_notifyOutputChanged: () =\> void; // NEW: Store callback

private \_currentRating: number; // NEW: Store current value

public init(

context: ComponentFramework.Context\<IInputs\>,

notifyOutputChanged: () =\> void,

state: ComponentFramework.Dictionary,

container: HTMLDivElement

): void {

this.\_container = container;

this.\_notifyOutputChanged = notifyOutputChanged; // NEW: Store

this.\_currentRating = context.parameters.rating.raw ?? 0;

}

public updateView(context: ComponentFramework.Context\<IInputs\>): void {

const rating = context.parameters.rating.raw ?? 0;

this.\_currentRating = rating; // NEW: Update stored value

ReactDOM.render(

React.createElement(StarRating, {

rating: rating,

onChange: this.onRatingChange.bind(this) // NEW: Pass callback

}),

this.\_container

);

}

// NEW: React calls this when user clicks a star

private onRatingChange(newRating: number): void {

this.\_currentRating = newRating; // Store new value

this.\_notifyOutputChanged(); // Tell platform data changed

}

public getOutputs(): IOutputs {

// NEW: Return current rating to platform

return {

rating: this.\_currentRating

};

}

public destroy(): void {

ReactDOM.unmountComponentAtNode(this.\_container);

}

}

**Understanding the Complete Flow:**

10. **User clicks star 4 →** React\'s handleStarClick(4) fires

11. **handleStarClick calls onChange(4) →** PCF\'s onRatingChange(4) executes

12. **onRatingChange stores 4 and calls notifyOutputChanged() →** Platform is notified

13. **Platform calls getOutputs() →** PCF returns { rating: 4 }

14. **Platform saves 4 to Dataverse →** Platform calls updateView() with new value

15. **updateView re-renders React with rating: 4 →** UI updates to show 4 filled stars

### Step 3: Test the Interaction

**Rebuild and test:**

npm run build

npm start watch

Now click on different stars. You should see the rating update in the test harness output panel, confirming that getOutputs() is being called and returning the correct value!

## Exercise 3: Adding Hover Effects

Let\'s enhance the user experience by showing a preview when hovering over stars. We\'ll use React state to track the hover position.

### Step 1: Add Hover State to React Component

Update StarRating.tsx to use React\'s useState hook for hover tracking:

import \* as React from \"react\";

import { Icon } from \"@fluentui/react/lib/Icon\";

import { Stack } from \"@fluentui/react/lib/Stack\";

interface IStarRatingProps {

rating: number;

maxStars?: number;

onChange?: (newRating: number) =\> void;

}

export const StarRating: React.FC\<IStarRatingProps\> = (props) =\> {

const { rating, maxStars = 5, onChange } = props;

// NEW: Track hover state

const \[hoverRating, setHoverRating\] = React.useState\<number \| null\>(null);

const handleStarClick = (starIndex: number) =\> {

if (onChange) {

onChange(starIndex);

}

};

// NEW: Mouse enter handler

const handleMouseEnter = (starIndex: number) =\> {

setHoverRating(starIndex);

};

// NEW: Mouse leave handler

const handleMouseLeave = () =\> {

setHoverRating(null);

};

const renderStars = () =\> {

const stars = \[\];

for (let i = 1; i \<= maxStars; i++) {

// NEW: Use hover rating if hovering, otherwise use actual rating

const displayRating = hoverRating !== null ? hoverRating : rating;

const isFilled = i \<= displayRating;

stars.push(

\<Icon

key={i}

iconName={isFilled ? \"FavoriteStarFill\" : \"FavoriteStar\"}

onClick={() =\> handleStarClick(i)}

onMouseEnter={() =\> handleMouseEnter(i)} // NEW

onMouseLeave={handleMouseLeave} // NEW

styles={{

root: {

fontSize: 24,

color: isFilled ? \"#FFB900\" : \"#D0D0D0\",

cursor: \"pointer\",

marginRight: 4,

transition: \"color 0.2s ease\" // NEW: Smooth transition

}

}}

/\>

);

}

return stars;

};

return \<Stack horizontal\>{renderStars()}\</Stack\>;

};

**Understanding React State in PCF:**

-   **useState hook:** Creates internal React state that doesn\'t flow back to PCF

-   **Hover is UI-only:** It\'s a preview, not a committed value

-   **Two states:** rating (from PCF) and hoverRating (React internal)

-   **displayRating:** Uses hover if hovering, otherwise shows actual rating

### Step 2: Test Hover Effects

**Rebuild and test:**

npm run build

npm start watch

Hover over the stars to see the preview effect. Notice how the stars fill as you hover, but only commit when you click. The smooth transition makes the interaction feel polished and professional.

Summary and Key Takeaways

Congratulations! You\'ve built a complete PCF control with React integration. Let\'s review the critical concepts:

PCF Lifecycle Method Summary

  ------------------ ----------------------------- ---------------------------------- ------------------------
  **Method**         **When Called**               **React Action**                   **Data Flow**

  **init()**         Once at load                  Store container                    None

  **updateView()**   Data changes                  ReactDOM.render() with new props   Platform → PCF → React

  **getOutputs()**   After notifyOutputChanged()   None (returns stored value)        React → PCF → Platform

  **destroy()**      Control removed               unmountComponentAtNode()           Cleanup
  ------------------ ----------------------------- ---------------------------------- ------------------------

Key Concepts to Remember

1\. Platform is Source of Truth

Dataverse holds the actual data. PCF and React are just UI layers. Always get data from context.parameters in updateView(), and return data via getOutputs().

2\. ReactDOM.render() is Idempotent

Calling ReactDOM.render() multiple times on the same container is safe. React\'s reconciliation efficiently updates only what changed.

3\. Two Types of State

-   **PCF state:** Stored in class variables, persisted to Dataverse via getOutputs()

-   **React state:** Managed by useState, used for UI-only concerns (like hover)

4\. Fluent UI Compatibility

Always use \@fluentui/react v8 for Power Apps. Version 9 is not compatible with Dynamics 365 and will cause runtime errors.

Next Steps and Challenges

**Challenge yourself with these enhancements:**

16. **Add half-star support:** Modify to allow ratings like 3.5

17. **Add read-only mode:** Use context.mode.isControlDisabled to disable clicks

18. **Add a label:** Display \"3 out of 5 stars\" below the rating

19. **Customize star color:** Add a manifest property for star color

20. **Deploy to your environment:** Use pac solution to package and deploy

Additional Resources

-   PCF Documentation: https://aka.ms/PowerAppsPCF

-   Fluent UI v8 Documentation: https://developer.microsoft.com/en-us/fluentui

-   React Documentation: https://react.dev

-   Power Platform CLI: https://aka.ms/PowerPlatformCLI

*You now have a solid foundation in PCF-React integration. Understanding the lifecycle methods and data flow patterns covered in this lab will enable you to build sophisticated, interactive controls for Power Apps and Dynamics 365.*
