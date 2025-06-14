# Product Requirements Document: Court Order Interest Calculator

## 1. Introduction

This Product Requirements Document (PRD) outlines the detailed specifications for recreating the "Court Order Interest Calculator" application. The goal is to replicate the existing application's user interface and functionality precisely, while implementing a new, improved architecture and comprehensive documentation to facilitate future enhancements and maintainability. This document serves as a blueprint for development, ensuring all visual and interactive aspects of the original application are captured.

## 2. Application Overview

The "Court Order Interest Calculator" is a web-based tool designed to calculate prejudgment and postjudgment interest based on specific dates, principal amounts, and jurisdiction-defined interest rates. It provides a clear, printable summary of calculations, including the ability to add and manage special damages.

### 2.1 Target Users and Goals
*   **Target Users:** BC lawyers.
*   **Key Goals:** To quickly calculate interest on court order payments and judgments, including calculating interest on special damages in accordance with the specific rules of the BC Court Order Interest Act.

*   **Application Name:** Court Order Interest Calculator
*   **Primary Goal:** To accurately calculate and display court order interest, providing a user-friendly interface for inputting relevant financial and date information.
*   **Target Audience:** Legal professionals, paralegals, and individuals requiring precise interest calculations for court orders.

## 3. User Interface (UI) and Appearance

The application features a clean, paper-like design, centered on the screen, mimicking a physical document.

### 3.1 General Layout

*   **Page Background:** Light gray (`--page-background-color: #e0e0e0`).
*   **Content Area:** Centered on the screen, resembling a white paper sheet (`--paper-background-color: white`), with a subtle shadow (`box-shadow: 0 0 10px rgba(0,0,0,0.1)`).
*   **Dimensions:** The main content area is fixed at `9.27in` width and `12in` height per page, with `0.75in` padding. The application supports multiple pages, indicated by "Page 1", "Page 2", etc., at the bottom center of each page.
*   **Font Family:** Primarily Arial, sans-serif (`--font-family: Arial, sans-serif`).
*   **Base Font Size:** 10pt (`--base-font-size: 10pt`).
*   **Title Font Size:** 13pt (`--title-font-size: 13pt`).
*   **Text Color:** Black (`--text-color: black`).
*   **Spacing:** A base spacing unit of `4pt` is used for consistent layout.

### 3.2 Header Section

*   **Checkboxes (Left-aligned):**
    *   "Calculate prejudgment interest" (checked by default)
    *   "Show postjudgment interest" (checked by default)
    *   "Show per diem" (checked by default)
    *   **Checkbox Styling:** Custom styled checkboxes with a blue border (`#3a7bc8`), white background, and a checkmark (`✓`) in blue (`#4a90e2`) when checked.
*   **Input Fields (Right-aligned):**
    *   **Jurisdiction:** Dropdown with "British Columbia" selected by default.
        *   Label: "Jurisdiction" (normal weight).
        *   Value: Right-aligned dropdown.
    *   **File No.:** Text input field.
        *   Label: "File No." (normal weight).
        *   Value: Right-aligned text input.
    *   **Registry:** Text input field, default value "Vancouver".
        *   Label: "Registry" (bold).
        *   Value: Right-aligned text input.
*   **Input Field Styling:** Inputs have a light blue background (`--input-background-color: #e0f2f7`), no border, and padding. On hover, they show a 1px solid blue outline (`#3a7bc8`). On focus, they show a 1px solid gray outline (`--focus-outline-color: #a0a0a0`).
*   **Title:** "BC *Court Order Interest Act* Calculator" (bold, italicized "Court Order Interest Act"). Centered.
*   **Action Buttons (Right of Title):**
    *   **Print Button:** Blue background (`#4a90e2`), white text, "Print" label. Positioned at top-right of title container.
    *   **Clear Button:** Red background (`#e74c3c`), white text, "Clear" label. Positioned below Print button.
    *   **Button Styling:** Rounded corners, bold text, hover effects (darker background), active effects (slight scale down).
*   **Demo Watermark:** "DEMONSTRATION" text, large, semi-transparent red, rotated, centered over the main content area.

### 3.3 Summary Table

*   **Structure:** A table with three columns: Item Label (left-aligned), Date (center-aligned, often empty), and Amount (right-aligned).
*   **Rows:**
    *   "General Damages & Debt": Editable amount input (e.g., "$10,000.00").
    *   "Special Damages": Display-only amount (e.g., "$580.30"). Includes a hidden help icon.
    *   "Non-pecuniary Damages": Editable amount input (e.g., "$0.00").
    *   "Costs & Disbursements": Editable amount input (e.g., "$0.00").
    *   "Prejudgment Interest": Display-only amount (e.g., "$1,561.55"). Includes a date input labeled "from" (e.g., "2019-04-14") and a help icon with tooltip "Cause of Action Date. Prejudgment interest will start to accrue from this date."
    *   "Postjudgment Interest": Display-only amount (e.g., "$344.09"). Includes a date input labeled "until" (e.g., "2025-06-14") and a help icon with tooltip "Accrual Date. Postjudgment interest will accrue up to this date."
*   **Footer:**
    *   "TOTAL AS OF [Date]": Bold, right-aligned, spans two columns. Total amount (bold, right-aligned).
    *   "Per Diem": Italic, right-aligned, spans two columns. Per diem amount (italic, right-aligned).
*   **Judgment Date:** A bold date input field "Judgment Date" (e.g., "2024-12-11") positioned above the summary table.

### 3.4 Interest Calculation Tables (Prejudgment and Postjudgment)

*   **Structure:** Tables with five columns: Date, Description, Rate, Principal, and Interest.
*   **Header Styling:** Light gray background (`--table-header-background-color: #f0f0f0`), bold, centered text.
*   **Cell Styling:** All cells have a 1px solid black border (`--border-color: black`).
*   **Prejudgment Table (`#prejudgmentTable`):**
    *   **Date Column:** Left-aligned.
    *   **Description Column:** Left-aligned. Contains a "Description" text or a dynamic text (e.g., "79 days") and an "add special damages" button.
    *   **Rate Column:** Center-aligned, displays interest rate (e.g., "2.30%").
    *   **Principal Column:** Right-aligned, displays principal amount (e.g., "$10,000.00").
    *   **Interest Column:** Right-aligned, displays calculated interest (e.g., "$49.78").
    *   **Special Damages Rows:** Inserted dynamically.
        *   Date input (`custom-date-input`).
        *   Description input (`special-damages-description`).
        *   Amount input (`special-damages-amount`).
        *   Delete icon (red trash can icon) for removing the row.
        *   These rows can also display interest calculation details (days, rate, interest) for the special damage amount.
    *   **Footer:** Displays "Total: [X] days", "Principal Total", and "Interest Total" for the prejudgment period.
*   **Postjudgment Table (`#postjudgmentTable`):**
    *   Similar structure to the prejudgment table.
    *   **Footer:** Displays "Total: [X] days", "Principal Total", and "Interest Total" for the postjudgment period.

### 3.5 Other UI Elements

*   **Help Icons:** Small blue circles with a white question mark (`?`). On hover, they display a tooltip with additional information.
*   **"Buy Now" Button:** Large green button (`#4CAF50`) with white text, positioned centrally at the top of the screen (initially hidden or overlaid). It has a subtle breathing shadow and shimmer animation.
*   **Demo Banner:** A yellow banner (`#ffeb3b`) at the top of the screen, stating "CAUTION: Demo uses mock interest rates", with a "Buy Now - $24.99" button and a close icon. This banner slides down from the top.

## 4. Functionality

The application's core functionality revolves around calculating interest based on user inputs and displaying the results.

### 4.1 Core Features

Based on the target users and their goals, the following features are essential for the Court Order Interest Calculator:

1.  **Principal Amount Input (Must-Have):** Field to enter the initial judgment or payment amount.
2.  **Start Date Input (Must-Have):** Field to specify the date from which interest calculation begins.
3.  **End Date Input (Must-Have):** Field to specify the date until which interest is calculated.
4.  **Interest Rate Display/Selection (Must-Have):** Display of the applicable BC Court Order interest rates, possibly with an option to select a specific rate if multiple apply over time.
5.  **Automatic Rate Application (Must-Have):** Automatic application of historical BC Court Order interest rates based on the start and end dates.
6.  **Special Damages Calculation Toggle (Must-Have):** An option or separate section to specifically calculate interest on special damages, adhering to the BC Court Order Interest Act's rules (e.g., interest from the date of notice).
7.  **Compound/Simple Interest Option (Must-Have):** Clear indication or selection for simple interest calculation as per the Act.
8.  **Detailed Breakdown Output (Must-Have):** Display of the total interest calculated, along with a breakdown showing how interest accrues over different periods if rates change.
9.  **Export/Print Functionality (Must-Have):** Option to export the calculation results (e.g., to PDF or a printable format) for legal documentation.
10. **Clear Error Handling/Validation (Nice-to-Have):** User-friendly messages for invalid inputs (e.g., end date before start date, non-numeric inputs).

### 4.2 User Inputs and Controls

*   **Checkboxes:**
    *   `Calculate prejudgment interest`: When unchecked, the "Prejudgment Interest Calculations" section and the "Prejudgment Interest" row in the summary table should be hidden.
    *   `Show postjudgment interest`: When unchecked, the "Postjudgment Interest Calculations" section and the "Postjudgment Interest" row in the summary table should be hidden.
    *   `Show per diem`: When unchecked, the "Per Diem" row in the summary table should be hidden.
*   **Text Inputs:**
    *   `File No.`, `Registry`, `General Damages & Debt`, `Non-pecuniary Damages`, `Costs & Disbursements`: Allow free-form text or numerical input. Currency inputs should automatically format to currency (e.g., "$10,000.00").
*   **Date Inputs:**
    *   `Judgment Date`, `Prejudgment Interest (from)`, `Postjudgment Interest (until)`, `Special Damages Date`: Should use a date picker (Flatpickr was used in the original, but the specific library is not a requirement for the PRD, just the functionality). Input format YYYY-MM-DD.
*   **Jurisdiction Select:** A dropdown to select the jurisdiction. Currently, only "British Columbia" is an option. Future versions may include more.
*   **Add Special Damages Button:** Clicking this button adds a new row to the "Prejudgment Interest Calculations" table, allowing the user to input a date, description, and amount for special damages.
*   **Delete Special Damages Icon:** Clicking the trash can icon next to a special damages entry removes that row from the table.

### 4.3 Calculation Logic (High-Level)

*   **Interest Calculation:** The application calculates interest based on:
    *   **Principal Amount:** The base amount on which interest is calculated. This changes as special damages are added or removed.
    *   **Interest Rate:** Varies by period, as shown in the tables. The rates are determined by the selected jurisdiction and the specific date ranges.
    *   **Number of Days:** The duration for which interest is calculated for each period.
*   **Prejudgment Interest:** Calculated from the "Prejudgment Interest (from)" date up to the "Judgment Date". Special damages are incorporated into the principal from their respective dates.
*   **Postjudgment Interest:** Calculated from the "Judgment Date" up to the "Postjudgment Interest (until)" date.
*   **Totals:**
    *   `TOTAL AS OF [Date]`: Sum of General Damages & Debt, Special Damages, Non-pecuniary Damages, Costs & Disbursements, Prejudgment Interest, and Postjudgment Interest.
    *   `Per Diem`: The daily interest accrual rate based on the current total.
*   **Dynamic Updates:** All calculations and displayed totals should update dynamically as the user changes inputs (dates, amounts, checkboxes).

### 4.4 Buttons Functionality

*   **Print Button:** Triggers the browser's print functionality, formatting the page for printing (e.g., removing screen-only elements, adjusting layout for paper size).
*   **Clear Button:** Resets all input fields to their default or empty states and clears all calculated values and dynamically added rows (e.g., special damages).
*   **Buy Now Button (Demo Mode):** This button is part of the demo experience. Its exact backend functionality is out of scope for this PRD, but on the frontend, it should visually indicate a call to action for purchasing the full version.

## 5. Data Handling (Frontend Perspective)

*   **Input Validation:** Dates should be validated for correct YYYY-MM-DD format. Amounts should be validated as numerical and formatted as currency.
*   **Currency Formatting:** All monetary values should be displayed with a currency symbol (e.g., "$") and two decimal places, with thousands separators. Negative currency values should be displayed in red.
*   **State Management:** The application's state (input values, calculated results, visibility of sections) must be managed efficiently to ensure dynamic updates and accurate calculations.

## 6. Non-Functional Requirements

*   **Improved Architecture:** The new implementation should prioritize a modular, scalable, and maintainable codebase. This includes clear separation of concerns (UI, business logic, data handling), use of modern web development best practices, and potentially a suitable framework (e.g., React, Vue, Angular) or a well-structured vanilla JavaScript approach.
*   **Comprehensive Documentation:** The codebase must be thoroughly documented, including inline comments, JSDoc (or similar) for functions/components, and a clear project README.md.
*   **Exact Interface and Functionality Replication:** The new application must visually and functionally match the provided HTML snapshot and screenshot precisely. Any deviation in appearance or user interaction is considered a bug.
*   **Performance:** The application should be responsive and perform calculations efficiently, even with a large number of special damages entries.
*   **Accessibility:** Basic accessibility standards should be considered to ensure usability for a wider range of users.
*   **Responsiveness:** While the current version hides content on small screens, the new version should ideally be responsive or at least gracefully handle different screen sizes, or clearly indicate its intended desktop-only use if that's the design choice. (Based on the current HTML, it seems to be designed for larger screens, with a `mobile-detection-message` that hides content on small screens. This behavior should be replicated or improved upon if feasible within the scope).
</response>
</plan_mode_respond>
