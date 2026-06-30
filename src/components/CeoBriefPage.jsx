const CARD = {
  background: 'var(--paper-raised)',
  border: '1px solid var(--rule)',
  borderRadius: 6,
  padding: '24px 28px',
  maxWidth: 760,
};

export default function CeoBriefPage() {
  return (
    <div style={CARD}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 0 }}>CEO Brief</h2>
      <p style={{ ...p, color: 'var(--ink-soft)', fontStyle: 'italic' }}>Written by the analyst, for the CEO. No code, no jargon.</p>

      <h3 style={h3}>What I built, and why it matters</h3>
      <p style={p}>
        Right now, the finance head converts every expense to USD by hand, by Googling rates one at a time. I built
        a small web tool that does this automatically: paste in expenses, and it instantly shows total spend by
        category, the biggest expense in each category, and the top three merchants, all in USD, ready to drop
        into the monthly board report. It also lets anyone on the team add a new expense and see the totals update
        immediately, and it has a slider that shows how much our spend would shift if the euro got stronger or
        weaker, which is useful for budgeting conversations.
      </p>

      <h3 style={h3}>Three trade-offs I made, and why</h3>
      <p style={p}>
        <strong>1. No persistence yet.</strong> New expenses you add disappear on refresh. I chose to spend my time
        on getting the math and the interface right first, since a wrong total is worse than a missing save button.
        Persistence is a known, well-understood next step.
      </p>
      <p style={p}>
        <strong>2. One static rate snapshot, not live rates.</strong> The brief asked for this, and it's the right
        call for a v1, it keeps the tool predictable and avoids the cost and fragility of a live currency API
        before we know the tool is even useful day to day.
      </p>
      <p style={p}>
        <strong>3. Desktop-first layout.</strong> The team demos this on laptops on Fridays, so I optimized for
        that screen first. It still works on a phone, just not beautifully yet.
      </p>

      <h3 style={h3}>Three priorities for next sprint, and expected impact</h3>
      <p style={p}>
        <strong>1. Save data permanently.</strong> Today the tool resets every time you reload the page. Fixing
        this turns it from a demo into something the finance head can actually rely on month to month.
      </p>
      <p style={p}>
        <strong>2. Live or scheduled rate updates.</strong> Manually refreshing the static snapshot monthly is
        fine for now, but automating it removes a recurring manual step entirely. That's the original problem we
        set out to solve.
      </p>
      <p style={p}>
        <strong>3. Edit and delete expenses.</strong> Right now you can only add rows. Mistakes happen, and not
        being able to correct a bad entry without rebuilding the page is the biggest day-to-day friction point
        I'd expect once real people start using this.
      </p>
    </div>
  );
}

const h3 = { fontSize: 15, fontWeight: 700, marginTop: 22, marginBottom: 6 };
const p = { fontSize: 14, lineHeight: 1.65, color: 'var(--ink)', margin: '0 0 8px' };
