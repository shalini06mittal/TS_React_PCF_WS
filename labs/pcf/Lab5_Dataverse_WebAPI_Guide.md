# Dataverse Web API - Developer Guide

## Table of Contents

- [Dataverse Web API](#dataverse-web-api)
- [Topics Covered](#topics-covered)
  - [1. Introduction to Dataverse & the Web API](#1-introduction-to-dataverse-the-web-api)
  - [1.1 What is Microsoft Dataverse?](#11-what-is-microsoft-dataverse)
  - [1.2 What is the Dataverse Web API?](#12-what-is-the-dataverse-web-api)
  - [1.3 When to Use the Web API vs Xrm.WebApi](#13-when-to-use-the-web-api-vs-xrmwebapi)
  - [2. OData Query Basics](#2-odata-query-basics)
  - [2.1 OData Query Options At a Glance](#21-odata-query-options-at-a-glance)
  - [2.2 Common Filter Operators](#22-common-filter-operators)
  - [2.3 A Sample OData URL](#23-a-sample-odata-url)
  - [3. retrieveMultipleRecords --- Deep Dive](#3-retrievemultiplerecords-deep-dive)
  - [3.1 What is retrieveMultipleRecords?](#31-what-is-retrievemultiplerecords)
  - [3.2 Parameters Explained](#32-parameters-explained)
  - [3.3 Your First retrieveMultipleRecords Call](#33-your-first-retrievemultiplerecords-call)
  - [3.4 Understanding the Response Object](#34-understanding-the-response-object)
  - [3.5 Filtering and Selecting Columns](#35-filtering-and-selecting-columns)
  - [3.6 Pagination with nextLink](#36-pagination-with-nextlink)
  - [4. Promise Handling --- From Basics to Mastery](#4-promise-handling-from-basics-to-mastery)
  - [4.1 What is a Promise?](#41-what-is-a-promise)
  - [4.2 The .then() / .catch() Pattern](#42-the-then-catch-pattern)
  - [4.3 async / await --- The Modern Way](#43-async-await-the-modern-way)
  - [4.4 Running Multiple Calls in Parallel](#44-running-multiple-calls-in-parallel)
  - [4.5 Error Object Structure](#45-error-object-structure)
  - [5. Mini Project --- Account Summary Dashboard](#5-mini-project-account-summary-dashboard)
  - [5.1 Project Structure](#51-project-structure)
  - [5.2 Step 1 --- Define Helper Functions](#52-step-1-define-helper-functions)
  - [5.3 Step 2 --- Revenue Tier Classification](#53-step-2-revenue-tier-classification)
  - [5.4 Step 3 --- Load & Enrich Data](#54-step-3-load-enrich-data)
  - [5.5 Step 4 --- Build the Summary HTML](#55-step-4-build-the-summary-html)
  - [5.6 Step 5 --- Main Entry Point with Full Error Handling](#56-step-5-main-entry-point-with-full-error-handling)
  - [5.7 Deploying the Script](#57-deploying-the-script)
  - [6. Quick Reference Cheat Sheet](#6-quick-reference-cheat-sheet)
- [retrieveMultipleRecords Syntax](#retrievemultiplerecords-syntax)
- [Most Used OData Patterns](#most-used-odata-patterns)
- [Promise Patterns](#promise-patterns)
  - [7. Best Practices & Tips](#7-best-practices-tips)
- [Performance](#performance)
- [Error Handling](#error-handling)
- [Code Quality](#code-quality)

---

**Dataverse Web API**

A Complete Developer Guide

retrieveMultipleRecords · Promise Handling · Mini Project

**Topics Covered**

✦ What is Dataverse & the Web API?

✦ OData Query Fundamentals

✦ retrieveMultipleRecords --- Step by Step

✦ JavaScript Promises & async/await

✦ Error Handling Patterns

✦ Mini Project: Account Dashboard

**1. Introduction to Dataverse & the Web API**

**1.1 What is Microsoft Dataverse?**

Microsoft Dataverse is the underlying data platform powering the
Microsoft Power Platform (Power Apps, Power Automate, Dynamics 365). It
stores and manages business data as tables (formerly called entities),
with built-in security, auditing, and business logic.

  -----------------------------------------------------------------------
  **Concept**            **Description**
  ---------------------- ------------------------------------------------
  Tables                 Equivalent to database tables (e.g., Account,
                         Contact, Lead)

  Columns                Fields / attributes within a table (e.g., name,
                         emailaddress1)

  Rows                   Individual records stored in a table

  Relationships          Lookups and many-to-many links between tables

  OData                  Open protocol used by the Web API for querying
                         data
  -----------------------------------------------------------------------

**1.2 What is the Dataverse Web API?**

The Dataverse Web API is a RESTful API that allows you to interact with
Dataverse data over HTTP. It is based on OData v4, a standard for
building and consuming RESTful APIs.

+-----------------------------------------------------------------------+
| **Key Facts about the Web API**                                       |
|                                                                       |
| **•** Base URL: https://\<org\>.api.crm.dynamics.com/api/data/v9.2/   |
|                                                                       |
| **•** Uses standard HTTP verbs: GET, POST, PATCH, DELETE              |
|                                                                       |
| **•** Returns JSON responses by default                               |
|                                                                       |
| **•** Authentication via OAuth 2.0 or session cookies                 |
+-----------------------------------------------------------------------+

**1.3 When to Use the Web API vs Xrm.WebApi**

Inside Power Apps model-driven apps and custom pages, Microsoft provides
the client-side Xrm.WebApi object --- a wrapper around the underlying
REST API. This guide focuses on both approaches.

  -----------------------------------------------------------------------
  **Approach**           **When to Use**
  ---------------------- ------------------------------------------------
  Xrm.WebApi             Inside model-driven apps, PCF controls, ribbon
                         buttons

  Raw fetch / axios      External apps, SPAs, Node.js integrations

  Power Automate HTTP    Low-code workflows calling the API
  -----------------------------------------------------------------------

**2. OData Query Basics**

The Dataverse Web API relies on OData v4 query options to filter, sort,
and shape returned data. Understanding these is essential before using
retrieveMultipleRecords.

**2.1 OData Query Options At a Glance**

  -----------------------------------------------------------------------
  **Option**             **Purpose & Example**
  ---------------------- ------------------------------------------------
  \$select               Return only specific columns:
                         \$select=name,telephone1

  \$filter               Filter records: \$filter=statecode eq 0

  \$orderby              Sort results: \$orderby=createdon desc

  \$top                  Limit number of rows: \$top=10

  \$expand               Include related records:
                         \$expand=primarycontactid(\$select=fullname)

  \$count=true           Return total record count alongside results
  -----------------------------------------------------------------------

**2.2 Common Filter Operators**

  -----------------------------------------------------------------------
  **Operator**           **Example**
  ---------------------- ------------------------------------------------
  eq (equals)            \$filter=statecode eq 0

  ne (not equals)        \$filter=statecode ne 1

  gt / lt                \$filter=revenue gt 100000

  contains()             \$filter=contains(name,\'Contoso\')

  startswith()           \$filter=startswith(name,\'A\')

  and / or               \$filter=statecode eq 0 and revenue gt 5000
  -----------------------------------------------------------------------

**2.3 A Sample OData URL**

Below is a full sample URL that retrieves active accounts with revenue
\> 50,000, returning only name, revenue, and telephone, sorted by name:

+-----------------------------------------------------------------------+
| https://\<org\>.api.crm.dynamics.com/api/data/v9.2/accounts           |
|                                                                       |
| ?\$select=name,revenue,telephone1                                     |
|                                                                       |
| &\$filter=statecode eq 0 and revenue gt 50000                         |
|                                                                       |
| &\$orderby=name asc                                                   |
|                                                                       |
| &\$top=50                                                             |
+-----------------------------------------------------------------------+

  -----------------------------------------------------------------------
  **💡 Note:** Always use \$select to limit columns. Fetching all columns
  is slow, increases payload size, and can hit API limits.

  -----------------------------------------------------------------------

**3. retrieveMultipleRecords --- Deep Dive**

**3.1 What is retrieveMultipleRecords?**

retrieveMultipleRecords is a method on the Xrm.WebApi object available
inside Power Apps client-side JavaScript. It retrieves a collection of
records from a Dataverse table using OData query options.

+-----------------------------------------------------------------------+
| **Method Signature**                                                  |
|                                                                       |
| Xrm.WebApi.retrieveMultipleRecords(entityLogicalName, options?,       |
| maxPageSize?)                                                         |
+-----------------------------------------------------------------------+

**3.2 Parameters Explained**

  -----------------------------------------------------------------------
  **Parameter**          **Description**
  ---------------------- ------------------------------------------------
  entityLogicalName      The logical name of the table (e.g.,
                         \"account\", \"contact\"). Always lowercase.

  options (optional)     OData query string starting with ?. Include
                         \$select, \$filter, \$orderby, etc.

  maxPageSize (optional) Max records per page. Default is 5000. Use for
                         pagination.
  -----------------------------------------------------------------------

**3.3 Your First retrieveMultipleRecords Call**

Let\'s start with the simplest possible example --- fetching the top 5
account names:

+-----------------------------------------------------------------------+
| // Step 1: Call retrieveMultipleRecords                               |
|                                                                       |
| Xrm.WebApi.retrieveMultipleRecords(                                   |
|                                                                       |
| \"account\",                                                          |
|                                                                       |
| \"?\$select=name&\$top=5\"                                            |
|                                                                       |
| )                                                                     |
|                                                                       |
| .then(function(result) {                                              |
|                                                                       |
| // Step 2: Access returned records                                    |
|                                                                       |
| var records = result.entities;                                        |
|                                                                       |
| console.log(\'Total records:\', records.length);                      |
|                                                                       |
| // Step 3: Loop through each record                                   |
|                                                                       |
| records.forEach(function(account) {                                   |
|                                                                       |
| console.log(\'Account Name:\', account.name);                         |
|                                                                       |
| });                                                                   |
|                                                                       |
| })                                                                    |
|                                                                       |
| .catch(function(error) {                                              |
|                                                                       |
| console.error(\'Error:\', error.message);                             |
|                                                                       |
| });                                                                   |
+-----------------------------------------------------------------------+

**3.4 Understanding the Response Object**

The method returns a Promise that resolves with a RetrieveMultipleResult
object:

+-----------------------------------------------------------------------+
| {                                                                     |
|                                                                       |
| \"entities\": \[ // Array of matching records                         |
|                                                                       |
| {                                                                     |
|                                                                       |
| \"accountid\": \"guid-here\",                                         |
|                                                                       |
| \"name\": \"Contoso Ltd\",                                            |
|                                                                       |
| \"revenue\": 500000,                                                  |
|                                                                       |
| \"@odata.etag\": \"W/\\\"12345\\\"\"                                  |
|                                                                       |
| },                                                                    |
|                                                                       |
| // \... more records                                                  |
|                                                                       |
| \],                                                                   |
|                                                                       |
| \"nextLink\": \"https://\...\" // URL for next page (if paginated)    |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**3.5 Filtering and Selecting Columns**

Now let\'s add \$filter and \$select to retrieve only active contacts
with an email address:

+-----------------------------------------------------------------------+
| Xrm.WebApi.retrieveMultipleRecords(                                   |
|                                                                       |
| \"contact\",                                                          |
|                                                                       |
| \"?\$select=fullname,emailaddress1,telephone1&\$filter=statecode eq 0 |
| and emailaddress1 ne null&\$orderby=fullname asc&\$top=20\"           |
|                                                                       |
| )                                                                     |
|                                                                       |
| .then(function(result) {                                              |
|                                                                       |
| result.entities.forEach(function(contact) {                           |
|                                                                       |
| console.log(contact.fullname, \'-\', contact.emailaddress1);          |
|                                                                       |
| });                                                                   |
|                                                                       |
| })                                                                    |
|                                                                       |
| .catch(function(error) {                                              |
|                                                                       |
| Xrm.Navigation.openAlertDialog({ text: \'Failed: \' + error.message   |
| });                                                                   |
|                                                                       |
| });                                                                   |
+-----------------------------------------------------------------------+

**3.6 Pagination with nextLink**

When results exceed maxPageSize, Dataverse returns a nextLink URL for
the next page. Here is how to handle all pages recursively:

+-----------------------------------------------------------------------+
| function getAllRecords(entityName, options, allResults) {             |
|                                                                       |
| allResults = allResults \|\| \[\];                                    |
|                                                                       |
| return Xrm.WebApi.retrieveMultipleRecords(entityName, options, 100)   |
|                                                                       |
| .then(function(result) {                                              |
|                                                                       |
| // Merge this page into our results                                   |
|                                                                       |
| allResults = allResults.concat(result.entities);                      |
|                                                                       |
| // If nextLink exists, fetch the next page                            |
|                                                                       |
| if (result.nextLink) {                                                |
|                                                                       |
| // Extract the options portion from the nextLink URL                  |
|                                                                       |
| var nextOptions = result.nextLink.substring(                          |
|                                                                       |
| result.nextLink.indexOf(\'?\')                                        |
|                                                                       |
| );                                                                    |
|                                                                       |
| return getAllRecords(entityName, nextOptions, allResults);            |
|                                                                       |
| }                                                                     |
|                                                                       |
| // No more pages --- return everything                                |
|                                                                       |
| return allResults;                                                    |
|                                                                       |
| });                                                                   |
|                                                                       |
| }                                                                     |
|                                                                       |
| // Usage                                                              |
|                                                                       |
| getAllRecords(\"account\",                                            |
| \"?\$select=name,revenue&\$filter=statecode eq 0\")                   |
|                                                                       |
| .then(function(allAccounts) {                                         |
|                                                                       |
| console.log(\'Total accounts found:\', allAccounts.length);           |
|                                                                       |
| });                                                                   |
+-----------------------------------------------------------------------+

**4. Promise Handling --- From Basics to Mastery**

**4.1 What is a Promise?**

A Promise is a JavaScript object representing the eventual completion or
failure of an asynchronous operation. The Dataverse Web API is entirely
asynchronous --- every call returns a Promise.

+-----------------------------------------------------------------------+
| **Promise States**                                                    |
|                                                                       |
| **Pending** --- The async operation has not finished yet              |
|                                                                       |
| **Fulfilled** --- The operation completed successfully (.then() is    |
| called)                                                               |
|                                                                       |
| **Rejected** --- The operation failed (.catch() is called)            |
+-----------------------------------------------------------------------+

**4.2 The .then() / .catch() Pattern**

The classic Promise pattern uses .then() for success and .catch() for
errors. These methods can be chained.

+-----------------------------------------------------------------------+
| Xrm.WebApi.retrieveMultipleRecords(\'account\', \'?\$select=name\')   |
|                                                                       |
| // .then() runs when the Promise is fulfilled                         |
|                                                                       |
| .then(function(result) {                                              |
|                                                                       |
| console.log(\'Success! Records:\', result.entities.length);           |
|                                                                       |
| return result.entities; // Pass data to next .then()                  |
|                                                                       |
| })                                                                    |
|                                                                       |
| // Chain another .then() to process results                           |
|                                                                       |
| .then(function(accounts) {                                            |
|                                                                       |
| var names = accounts.map(a =\> a.name);                               |
|                                                                       |
| console.log(\'Account names:\', names);                               |
|                                                                       |
| })                                                                    |
|                                                                       |
| // .catch() runs if ANY step above throws or rejects                  |
|                                                                       |
| .catch(function(error) {                                              |
|                                                                       |
| console.error(\'Code:\', error.errorCode);                            |
|                                                                       |
| console.error(\'Message:\', error.message);                           |
|                                                                       |
| })                                                                    |
|                                                                       |
| // .finally() always runs (success or error)                          |
|                                                                       |
| .finally(function() {                                                 |
|                                                                       |
| console.log(\'Request complete\');                                    |
|                                                                       |
| });                                                                   |
+-----------------------------------------------------------------------+

**4.3 async / await --- The Modern Way**

async/await is syntactic sugar over Promises. It makes asynchronous code
look synchronous and is much easier to read and debug.

+-----------------------------------------------------------------------+
| // Mark your function as async                                        |
|                                                                       |
| async function loadAccounts() {                                       |
|                                                                       |
| try {                                                                 |
|                                                                       |
| // await pauses here until the Promise resolves                       |
|                                                                       |
| const result = await Xrm.WebApi.retrieveMultipleRecords(              |
|                                                                       |
| \'account\',                                                          |
|                                                                       |
| \'?\$select=name,revenue&\$filter=statecode eq 0&\$top=10\'           |
|                                                                       |
| );                                                                    |
|                                                                       |
| const accounts = result.entities;                                     |
|                                                                       |
| console.log(\`Found \${accounts.length} accounts\`);                  |
|                                                                       |
| // Process normally --- no .then() nesting needed                     |
|                                                                       |
| accounts.forEach(acc =\> {                                            |
|                                                                       |
| console.log(acc.name, \'---\', acc.revenue);                          |
|                                                                       |
| });                                                                   |
|                                                                       |
| return accounts;                                                      |
|                                                                       |
| } catch (error) {                                                     |
|                                                                       |
| // Error handling is clean with try/catch                             |
|                                                                       |
| console.error(\'Failed to load accounts:\', error.message);           |
|                                                                       |
| throw error; // Re-throw if caller should handle it                   |
|                                                                       |
| }                                                                     |
|                                                                       |
| }                                                                     |
|                                                                       |
| // Call the async function                                            |
|                                                                       |
| loadAccounts();                                                       |
+-----------------------------------------------------------------------+

**4.4 Running Multiple Calls in Parallel**

Use Promise.all() when you need data from multiple tables
simultaneously. This runs calls in parallel --- much faster than
sequential awaits.

+-----------------------------------------------------------------------+
| async function loadDashboardData() {                                  |
|                                                                       |
| try {                                                                 |
|                                                                       |
| // Start all three requests at the same time                          |
|                                                                       |
| const \[accountsResult, contactsResult, leadsResult\] = await         |
| Promise.all(\[                                                        |
|                                                                       |
| Xrm.WebApi.retrieveMultipleRecords(\'account\',                       |
|                                                                       |
| \'?\$select=name,revenue&\$filter=statecode eq 0&\$top=5\'),          |
|                                                                       |
| Xrm.WebApi.retrieveMultipleRecords(\'contact\',                       |
|                                                                       |
| \'?\$select=fullname,emailaddress1&\$filter=statecode eq              |
| 0&\$top=5\'),                                                         |
|                                                                       |
| Xrm.WebApi.retrieveMultipleRecords(\'lead\',                          |
|                                                                       |
| \'?\$select=fullname,subject&\$filter=statecode eq 0&\$top=5\')       |
|                                                                       |
| \]);                                                                  |
|                                                                       |
| return {                                                              |
|                                                                       |
| accounts: accountsResult.entities,                                    |
|                                                                       |
| contacts: contactsResult.entities,                                    |
|                                                                       |
| leads: leadsResult.entities                                           |
|                                                                       |
| };                                                                    |
|                                                                       |
| } catch (error) {                                                     |
|                                                                       |
| console.error(\'Dashboard load failed:\', error.message);             |
|                                                                       |
| }                                                                     |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

  -----------------------------------------------------------------------
  **💡 Note:** Promise.all() fails fast --- if any one Promise rejects,
  the entire .catch() runs immediately. Use Promise.allSettled() if you
  want each result individually, even if some fail.

  -----------------------------------------------------------------------

**4.5 Error Object Structure**

When a Dataverse API call fails, the error object contains useful
properties for debugging:

  -----------------------------------------------------------------------
  **Property**           **Description**
  ---------------------- ------------------------------------------------
  error.message          Human-readable error description

  error.errorCode        Numeric Dataverse error code

  error.name             Error type name

  error.raw              Raw HTTP response body (advanced debugging)
  -----------------------------------------------------------------------

+-----------------------------------------------------------------------+
| .catch(function(error) {                                              |
|                                                                       |
| // Check for common error codes                                       |
|                                                                       |
| if (error.errorCode === -2147220891) {                                |
|                                                                       |
| console.error(\'Record not found\');                                  |
|                                                                       |
| } else if (error.errorCode === -2147217149) {                         |
|                                                                       |
| console.error(\'You do not have permission for this operation\');     |
|                                                                       |
| } else {                                                              |
|                                                                       |
| console.error(\'Unexpected error:\', error.errorCode, error.message); |
|                                                                       |
| }                                                                     |
|                                                                       |
| });                                                                   |
+-----------------------------------------------------------------------+

**5. Mini Project --- Account Summary Dashboard**

Now let\'s put everything together. We will build a reusable Account
Dashboard script that:

-   Fetches active accounts with revenue \> 0

-   Fetches related primary contacts in parallel

-   Groups accounts by revenue tier

-   Renders a simple HTML summary in an alert dialog

-   Handles all errors gracefully

**5.1 Project Structure**

+-----------------------------------------------------------------------+
| AccountDashboard/                                                     |
|                                                                       |
| ├── dashboard.js // Main logic (all code below goes here)             |
|                                                                       |
| └── (deploy as a Web Resource in your Dataverse environment)          |
+-----------------------------------------------------------------------+

**5.2 Step 1 --- Define Helper Functions**

First, we define small, reusable helper functions for fetching data:

+-----------------------------------------------------------------------+
| // dashboard.js                                                       |
|                                                                       |
| /\*\* Fetches active accounts with revenue data \*/                   |
|                                                                       |
| async function getActiveAccounts() {                                  |
|                                                                       |
| const result = await Xrm.WebApi.retrieveMultipleRecords(              |
|                                                                       |
| \'account\',                                                          |
|                                                                       |
| \'                                                                    |
| ?\$select=accountid,name,revenue,numberofemployees,primarycontactid\' |
| +                                                                     |
|                                                                       |
| \'&\$filter=statecode eq 0 and revenue gt 0\' +                       |
|                                                                       |
| \'&\$orderby=revenue desc\' +                                         |
|                                                                       |
| \'&\$top=20\'                                                         |
|                                                                       |
| );                                                                    |
|                                                                       |
| return result.entities;                                               |
|                                                                       |
| }                                                                     |
|                                                                       |
| /\*\* Fetches active contacts for a given account ID \*/              |
|                                                                       |
| async function getContactsForAccount(accountId) {                     |
|                                                                       |
| const result = await Xrm.WebApi.retrieveMultipleRecords(              |
|                                                                       |
| \'contact\',                                                          |
|                                                                       |
| \`?\$select=fullname,emailaddress1,jobtitle\` +                       |
|                                                                       |
| \`&\$filter=statecode eq 0 and \_parentcustomerid_value eq            |
| \${accountId}\` +                                                     |
|                                                                       |
| \`&\$top=3\`                                                          |
|                                                                       |
| );                                                                    |
|                                                                       |
| return result.entities;                                               |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**5.3 Step 2 --- Revenue Tier Classification**

Next, a pure utility function to categorize accounts:

+-----------------------------------------------------------------------+
| /\*\* Classifies account by revenue into tiers \*/                    |
|                                                                       |
| function getRevenueTier(revenue) {                                    |
|                                                                       |
| if (revenue \>= 10000000) return { label: \'Enterprise\', emoji:      |
| \'🏢\' };                                                             |
|                                                                       |
| if (revenue \>= 1000000) return { label: \'Mid-Market\', emoji:       |
| \'🏬\' };                                                             |
|                                                                       |
| if (revenue \>= 100000) return { label: \'SMB\', emoji: \'🏪\' };     |
|                                                                       |
| return { label: \'Startup\', emoji: \'🚀\' };                         |
|                                                                       |
| }                                                                     |
|                                                                       |
| /\*\* Formats currency for display \*/                                |
|                                                                       |
| function formatCurrency(amount) {                                     |
|                                                                       |
| return new Intl.NumberFormat(\'en-US\', {                             |
|                                                                       |
| style: \'currency\', currency: \'USD\', maximumFractionDigits: 0      |
|                                                                       |
| }).format(amount);                                                    |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**5.4 Step 3 --- Load & Enrich Data**

Fetch accounts then enrich each with contact data in parallel:

+-----------------------------------------------------------------------+
| /\*\* Loads accounts and enriches each with top contacts \*/          |
|                                                                       |
| async function loadEnrichedAccounts() {                               |
|                                                                       |
| // 1. Fetch all accounts first                                        |
|                                                                       |
| const accounts = await getActiveAccounts();                           |
|                                                                       |
| console.log(\`Fetched \${accounts.length} accounts\`);                |
|                                                                       |
| // 2. For each account, fetch contacts IN PARALLEL                    |
|                                                                       |
| const enriched = await Promise.all(                                   |
|                                                                       |
| accounts.map(async function(account) {                                |
|                                                                       |
| let contacts = \[\];                                                  |
|                                                                       |
| try {                                                                 |
|                                                                       |
| contacts = await getContactsForAccount(account.accountid);            |
|                                                                       |
| } catch (err) {                                                       |
|                                                                       |
| // Don\'t fail entire dashboard if one account\'s contacts error      |
|                                                                       |
| console.warn(\`Could not load contacts for \${account.name}:\`,       |
| err.message);                                                         |
|                                                                       |
| }                                                                     |
|                                                                       |
| return { \...account, contacts };                                     |
|                                                                       |
| })                                                                    |
|                                                                       |
| );                                                                    |
|                                                                       |
| return enriched;                                                      |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**5.5 Step 4 --- Build the Summary HTML**

Build a formatted HTML string from the enriched data:

+-----------------------------------------------------------------------+
| /\*\* Builds HTML summary of account data \*/                         |
|                                                                       |
| function buildSummaryHTML(accounts) {                                 |
|                                                                       |
| // Group accounts by tier                                             |
|                                                                       |
| const groups = {};                                                    |
|                                                                       |
| accounts.forEach(acc =\> {                                            |
|                                                                       |
| const tier = getRevenueTier(acc.revenue);                             |
|                                                                       |
| if (!groups\[tier.label\]) groups\[tier.label\] = \[\];               |
|                                                                       |
| groups\[tier.label\].push({ \...acc, tier });                         |
|                                                                       |
| });                                                                   |
|                                                                       |
| let html = \'\<div style=\"font-family:Segoe UI;\"\>\';               |
|                                                                       |
| html += \`\<h2\>Account Dashboard --- \${accounts.length} Active      |
| Accounts\</h2\>\`;                                                    |
|                                                                       |
| \                                                                     |
| [\'Enterprise\',\'Mid-Market\',\'SMB\',\'Startup\'\].forEach(tierName |
| =\> {                                                                 |
|                                                                       |
| const group = groups\[tierName\];                                     |
|                                                                       |
| if (!group \|\| group.length === 0) return;                           |
|                                                                       |
| html += \`\<h3\>\${group\[0\].tier.emoji} \${tierName}                |
| (\${group.length})\</h3\>\`;                                          |
|                                                                       |
| html += \'\<ul\>\';                                                   |
|                                                                       |
| group.forEach(acc =\> {                                               |
|                                                                       |
| html += \`\<li\>\<strong\>\${acc.name}\</strong\> --- \` +            |
|                                                                       |
| \`\${formatCurrency(acc.revenue)}\`;                                  |
|                                                                       |
| if (acc.contacts.length \> 0) {                                       |
|                                                                       |
| html += \`\<br/\>\<em\>Key Contact: \${acc.contacts\[0\].fullname}\`  |
| +                                                                     |
|                                                                       |
| \` (\${acc.contacts\[0\].jobtitle \|\| \'N/A\'})\</em\>\`;            |
|                                                                       |
| }                                                                     |
|                                                                       |
| html += \'\</li\>\';                                                  |
|                                                                       |
| });                                                                   |
|                                                                       |
| html += \'\</ul\>\';                                                  |
|                                                                       |
| });                                                                   |
|                                                                       |
| html += \'\</div\>\';                                                 |
|                                                                       |
| return html;                                                          |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

**5.6 Step 5 --- Main Entry Point with Full Error Handling**

Finally, the main function that orchestrates everything:

+-----------------------------------------------------------------------+
| /\*\* Main entry point --- call this from a ribbon button or onLoad   |
| event \*/                                                             |
|                                                                       |
| async function showAccountDashboard() {                               |
|                                                                       |
| // Show a loading indicator                                           |
|                                                                       |
| const loadingDlg = Xrm.Navigation.openProgressIndicator({             |
|                                                                       |
| message: \'Loading Account Dashboard\...\'                            |
|                                                                       |
| });                                                                   |
|                                                                       |
| try {                                                                 |
|                                                                       |
| // Load and enrich all account data                                   |
|                                                                       |
| const accounts = await loadEnrichedAccounts();                        |
|                                                                       |
| // Close loading indicator                                            |
|                                                                       |
| loadingDlg.close();                                                   |
|                                                                       |
| if (accounts.length === 0) {                                          |
|                                                                       |
| await Xrm.Navigation.openAlertDialog({                                |
|                                                                       |
| text: \'No active accounts with revenue found.\',                     |
|                                                                       |
| title: \'Account Dashboard\'                                          |
|                                                                       |
| });                                                                   |
|                                                                       |
| return;                                                               |
|                                                                       |
| }                                                                     |
|                                                                       |
| // Build HTML and show in dialog                                      |
|                                                                       |
| const summaryHTML = buildSummaryHTML(accounts);                       |
|                                                                       |
| await Xrm.Navigation.openAlertDialog({                                |
|                                                                       |
| confirmButtonLabel: \'Close\',                                        |
|                                                                       |
| text: summaryHTML,                                                    |
|                                                                       |
| title: \'Account Dashboard\'                                          |
|                                                                       |
| });                                                                   |
|                                                                       |
| } catch (error) {                                                     |
|                                                                       |
| // Close loading indicator on error                                   |
|                                                                       |
| loadingDlg.close();                                                   |
|                                                                       |
| console.error(\'Dashboard error:\', error);                           |
|                                                                       |
| await Xrm.Navigation.openErrorDialog({                                |
|                                                                       |
| message: \'Failed to load the Account Dashboard.\',                   |
|                                                                       |
| details: \`Error \${error.errorCode}: \${error.message}\`             |
|                                                                       |
| });                                                                   |
|                                                                       |
| }                                                                     |
|                                                                       |
| }                                                                     |
|                                                                       |
| // Expose function globally so it can be called from ribbon / form    |
| events                                                                |
|                                                                       |
| window.showAccountDashboard = showAccountDashboard;                   |
+-----------------------------------------------------------------------+

**5.7 Deploying the Script**

1.  In your Dataverse environment, go to make.powerapps.com

2.  Navigate to Solutions → your solution → New → Web Resource

3.  Set Type = Script (JScript), upload dashboard.js

4.  Add the Web Resource to an Account form or Command Bar button

5.  Set the function name to \"showAccountDashboard\" as the handler

**6. Quick Reference Cheat Sheet**

**retrieveMultipleRecords Syntax**

+-----------------------------------------------------------------------+
| // .then()/.catch() style                                             |
|                                                                       |
| Xrm.WebApi.retrieveMultipleRecords(entityName, options, maxPageSize)  |
|                                                                       |
| .then(result =\> { /\* result.entities, result.nextLink \*/ })        |
|                                                                       |
| .catch(error =\> { /\* error.message, error.errorCode \*/ });         |
|                                                                       |
| // async/await style                                                  |
|                                                                       |
| const result = await Xrm.WebApi.retrieveMultipleRecords(entityName,   |
| options);                                                             |
|                                                                       |
| const records = result.entities;                                      |
+-----------------------------------------------------------------------+

**Most Used OData Patterns**

+-----------------------------------------------------------------------+
| // Select + filter + order + limit                                    |
|                                                                       |
| ?\$select=name,revenue&\$filter=statecode eq 0&\$orderby=name         |
| asc&\$top=50                                                          |
|                                                                       |
| // Contains text search                                               |
|                                                                       |
| ?\$select=name&\$filter=contains(name,\'Contoso\')                    |
|                                                                       |
| // Lookup field filter (use \_fieldname_value)                        |
|                                                                       |
| ?\$select=fullname&\$filter=\_parentcustomerid_value eq \<guid\>      |
|                                                                       |
| // Expand related record                                              |
|                                                                       |
| ?\$s                                                                  |
| elect=name&\$expand=primarycontactid(\$select=fullname,emailaddress1) |
|                                                                       |
| // Date filter (ISO 8601)                                             |
|                                                                       |
| ?\$filter=createdon ge 2024-01-01T00:00:00Z                           |
+-----------------------------------------------------------------------+

**Promise Patterns**

+-----------------------------------------------------------------------+
| // Sequential (one after another)                                     |
|                                                                       |
| const a = await call1();                                              |
|                                                                       |
| const b = await call2(a);                                             |
|                                                                       |
| // Parallel (all at once --- faster!)                                 |
|                                                                       |
| const \[a, b, c\] = await Promise.all(\[call1(), call2(), call3()\]); |
|                                                                       |
| // Parallel with individual error handling                            |
|                                                                       |
| const results = await Promise.allSettled(\[call1(), call2()\]);       |
|                                                                       |
| results.forEach(r =\> {                                               |
|                                                                       |
| if (r.status === \'fulfilled\') console.log(r.value);                 |
|                                                                       |
| else console.error(r.reason);                                         |
|                                                                       |
| });                                                                   |
+-----------------------------------------------------------------------+

**7. Best Practices & Tips**

**Performance**

-   **Always use \$select:** Never fetch all columns. Specify only what
    you need.

-   **Use \$filter server-side:** Filter in the OData query, not in
    JavaScript after fetching all records.

-   **Use Promise.all for parallel calls:** Do not await calls
    sequentially if they are independent.

-   **Use \$top to limit records:** Avoid fetching thousands of records
    unless truly needed.

**Error Handling**

-   **Always wrap in try/catch:** Never let unhandled Promise rejections
    crash your form.

-   **Log errorCode:** Dataverse error codes are specific and useful for
    debugging.

-   **Show user-friendly messages:** Use Xrm.Navigation.openErrorDialog
    for errors visible to users.

-   **Graceful degradation:** If secondary data fails (e.g., contacts),
    continue with primary data.

**Code Quality**

-   **Break into small functions:** Each function should do one thing
    (fetch, transform, or render).

-   **Use async/await over .then() chains:** Much easier to read, debug,
    and maintain.

-   **Avoid deeply nested .then():** Chain flattens with async/await.

-   **Name your functions descriptively:** getActiveAccounts() is better
    than getData().

*Happy coding with Dataverse! 🚀*
