# COIAC.v2
A rebuild of the original COIAC (started June 14, 2025)


### Opus says (on June 14, 2025):

After reviewing the PRD against the HTML snapshot, here's my assessment:

## The PRD is excellent for UI replication but has significant gaps for backend implementation

### ✅ Strengths - Sufficient for UI Replication:

1. __Visual Design__ - Exceptionally detailed with:

   - Exact CSS values (colors, dimensions, fonts, spacing)
   - Precise layout specifications for all components
   - Clear styling rules and hover/focus states
   - Proper documentation of the paper-like skeuomorphic design

2. __Component Structure__ - All UI elements are thoroughly documented:

   - Every input field, checkbox, and button
   - Table structures with column specifications
   - Special damages row functionality
   - Demo mode elements and watermarks

3. __User Features__ - Well-defined requirements that align with BC lawyers' needs

### ❌ Gaps - Insufficient for Backend Implementation:

1. __Interest Rate Data__:

   - The PRD lacks the actual BC Court Order interest rates
   - The HTML shows specific rates (2.30%, 1.55%, 0.80%, etc.) by date ranges, but these aren't in the PRD
   - Without this data table, accurate calculations are impossible

2. __Calculation Logic__:

   - No mathematical formulas provided
   - Doesn't specify simple vs. compound interest calculation
   - Per diem calculation method not explained
   - Missing details on how interest accumulates across rate changes

3. __Business Rules__:

   - How special damages affect the principal from their entry date
   - Date range handling (inclusive/exclusive)
   - Edge case handling (e.g., invalid date combinations)
   - How multiple special damages interact with changing interest rates

4. __Data Flow__:

   - No specification of calculation order or dependencies
   - Missing state management details
   - Unclear which changes trigger recalculation

### Recommendation:

The PRD __successfully achieves its stated goal__ of documenting the interface for exact replication. However, to build a functional backend without copying the original code, you need:

1. __Interest Rate Table__: Historical BC Court Order Interest Act rates by date range
2. __Calculation Specification__: Mathematical formulas and worked examples
3. __Business Logic Document__: Rules for special damages, date handling, and edge cases
4. __Test Cases__: Input/output examples to verify calculation accuracy

The PRD is sufficient for a frontend developer to recreate the UI pixel-perfect, but a backend developer would need to reverse-engineer the calculation logic from the HTML's output values, which risks inaccuracy and doesn't align with the goal of creating a "new better structured back end."


