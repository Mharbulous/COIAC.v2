# Product Requirements Document (PRD)

## Court Order Interest Calculator v2.0

**Version:** 2.0.1
**Last Updated:** June 15, 2025

## 1. Introduction

### 1.1. Purpose

This document provides the detailed requirements for the development of the "Court Order Interest Calculator" v2.0. The primary objective is to replicate the exact user interface (UI) and core functionality of the original application while implementing a new, robust, and maintainable backend architecture. This PRD serves as the single source of truth for all project stakeholders, including developers, designers, and project managers.

### 1.2. Scope

The scope of this project is to deliver a web-based application that accurately calculates prejudgment and postjudgment interest for the jurisdictions of **British Columbia and Ontario**. The project includes the development of the frontend UI, a decoupled backend calculation engine, and the necessary data handling to support the application's features.

### 1.3. Target Audience

The primary target audience is legal professionals, paralegals, and their staff in British Columbia and Ontario who require precise interest calculations for court-ordered judgments and settlements.

## 2. Overall Vision & Goals

### 2.1. Product Vision

To be the most accurate, user-friendly, and reliable tool for legal professionals in British Columbia and Ontario to calculate interest on court-ordered judgments, ensuring compliance with provincial regulations.

### 2.2. Key Business Goals

* **Replicate Functionality:** Achieve 100% parity with the original application's features and calculation outputs, while also adding some additional features and functionality to be able to handle calculations for Ontario, and to calculate the effect of partial payments.
* **Improve Architecture:** Build a new backend that is modular, testable, and easy to maintain, avoiding the architectural flaws of the original.
* **Enhance Documentation:** Create comprehensive documentation for both the code and the system to facilitate future development and onboarding.

## 3. Functional Requirements

This section details the specific features and functionalities of the application, framed as user stories.

### 3.1. Core Calculation
* **UC-1: Prejudgment Interest Calculation:** As a user, I want the system to calculate prejudgment interest on a principal amount from a specified start date **up to, but not including, the date of judgment**, so that I can determine the interest owed before the judgment is finalized.
* **UC-2: Postjudgment Interest Calculation:** As a user, I want the system to calculate postjudgment interest **starting on the date of judgment** up to a specified end date, so that I can determine the ongoing interest owed.
* **UC-3: Special Damages:** As a user, I want to add multiple special damage entries with specific dates and amounts, so that the system can accurately calculate interest on these amounts as they are incorporated into the principal over time.
* **UC-4: Per Diem Calculation:** As a user, I want the system to calculate and display the per diem (daily) interest amount based on the total outstanding balance, so I know the daily cost of a delayed payment.

### 3.2. User Interface & Interaction
* **UI-1: Main Input Screen:** As a user, I want to see a clean, paper-like interface where I can input all necessary case information, including file number, registry, principal amounts, and key dates.
* **UI-2: Dynamic Calculation Updates:** As a user, I want all calculations and totals on the screen to update automatically and instantly whenever I change an input value (e.g., date, amount).
* **UI-3: Add/Remove Special Damages:** As a user, I want to dynamically add and remove special damage rows in the calculation table, with the interface smoothly updating to reflect these changes.
* **UI-4: Toggle Visibility of Sections:** As a user, I want to use checkboxes to show or hide the Prejudgment, Postjudgment, and Per Diem sections, so I can customize the final report for my needs.
* **UI-5: Clear Form:** As a user, I want a "Clear" button that resets all fields and calculations to their default state.
* **UI-6: Print Functionality:** As a user, I want a "Print" button that invokes the browser's standard print functionality (equivalent to pressing `Ctrl+P` or `Cmd+P`), generating a clean, printable version of the calculation report formatted for standard paper.

### 3.3. Demo Mode / Paywall
* **DM-1: Demo Banner:** As a user in demo mode, when I print the calculations using the print button or my browser, I want the print preview and the printed hardcopy to have a banner explaining that these calculations use mock interest rate, and that to do calculations using official interest rates the user will need to pay the licensing fee.
* **DM-2: Watermark:** As a user in demo mode, I want to see a watermark "Mock Interest Rates".

## 4. System & Technical Requirements

### 4.1. Calculation Engine Specification
The core of the application is a calculation engine that must be implemented as a pure, stateless module, decoupled from the UI. This decoupling is a critical architectural requirement. Because the legal rules for calculating court order interest differ significantly between jurisdictions (e.g., British Columbia vs. Ontario), this approach allows the single, consistent user interface to call the correct jurisdiction-specific calculation logic. When a user selects a jurisdiction from the dropdown menu, the application will invoke the corresponding engine to process the calculation according to that province's laws without needing to change the UI.

#### 4.1.1. Formulas
* **Simple Interest:** All interest is calculated using the simple interest formula:
    `Interest = Principal * (AnnualRate / 100) * (DaysInPeriod / DaysInYear)`
* **Days in Year:** The engine must correctly use `366` for a leap year and `365` for a common year.
* **Per Diem:** The per diem interest is calculated as:
    `PerDiem = TotalOwing * (PostjudgmentRateForDate / 100) / DaysInYear`

#### 4.1.2. Business Rules & Logic
* **Date Normalization:** All date inputs must be normalized to midnight UTC (`00:00:00.000Z`) before being used in any calculation to ensure consistency.
* **Date Period Calculation:** The number of days in a period is calculated by counting every day from the start date up to, but not including, the end date. For example, the period from Jan 1 to Jan 3 includes Jan 1 and Jan 2, resulting in 2 days. If the start and end dates are the same (e.g., Jan 1 to Jan 1), the number of days is 0.
* **Jurisdiction-Specific Logic:** Calculation rules, particularly for interest period segmentation and special damages, vary by jurisdiction and must be applied accordingly.
* **Judgment Date Boundary:** The date of judgment marks the end of the prejudgment period and the beginning of the postjudgment period. **Interest on the date of judgment itself is calculated at the post-judgment rate.**
* **BC Interest Period Segmentation:** For British Columbia, the calculation period for general damages must be segmented based on changes in the official interest rate. Interest is calculated for each segment and then summed.
* **BC Special Damages Calculation (Per BC COIA s. 1(2), 1(3)):** For British Columbia, interest on special damages is calculated separately from general damages. The calculation follows a 6-month interval logic based on the "Prejudgment Start Date" (cause of action date).
    * **Grouping:** Special damages are grouped into 6-month periods starting from the Prejudgment Start Date.
    * **Completed 6-Month Periods:** For each full 6-month period, the *total sum* of all special damages incurred within that period is calculated. Interest on this batched sum runs from the day *after* the end of that 6-month period up to the Judgment Date.
    * **Final (Incomplete) Period:** For any special damages that fall into the final, incomplete 6-month period ending on the Judgment Date, interest is calculated on *each damage amount individually* from its specific date of incurrence up to the Judgment Date.
* **Ontario Interest Rate Application:** For Ontario, the prejudgment interest rate is **fixed** for the entire period. This rate is determined by the official rate for the quarter in which the action was commenced (i.e., the 'Prejudgment Start Date'). The postjudgment interest rate is the same as this fixed prejudgment rate.

### 4.2. Data Requirements

#### 4.2.1. Jurisdictional Interest Rate Data
To ensure that interest rates are always current and can be updated without redeploying the application, all rate data will be stored in a **Firebase Firestore database**.

* **Data Source:** The web application will fetch the interest rate table from Firestore upon initialization.
* **Data Unavailability:** If the application cannot fetch rate data from Firestore (e.g., due to network issues or service outage), it must **not** proceed with calculations. It should display a clear error message to the user indicating that the service is temporarily unavailable and disable calculation functionality until a connection can be re-established.
* **Firestore Data Structure:** The data will be stored in a collection named `interestRates`. Each document will represent a jurisdiction (e.g., `BC-COIA`, `ON-CJA`) and contain metadata.
    * **Document:** `interestRates/[JURISDICTION_ID]` (e.g., `interestRates/BC-COIA`)
    * **Fields:**
        * `sourceUrl`: (String) The URL where the data is scraped from.
        * `lastUpdated`: (Timestamp) The last time the data was successfully updated.
        * `rates`: (Array) The array of rate objects.

##### 4.2.1.1. British Columbia (BC)
The `BC-COIA` document will store an array of rate periods.

* **Array Element Structure:**
    ```json
    {
      "start": "YYYY-MM-DD",
      "end": "YYYY-MM-DD",
      "prejudgment": 5.40,
      "postjudgment": 7.30
    }
    ```

##### 4.2.1.2. Ontario (ON)
The `ON-CJA` document will store an array of quarterly rates.

* **Rate Application Rule:** The applicable rate for both prejudgment and postjudgment interest is determined by the rate in effect during the quarter in which the action was commenced (the "Prejudgment Start Date").
* **Array Element Structure:**
    ```json
    {
      "year": 2025,
      "quarter": "Q3",
      "start": "2025-07-01",
      "end": "2025-09-30",
      "rate": 5.0
    }
    ```
* **Historical Data Sample:**
    | Year | Quarter | Prejudgment Rate (%) |
    | :--- | :--- | :--- |
    | 2025 | Q3 | 5.0 |
    | 2025 | Q2 | 5.0 |
    | 2025 | Q1 | 5.0 |
    | 2024 | Q4 | 5.0 |
    | 2024 | Q3 | 5.0 |
    | 2024 | Q2 | 5.0 |
    | 2024 | Q1 | 5.0 |
    | 2023 | Q4 | 5.0 |
    | ...  | ... | ...  |

#### 4.2.2. Automated Rate Update Mechanism
A mechanism will be created to automatically keep the Firestore data current for all supported jurisdictions.

* **Automation Tool:** A **serverless function** (e.g., Google Cloud Function) will be developed and deployed.
* **Trigger Schedule:** The function will be configured to run on a schedule (e.g., quarterly for Ontario, semi-annually for BC).
* **Scraping Task:** The function's sole responsibility is to:
    1.  Access the official court/government websites for each jurisdiction:
        * **BC:** `https://www.bccourts.ca/supreme_court/about_the_supreme_court/Court_Order_Interest_Rates.aspx`
        * **ON:** `https://www.ontario.ca/page/prejudgment-and-postjudgment-interest-rates`
    2.  Scrape the latest interest rate data from the respective HTML tables.
    3.  Connect to the Firestore database.
    4.  Update the `rates` array in the corresponding jurisdiction document (`BC-COIA`, `ON-CJA`).
    5.  Include robust error handling and logging to notify administrators if the scraping or database update fails.

### 4.3. UI/UX Requirements
The application must achieve a pixel-perfect replication of the original application's visual design, layout, and component styling.

#### 4.3.1. General Layout
* **Page Background:** Light gray (`#e0e0e0`).
* **Content Area:** Centered on the screen, resembling a white paper sheet (`white`), with a subtle shadow (`box-shadow: 0 0 10px rgba(0,0,0,0.1)`).
* **Dimensions:** The main content area is fixed at `9.27in` width and `12in` height per page, with `0.75in` padding. The application must support multiple pages, indicated by "Page 1", "Page 2", etc., at the bottom center of each page.
* **Typography:**
    * **Font Family:** Primarily Arial, sans-serif.
    * **Base Font Size:** 10pt.
    * **Title Font Size:** 13pt.
    * **Text Color:** Black.

#### 4.3.2. Header Section
* **Checkboxes:** Left-aligned group for toggling calculation sections ("Calculate prejudgment interest", "Show postjudgment interest", "Show per diem"). Checkboxes must be custom styled with a blue border (`#3a7bc8`) and a blue checkmark (`#4a90e2`) when checked.
* **Case Info Inputs:** Right-aligned group for case details.
    * **Jurisdiction:** Dropdown with "British Columbia" and "Ontario".
    * **File No.:** Text input.
    * **Registry:** Text input, default value "Vancouver".
* **Title:** "Court Order Interest Act Calculator". The title must dynamically update based on the selected jurisdiction (e.g., to reflect the Ontario *Courts of Justice Act*).
* **Action Buttons:**
    * **Print Button:** Blue background (`#4a90e2`), white text.
    * **Clear Button:** Red background (`#e74c3c`), white text.
* **Input Field Styling:** Inputs will have a light blue background (`#e0f2f7`), no border, padding, and show a blue outline (`#3a7bc8`) on hover and a gray outline (`#a0a0a0`) on focus.

#### 4.3.3. Summary & Calculation Tables
* **Structure:** All tables (Summary, Prejudgment, Postjudgment) will have a consistent design with a light gray (`#f0f0f0`) header and 1px black borders on all cells.
* **Summary Table:** A three-column layout (Item, Date, Amount) for displaying totals.
* **Calculation Tables:** Five-column layout (Date, Description, Rate, Principal, Interest).
* **Special Damages Rows:** Must be dynamically added/removed within the prejudgment table. Rows contain editable inputs for Date, Description, and Amount, and a delete icon. These rows must also display calculated interest details (days, rate, interest) when applicable.

#### 4.3.4. Other UI Elements
* **Help Icons:** A small blue circle with a white `?`. Displays a tooltip with help text on hover.
* **Demo Mode Visuals:**
    * **Banner (Print Only):** A banner must appear at the top of the printed output (and print preview) explaining that mock rates are in use.
    * **Watermark (Screen & Print):** A large, semi-transparent, rotated "Mock Interest Rates" watermark must be overlaid on the main content area.

## 5. Non-Functional Requirements

* **Architecture:** The application must be built with a **decoupled architecture**. The core calculation logic must be separate from the UI presentation layer, allowing for independent testing and maintenance.
* **Code Quality & Documentation:**
    * **Style Guide:** Code must adhere to the Airbnb JavaScript Style Guide, enforced with a linter (e.g., ESLint).
    * **Documentation:** All public functions, classes, and modules must have JSDoc comments explaining their purpose, parameters, and return values.
    * **README:** The project README.md must include clear setup, development, testing, and deployment instructions.
* **Performance:** The UI must remain responsive, with calculations executing instantly upon user input changes.
* **Browser Compatibility:** The application must be fully functional and visually consistent on the latest versions of modern desktop browsers (Chrome, Firefox, Safari, Edge).
* **Accessibility:** The application should meet WCAG 2.1 Level AA guidelines where applicable, particularly concerning color contrast, keyboard navigation, and screen reader support.

## 6. Acceptance Criteria & Test Cases

The following test cases must pass to consider the implementation complete.

* **Test Case 1: Simple Prejudgment Calculation (BC)**
    * **Inputs:** Jurisdiction: BC, General Damages: $10,000, Prejudgment Start Date: 2023-01-01, Judgment Date: 2024-01-01
    * **Expected Output:** Total Prejudgment Interest: **$513.38**

* **Test Case 2: Calculation with Special Damages (BC)**
    * **Inputs:** Jurisdiction: BC, Prejudgment Start Date: 2023-02-01, Judgment Date: 2024-09-15, Special Damages as specified in original test case.
    * **Expected Logic:** Must correctly apply the 6-month batching rule for BC special damages.

* **Test Case 3: Postjudgment Calculation (BC)**
    * **Inputs:** Jurisdiction: BC, Total Judgment Amount: $12,345.67, Judgment Date: 2024-12-15, Postjudgment End Date: 2025-03-15
    * **Expected Output:** Total Postjudgment Interest: **$190.04**

* **Test Case 4: Standard Calculation (ON)**
    * **Inputs:** Jurisdiction: ON, General Damages: $25,000, Prejudgment Start Date: 2023-03-15 (Q1 2023), Judgment Date: 2025-01-15
    * **Expected Logic & Output:**
        * The system must identify the rate for Q1 2023 from the Ontario table (e.g., 5.0%).
        * This single rate must be applied for the entire prejudgment period from 2023-03-15 to 2025-01-14.
        * The calculation should not be segmented even though rates change in subsequent quarters.
