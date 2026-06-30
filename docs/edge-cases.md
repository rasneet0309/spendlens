# Edge Cases & Failure Modes

Bonus section, adversarial review of the dashboard before handoff.

### 1. Zero or negative amount
- **What could go wrong:** A typo like "-50" or "0" for an expense would distort totals (negative spend silently reducing a category total) or contribute a meaningless $0 line.
- **How the code handles it:** The Add Expense form rejects amount ≤ 0 before it ever reaches state, with an inline error.
- **Correct behaviour:** Block submission with a clear message. (Existing seed data has no such rows, so this only applies to user-added entries.)

### 2. Merchant name with special characters / HTML
- **What could go wrong:** A merchant like `<script>alert(1)</script>` or "O'Brien & Sons" could break rendering or, in a less careful app, enable a script-injection attack.
- **How the code handles it:** React escapes all text content by default, so injected HTML/JS renders as inert text, not executable code. No additional sanitization was added.
- **Correct behaviour:** Current behaviour is already correct for display; if this data were ever sent to a backend, it would still need server-side sanitization.

### 3. Rate is null, undefined, or missing for a currency
- **What could go wrong:** Dividing by undefined produces `NaN`, which would silently corrupt every total it touches with no visible error.
- **How the code handles it:** `toUSD()` validates the rate is a finite number > 0 before dividing; invalid rows return `{ valid: false }` and are excluded from totals.
- **Correct behaviour:** Exclude from totals and flag the row explicitly ("rate unavailable") rather than hiding or mis-stating it. Implemented.

### 4. Add-expense form submitted with empty fields
- **What could go wrong:** An empty merchant name or missing date would create a confusing blank row in the table.
- **How the code handles it:** Each required field (merchant, amount, date) is validated before the row is added; the first failing check shows a specific error.
- **Correct behaviour:** Reject with a specific, field-level message. Implemented for merchant, amount, and date. Currency/category cannot be empty since they're dropdowns.

### 5. Very large amounts causing display overflow
- **What could go wrong:** A 50,000,000 JPY entry, or a typo like 9999999999, could push a table cell wider than its column, breaking the layout.
- **How the code handles it:** Amounts use tabular-number monospace formatting with thousands separators, and the table's wrapping container allows horizontal scroll rather than wrapping awkwardly.
- **Correct behaviour:** Current behaviour holds up reasonably well; a stricter version would cap display precision and use abbreviated notation (e.g. "1.2M") above a threshold.

### 6. Filtering with no results
- **What could go wrong:** If a category filter matched zero rows (e.g. after deleting the only entry in a category, a feature not yet built), the table would render as a confusing empty white box.
- **How the code handles it:** `ExpenseTable` explicitly checks for a zero-length row list and renders a plain-language "No expenses match this filter" message instead of an empty table.
- **Correct behaviour:** Show an explicit empty state, not a blank table. Implemented.

### 7. Narrow mobile screen
- **What could go wrong:** A 5-column table and a multi-field form can overflow a 360px-wide screen, forcing awkward pinch-zooming.
- **How the code handles it:** The table sits in a horizontally scrollable container so it never breaks page layout; the form and summary cards use CSS grid with auto-fit so they reflow to a single column.
- **Correct behaviour:** Acceptable for v1 (scroll-to-see-table); a more polished version would convert the table to a stacked card layout below ~480px.

### 8. Duplicate or near-simultaneous "Add expense" submissions
- **What could go wrong:** Double-clicking "Add expense" (e.g. on a slow connection) could add the same expense twice with no warning.
- **How the code handles it:** Not currently handled, each submit adds a new row unconditionally with a fresh incrementing id.
- **Correct behaviour:** Disable the submit button momentarily after click, or de-duplicate identical merchant+amount+date+currency entries within a short window.

### 9. EUR what-if slider at the extremes (0.80 / 1.10)
- **What could go wrong:** At the slider edges, a large swing in the EUR rate could make the "vs base rate" delta look alarming out of context for a CEO skimming the dashboard.
- **How the code handles it:** The delta is shown with a sign and percentage so the direction and magnitude are unambiguous, and it only affects EUR-denominated rows, other currencies are untouched, which is called out in the slider copy.
- **Correct behaviour:** Current behaviour is correct; worth adding a one-line caption clarifying this is a simulation, not a saved rate change, if confusion shows up in testing.
