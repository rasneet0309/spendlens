// currency.js, all conversion logic lives here, in one place, so the
// "what if a 25th currency shows up" and "what if a rate is missing"
// questions only have one file to touch.

/**
 * Convert a foreign-currency amount to USD using a rates table.
 * RATES is stored as "units of currency per 1 USD" (e.g. INR: 83.47),
 * so USD value = amount / rate.
 *
 * Guards:
 * - missing / null / undefined / 0 / NaN rate -> conversion is marked invalid
 *   instead of throwing or silently returning Infinity/garbage.
 * - negative or non-numeric amount -> also marked invalid, caller decides
 *   how to surface that (we exclude invalid rows from totals and flag them
 *   in the table, see EdgeCases doc).
 */
export function toUSD(amount, currency, rates) {
  const rate = rates[currency];
  const validRate = typeof rate === 'number' && isFinite(rate) && rate > 0;
  const validAmount = typeof amount === 'number' && isFinite(amount);

  if (!validRate || !validAmount) {
    return { value: null, valid: false };
  }
  return { value: amount / rate, valid: true };
}

export function formatUSD(value) {
  if (value === null || value === undefined || !isFinite(value)) return '—';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatOriginal(amount, currency) {
  if (typeof amount !== 'number' || !isFinite(amount)) return `— ${currency ?? ''}`.trim();
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

/**
 * Build the category summary table: per-category count, USD total, and
 * largest single transaction, sorted by USD total descending.
 * Accepts an optional rates override (used by the EUR what-if slider).
 */
export function buildCategorySummary(expenses, rates) {
  const byCategory = {};

  for (const exp of expenses) {
    const { value, valid } = toUSD(exp.amount, exp.currency, rates);
    if (!valid) continue; // invalid rows are excluded from totals, not silently zeroed

    if (!byCategory[exp.category]) {
      byCategory[exp.category] = { category: exp.category, count: 0, totalUSD: 0, largest: null };
    }
    const bucket = byCategory[exp.category];
    bucket.count += 1;
    bucket.totalUSD += value;
    if (!bucket.largest || value > bucket.largest.usd) {
      bucket.largest = { merchant: exp.merchant, usd: value };
    }
  }

  return Object.values(byCategory).sort((a, b) => b.totalUSD - a.totalUSD);
}

export function buildOverallTotal(expenses, rates) {
  return expenses.reduce((sum, exp) => {
    const { value, valid } = toUSD(exp.amount, exp.currency, rates);
    return valid ? sum + value : sum;
  }, 0);
}

export function buildTopMerchants(expenses, rates, topN = 3) {
  const byMerchant = {};
  for (const exp of expenses) {
    const { value, valid } = toUSD(exp.amount, exp.currency, rates);
    if (!valid) continue;
    byMerchant[exp.merchant] = (byMerchant[exp.merchant] || 0) + value;
  }
  return Object.entries(byMerchant)
    .map(([merchant, totalUSD]) => ({ merchant, totalUSD }))
    .sort((a, b) => b.totalUSD - a.totalUSD)
    .slice(0, topN);
}
