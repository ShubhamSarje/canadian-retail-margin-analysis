import Reveal from './components/Reveal'
import CountUp from './components/CountUp'
import SqlToggle from './components/SqlToggle'
import {
  SplitChart, CategoryChart, FurnitureChart, SuspectsChart,
  ThresholdChart, ShipModeChart, GeographyChart,
} from './components/Charts'
import {
  categories, furniture, suspects, threshold, shipModes,
  geography, interventions, recommendations, sqlQueries, REPO_URL,
} from './data'

const money = (n) => (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-CA')

export default function App() {
  const worst = Math.max(...interventions.map((i) => Math.abs(i.profit)))

  return (
    <main>
      {/* 1 — Opening */}
      <section style={{ paddingTop: 'clamp(4rem, 12vw, 9rem)', paddingBottom: 'clamp(2rem, 5vw, 3rem)' }}>
        <div className="wrap measure">
          <Reveal>
            <span className="eyebrow">Margin analysis · SQL</span>
            <h1>A retailer looked mediocre.<br />It was hiding <em style={{ color: 'var(--terracotta)' }}>$1.1 million</em> in losses.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lede" style={{ marginTop: '1.6rem' }}>
              At a glance the business ran a thin 10.2% margin — the kind of number that gets
              written off as “this is just a low-margin sector.” It wasn’t. Half of every
              transaction was losing money, and the cause had nothing to do with pricing.
            </p>
            <p className="small" style={{ marginTop: '1.6rem', fontFamily: 'var(--mono)', fontSize: '0.82rem', letterSpacing: '0.03em' }}>
              Shubham Sarje · Data &amp; Business Analyst, Toronto
            </p>
          </Reveal>
        </div>

        <div className="wrap measure" style={{ marginTop: 'clamp(3rem, 7vw, 4.5rem)' }}>
          <Reveal delay={0.2}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', borderTop: '1px solid var(--rule)', paddingTop: '2rem' }}>
              <Figure value={<CountUp to={8399} />} label="transactions analysed" />
              <Figure value={<CountUp to={1102503} prefix="$" />} label="profit destroyed" tone="loss" />
              <Figure value={<><CountUp to={51} />%</>} label="of orders lost money" tone="loss" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 — Provenance */}
      <section className="tight" style={{ paddingTop: 0 }}>
        <div className="wrap measure">
          <Reveal>
            <p className="provenance">
              This analysis uses the <em>Superstore</em> sample dataset (Canadian variant) — synthetic
              data originally produced by Tableau Software for analytics training, covering 8,399
              transactions across 13 provinces between 2009 and 2012. The figures are illustrative
              rather than real business results. <strong>The method is the point of this project</strong>, not
              the findings themselves.
            </p>
          </Reveal>
        </div>
      </section>

      <hr className="rule" />

      {/* 3 — The split */}
      <section>
        <div className="wrap measure">
          <Reveal>
            <span className="eyebrow">01 — The split</span>
            <h2>It was never one business. It was two.</h2>
            <p className="lede">
              Separating profitable transactions from loss-making ones changes the entire diagnosis.
              The healthy half earns a <strong className="gain">24.6% margin</strong> — strong retail
              performance by any standard. The other half burns through it.
            </p>
          </Reveal>
        </div>
        <div className="wrap wide" style={{ marginTop: '2.6rem' }}>
          <Reveal delay={0.1}><SplitChart /></Reveal>
        </div>
        <div className="wrap measure" style={{ marginTop: '2rem' }}>
          <Reveal>
            <p>
              <strong>4,264 of 8,399 transactions — 51% — lose money</strong>, destroying{' '}
              <strong className="loss">{money(1102503)}</strong> and cutting company profit by 42%.
              This is not a competitiveness problem or a market problem. It is internal, and
              therefore fixable.
            </p>
            <SqlToggle sql={sqlQueries.split} />
          </Reveal>
        </div>
      </section>

      <hr className="rule" />

      {/* 4 — The hunt */}
      <section>
        <div className="wrap measure">
          <Reveal>
            <span className="eyebrow">02 — The hunt</span>
            <h2>Following the losses down.</h2>
            <p className="lede">
              Furniture and Technology generate almost identical revenue. Technology returns
              seven and a half times the profit.
            </p>
          </Reveal>
        </div>
        <div className="wrap wide" style={{ marginTop: '2.4rem' }}>
          <Reveal delay={0.1}><CategoryChart data={categories} /></Reveal>
        </div>
        <div className="wrap measure" style={{ marginTop: '2rem' }}>
          <Reveal>
            <p>
              Furniture accounts for 35% of revenue and 8% of profit. But “fix Furniture” is not
              an instruction anyone can act on — so the next question is which part of it.
            </p>
          </Reveal>
        </div>
        <div className="wrap wide" style={{ marginTop: '2.4rem' }}>
          <Reveal delay={0.1}><FurnitureChart data={furniture} /></Reveal>
        </div>
        <div className="wrap measure" style={{ marginTop: '2rem' }}>
          <Reveal>
            <p>
              <strong>Furniture isn’t broken — Tables and Bookcases are.</strong> Office Furnishings
              earns 14.4%, better than the company average. Two subcategories destroy{' '}
              <strong className="loss">{money(132644)}</strong> between them. The scope just narrowed
              from an entire category to two product lines.
            </p>
          </Reveal>
        </div>
      </section>

      <hr className="rule" />

      {/* 5 — The suspects */}
      <section>
        <div className="wrap measure">
          <Reveal>
            <span className="eyebrow">03 — The suspects</span>
            <h2>Two candidates. Only one survives.</h2>
            <p className="lede">
              The obvious explanation for lost margin is discounting. The second candidate is
              fulfilment cost. Both were tested directly against the same four subcategories.
            </p>
          </Reveal>
        </div>

        <div className="wrap wide" style={{ marginTop: '2.6rem' }}>
          <Reveal delay={0.1}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
              <div>
                <p className="tiny" style={{ marginBottom: '0.6rem', textDecoration: 'line-through' }}>
                  Suspect 1 — Average discount
                </p>
                <SuspectsChart data={suspects} metric="discount" />
                <p className="tiny" style={{ marginTop: '0.4rem' }}>
                  Flat at ~5% everywhere. Ruled out.
                </p>
              </div>
              <div>
                <p className="tiny" style={{ marginBottom: '0.6rem', color: 'var(--terracotta)' }}>
                  Suspect 2 — Average shipping cost
                </p>
                <SuspectsChart data={suspects} metric="shipping" />
                <p className="tiny" style={{ marginTop: '0.4rem' }}>
                  Tables cost 5.4× more to ship than Office Furnishings.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="wrap measure" style={{ marginTop: '2.4rem' }}>
          <Reveal>
            <p>
              Every subcategory discounts at roughly the same rate — Tables no more than the
              profitable Office Furnishings. Discounting cannot explain the difference.
            </p>
            <p>
              And the detail that settles it: <strong>Tables carry the highest base margin in the
              category at 69.3%</strong>, against Office Furnishings’ 52.6%. The product is not
              underpriced at source. The margin is created, then destroyed in fulfilment.
            </p>
            <SqlToggle sql={sqlQueries.suspects} />
          </Reveal>
        </div>
      </section>

      <hr className="rule" />

      {/* 6 — The threshold (centrepiece) */}
      <section style={{ background: '#F5F2EC', paddingTop: 'clamp(4.5rem, 11vw, 8rem)', paddingBottom: 'clamp(4.5rem, 11vw, 8rem)' }}>
        <div className="wrap measure">
          <Reveal>
            <span className="eyebrow">04 — The threshold</span>
            <h2>Margin falls off a cliff at $25.</h2>
            <p className="lede">
              If shipping cost is the driver, there should be a point where it overwhelms the
              margin. Grouping every transaction by what it cost to ship finds it.
            </p>
          </Reveal>
        </div>
        <div className="wrap wide" style={{ marginTop: '3rem' }}>
          <Reveal delay={0.15}><ThresholdChart data={threshold} /></Reveal>
        </div>
        <div className="wrap measure" style={{ marginTop: '2.4rem' }}>
          <Reveal>
            <p>
              Below $25, the business is healthy. Above it, margin collapses to 4.5%. Above $50 it
              turns negative — <strong className="loss">538 transactions, 6.4% of volume, destroying{' '}
              {money(131168)}</strong>.
            </p>
            <p>
              Note the shape: the <strong>$10–25 band is the strongest at 19.0%</strong>, not the
              cheapest one. Mid-sized orders carry enough value to absorb fulfilment while staying
              cheap to ship. Very low shipping cost means very small items with thin absolute profit.
            </p>
            <p>
              <strong>$25 is a number the business can use tomorrow</strong> — a review trigger, not
              an observation.
            </p>
            <SqlToggle sql={sqlQueries.threshold} />
          </Reveal>
        </div>
      </section>

      <hr className="rule" />

      {/* 7 — Corroboration */}
      <section>
        <div className="wrap measure">
          <Reveal>
            <span className="eyebrow">05 — Corroboration</span>
            <h2>The same answer, from two more directions.</h2>
            <p className="lede">
              A finding that only holds from one angle isn’t a finding. Joining the transaction
              data to the company’s shipping policy tests it against service-level targets.
            </p>
          </Reveal>
        </div>
        <div className="wrap wide" style={{ marginTop: '2.6rem' }}>
          <Reveal delay={0.1}><ShipModeChart data={shipModes} /></Reveal>
          <p className="tiny wrap measure" style={{ textAlign: 'center', marginTop: '0.4rem' }}>
            Grey = target margin · Coloured = actual
          </p>
        </div>
        <div className="wrap measure" style={{ marginTop: '2rem' }}>
          <Reveal>
            <p>
              <strong>Delivery Truck carries 42% of company revenue and returns 4.3% against a 10%
              target.</strong> Regular Air — used for small items — lands at 14.7% against 15%,
              essentially on target. The business performs where fulfilment is cheap and fails
              where it is expensive.
            </p>
            <SqlToggle sql={sqlQueries.shipMode} />
          </Reveal>
        </div>

        <div className="wrap measure" style={{ marginTop: 'clamp(3rem, 7vw, 4.5rem)' }}>
          <Reveal>
            <h3 style={{ marginBottom: '0.8rem' }}>But isn’t this just the cost of shipping across Canada?</h3>
            <p>
              It’s the obvious objection, and it’s worth answering directly rather than leaving it
              to the reader.
            </p>
          </Reveal>
        </div>
        <div className="wrap wide" style={{ marginTop: '2rem' }}>
          <Reveal delay={0.1}><GeographyChart regions={geography} /></Reveal>
        </div>
        <div className="wrap measure" style={{ marginTop: '2rem' }}>
          <Reveal>
            <p>
              Average shipping cost varies by about <strong>two dollars</strong> across all eight
              regions — including Nunavut and the Northwest Territories. Tables, meanwhile, cost{' '}
              <strong className="loss">$55–60 to ship in every single province</strong>.
            </p>
            <p>
              <strong>Distance is not the driver. Product characteristics are.</strong> That
              distinction matters operationally: the fix is a single national pricing change, not
              thirteen regional logistics negotiations.
            </p>
          </Reveal>
        </div>
      </section>

      <hr className="rule" />

      {/* 8 — Intervention list */}
      <section>
        <div className="wrap measure">
          <Reveal>
            <span className="eyebrow">06 — Where to start</span>
            <h2>Eight places to intervene first.</h2>
            <p className="lede">
              Product-and-province combinations that are both loss-making and large enough to
              matter — filtered to those above $50,000 in sales.
            </p>
          </Reveal>
        </div>
        <div className="wrap wide" style={{ marginTop: '2.4rem' }}>
          <Reveal delay={0.1}>
            <table className="data">
              <thead>
                <tr>
                  <th>Subcategory</th>
                  <th>Province</th>
                  <th className="num hide-sm">Sales</th>
                  <th className="num">Profit</th>
                  <th className="num hide-sm">Avg shipping</th>
                  <th className="num">Margin</th>
                </tr>
              </thead>
              <tbody>
                {interventions.map((r, i) => (
                  <tr key={i}>
                    <td>{r.subcategory}{r.exception && <span className="tiny" style={{ marginLeft: 6 }}>*</span>}</td>
                    <td className="small">{r.province}</td>
                    <td className="num hide-sm mono">{money(r.sales)}</td>
                    <td className="num barcell">
                      <span className="barfill" style={{ width: `${(Math.abs(r.profit) / worst) * 92}%` }} />
                      <span className="val mono loss">{money(r.profit)}</span>
                    </td>
                    <td className="num hide-sm mono">${r.shipping}</td>
                    <td className="num mono loss">{r.margin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
        <div className="wrap measure" style={{ marginTop: '1.8rem' }}>
          <Reveal>
            <p>
              The top fifteen combinations destroy <strong className="loss">{money(192144)}</strong>.
              Tables in Ontario alone accounts for {money(42423)} — the single largest concentrated
              loss in the business.
            </p>
            <p className="tiny">
              * Office Machines in Alberta is flagged as an exception — see below.
            </p>
            <SqlToggle sql={sqlQueries.intervention} />
          </Reveal>
        </div>
      </section>

      <hr className="rule" />

      {/* 9 — Recommendations */}
      <section>
        <div className="wrap measure">
          <Reveal>
            <span className="eyebrow">07 — Recommendations</span>
            <h2>What to do about it.</h2>
          </Reveal>
        </div>
        <div className="wrap measure" style={{ marginTop: '2.2rem' }}>
          {recommendations.map((r, i) => (
            <Reveal key={r.n} delay={i * 0.05}>
              <div style={{ display: 'flex', gap: '1.4rem', padding: '1.3rem 0', borderBottom: '1px solid var(--rule-soft)' }}>
                <div className="serif-num" style={{ fontSize: '1.5rem', color: 'var(--ink-faint)', minWidth: '1.6rem', lineHeight: 1.2 }}>
                  {r.n}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>{r.action}</div>
                  <div className="small">{r.note}</div>
                </div>
                <div className="serif-num" style={{ fontSize: '1.15rem', color: 'var(--blue)', whiteSpace: 'nowrap', alignSelf: 'center' }}>
                  {r.impact}
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.1}>
            <div style={{ marginTop: '2.4rem', paddingTop: '1.6rem', borderTop: '1px solid var(--rule)' }}>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Estimated recoverable annual profit</p>
              <div className="serif-num" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.4rem)', lineHeight: 1.1, color: 'var(--sage)' }}>
                $600,000 – $1,100,000
              </div>
              <p style={{ marginTop: '1.2rem' }}>
                Because the cost driver is product-based rather than geographic, remediation can be
                applied as a single national pricing change rather than thirteen regional ones.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="rule" />

      {/* 10 — Exceptions */}
      <section className="tight">
        <div className="wrap measure">
          <Reveal>
            <span className="eyebrow">08 — Exceptions and limitations</span>
            <p className="small" style={{ marginBottom: '1.4rem' }}>
              Two results do not fit the shipping-cost explanation. They are reported rather than
              omitted.
            </p>
            <div style={{ borderLeft: '2px solid var(--rule)', paddingLeft: '1.15rem' }}>
              <p className="small">
                <strong>Office Machines in Alberta</strong> loses $15,217 despite a low $19.70 average
                shipping cost. This points to a pricing or discount issue specific to that market and
                requires separate investigation.
              </p>
              <p className="small">
                <strong>“Critical” priority orders</strong> are the least profitable at 6.7% margin, yet
                their shipping costs are normal (~$13). The cause lies outside fulfilment — possibly
                rush sourcing or partial shipments — and is not explained by this analysis.
              </p>
              <p className="small">
                <strong>Data limitation:</strong> delivery time showed no variance across shipping modes
                (all 2.0 days), so fulfilment speed could not be assessed as a factor.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 11 — About */}
      <section className="tight" style={{ paddingBottom: 'clamp(4rem, 9vw, 6rem)' }}>
        <div className="wrap measure">
          <Reveal>
            <div className="about-grid">
              <h3 style={{ marginBottom: '1.2rem' }}>About</h3>
              <p className="about-line"><strong>Shubham Sarje</strong> — Data &amp; Business Analyst, Toronto</p>
              <p className="about-line small">
                <span className="about-label">Approach:</span> Start with a business question, follow
                the evidence rather than the assumption, and stop only when the recommendation is
                specific enough to act on.
              </p>
              <p className="about-line small">
                <span className="about-label">Background:</span> Accounting-trained (B.Com) with dual
                post-graduate analytics credentials (4.0 GPA, Durham College) — which is why margin,
                cost structure, and profitability analysis are natural territory. Currently a
                Technical &amp; Customer Experience Analyst at Transcom.
              </p>
              <p className="about-line small">
                <span className="about-label">Toolkit:</span> SQL (PostgreSQL) · Power BI · Tableau ·
                Excel <em>(certified)</em> · Python
              </p>
              <p className="small" style={{ marginTop: '1.4rem' }}>
                <a href="https://linkedin.com/in/shubhamsarje">LinkedIn</a> ·{' '}
                <a href={REPO_URL}>Full analysis and SQL on GitHub</a> · shubham.s.sarje@gmail.com
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}

function Figure({ value, label, tone }) {
  return (
    <div>
      <div className="serif-num" style={{
        fontSize: 'clamp(2rem, 5vw, 2.9rem)',
        lineHeight: 1.05,
        color: tone === 'loss' ? 'var(--terracotta)' : 'var(--ink)',
      }}>
        {value}
      </div>
      <div className="tiny" style={{ marginTop: '0.4rem' }}>{label}</div>
    </div>
  )
}
