# Findings Log — Canadian Retail Margin Analysis

**Dataset:** *Superstore* sample dataset (Canadian variant) — 8,399 transactions | 13 provinces | 2009–2012
**Nature:** Synthetic data created by Tableau Software for analytics training. Figures are illustrative, not real business results.
**Database:** PostgreSQL (Supabase)
**Analyst:** Shubham Sarje

---

# PART 1 — THE CORE DIAGNOSIS

## Finding 1 — The business looks mediocre on the surface

| Metric | Value |
|---|---|
| Total transactions | 8,399 |
| Total sales | $14,915,601 |
| Total profit | $1,521,768 |
| **Overall margin** | **10.2%** |

*Query: `03_overall_health`*

A 10.2% net margin is thin for retail. Is the whole business underperforming, or is a healthy business being dragged down by a subset of transactions?

---

## Finding 2 — It is actually two businesses in one

| Outcome | Transactions | Sales | Profit | Margin |
|---|---|---|---|---|
| Profitable | 4,135 | $10,669,516 | $2,624,271 | **24.6%** |
| Loss-making | 4,264 | $4,246,085 | **-$1,102,503** | -26.0% |

*Query: `04_profit_split`*

**The central finding.** The profitable half runs a healthy 24.6% margin. But **51% of all transactions lose money**, destroying $1.1M and cutting company profit by 42%. The problem is internal and controllable.

---

## Finding 3 — Losses concentrate in Furniture

| Category | Transactions | Sales | Profit | Margin |
|---|---|---|---|---|
| Furniture | 1,724 | $5,178,591 | $117,433 | **2.3%** |
| Office Supplies | 4,610 | $3,752,762 | $518,021 | 13.8% |
| Technology | 2,065 | $5,984,249 | $886,314 | 14.8% |

*Query: `05_loss_by_category`*

Furniture and Technology generate near-identical revenue, but Technology produces **7.5× the profit**. If Furniture merely matched Office Supplies' margin, it would add roughly **$597,000** annually.

---

## Finding 4 — Furniture is not broken; Tables and Bookcases are

| Subcategory | Sales | Profit | Margin |
|---|---|---|---|
| Tables | $1,896,008 | **-$99,062** | **-5.2%** |
| Bookcases | $822,652 | **-$33,582** | **-4.1%** |
| Chairs & Chairmats | $1,761,837 | $149,650 | 8.5% |
| Office Furnishings | $698,094 | $100,428 | **14.4%** |

*Query: `06_furniture_breakdown`*

Office Furnishings outperforms the company average. Damage is isolated to two subcategories destroying **$132,644** in profit. This reframes the problem from "fix Furniture" to "fix Tables and Bookcases."

---

## Finding 5 — Root cause: shipping cost, not discounting

| Subcategory | Avg Discount | Avg Shipping | Base Margin | Actual Margin |
|---|---|---|---|---|
| Tables | 5.0% | **$57.29** | 69.3% | -5.2% |
| Bookcases | 4.8% | $45.75 | 66.0% | -4.1% |
| Chairs & Chairmats | 5.0% | $40.19 | 63.5% | 8.5% |
| Office Furnishings | 4.9% | **$10.66** | 52.6% | 14.4% |

*Query: `07_tables_root_cause`*

- **Discounting ruled out** — all subcategories discount at ~5%.
- **Shipping cost is the driver** — Tables cost 5.4× more to ship than Office Furnishings.
- **Tables have the highest base margin (69.3%)** yet still lose money. The product is not underpriced; fulfilment destroys the margin after the sale.

---

## Finding 6 — The break-even threshold is $25 shipping cost

| Shipping Band | Transactions | Avg Shipping | Sales | Profit | Margin |
|---|---|---|---|---|---|
| Under $10 | 5,944 | $4.61 | $4,185,274 | $572,198 | 13.7% |
| $10–25 | 1,259 | $16.95 | $4,977,739 | $945,154 | **19.0%** |
| $25–50 | 658 | $36.20 | $3,040,636 | $135,584 | 4.5% |
| Over $50 | 538 | $65.61 | $2,711,952 | **-$131,168** | **-4.8%** |

*Query: `08_shipping_threshold`*

Margin collapses above $25 and turns negative above $50. **538 transactions (6.4% of volume) destroy $131,168.** The $10–25 band is healthiest at 19.0% — mid-sized orders are the best business.

**$25 is a usable operational review trigger.**

---

## Finding 7 — Freight shipping misses its target by more than half

| Ship Mode | Target Margin | Actual Margin | Gap | Sales |
|---|---|---|---|---|
| Delivery Truck (Freight) | 10.0% | **4.3%** | **-5.7 pts** | $6,224,879 |
| Express Air (Expedited) | 20.0% | 12.4% | -7.6 pts | $1,184,419 |
| Regular Air (Standard) | 15.0% | 14.7% | -0.3 pts | $7,506,303 |

*Query: `10_join_shipping_performance` — JOIN to `shipping_policy`*

Delivery Truck carries **42% of company revenue** at less than half its target margin. Regular Air, used for small items, hits target almost exactly. Confirms the diagnosis from a second, independent angle.

---

## Finding 8 — Shipping cost is product-driven, NOT distance-driven

**This is the finding that closes the argument.**

| Dimension | Avg Shipping Cost Range |
|---|---|
| Across all 8 regions | $12.23 – $13.78 |
| Across all 13 provinces | $11.41 – $14.08 |
| **Tables specifically** | **$54.98 – $59.90** |

*Queries: `12_regional_performance`, `13_province_performance`, `21_high_risk_flags`*

**Interpretation:** Shipping cost barely varies by geography — a spread of about $2 nationwide, including remote territories. But Tables consistently cost $55–60 to ship *in every province*.

This eliminates distance and remoteness as explanations. The cost is driven by **product characteristics — size, weight, and freight handling** — not by destination. Any fix must therefore address product pricing and fulfilment method, not regional logistics.

---

# PART 2 — SUPPORTING ANALYSIS

## Finding 9 — Profit contribution by subcategory

**Biggest profit destroyers:**

| Subcategory | Profit | Share of Company Profit |
|---|---|---|
| Tables | -$99,062 | **-6.5%** |
| Bookcases | -$33,582 | -2.2% |
| Scissors, Rulers & Trimmers | -$7,799 | -0.5% |

**Biggest profit contributors:**

| Subcategory | Profit | Share | Margin |
|---|---|---|---|
| Telephones & Communication | $316,952 | 20.8% | 16.8% |
| Office Machines | $307,713 | 20.2% | 14.2% |
| Binders & Binder Accessories | $307,413 | 20.2% | **30.1%** |

*Query: `11_profit_contribution` — CTE*

Three subcategories generate **61% of all company profit**. Tables alone erase 6.5% of it.

---

## Finding 10 — Two hidden underperformers

| Subcategory | Sales | Profit | Margin |
|---|---|---|---|
| Storage & Organization | $1,070,183 | $6,664 | **0.6%** |
| Chairs & Chairmats | $1,761,837 | $149,650 | 8.5% |

Storage & Organization moves over **$1M and returns $6,664** — effectively break-even. Neither registers as a "loss," so both are easily overlooked, yet together they represent significant untapped margin.

---

## Finding 11 — Regional performance

| Region | Transactions | Sales | Profit | Margin |
|---|---|---|---|---|
| Nunavut | 79 | $116,376 | $2,841 | **2.4%** |
| Yukon | 542 | $975,867 | $73,849 | 7.6% |
| West | 1,991 | $3,597,549 | $297,009 | 8.3% |
| Quebec | 781 | $1,510,195 | $140,427 | 9.3% |
| Ontario | 1,826 | $3,063,213 | $346,869 | 11.3% |
| Prairie | 1,706 | $2,837,305 | $321,160 | 11.3% |
| Atlantic | 1,080 | $2,014,248 | $238,961 | 11.9% |
| Northwest Territories | 394 | $800,847 | $100,653 | **12.6%** |

*Query: `12_regional_performance`*

**Best provinces:** New Brunswick (16.9%), Saskatchewan (12.6%), NWT (12.6%)
**Worst provinces:** Nunavut (2.4%), Newfoundland (6.7%), Yukon (7.6%), PEI (7.7%), British Columbia (7.7%)

**Note:** British Columbia is the notable outlier — a large market (1,126 transactions, $1.9M sales) performing at only 7.7%. Unlike the small northern territories, its scale makes it material.

---

## Finding 12 — Customer segment performance

| Segment | Transactions | Sales | Profit | Margin | Avg Order |
|---|---|---|---|---|---|
| Small Business | 1,642 | $2,788,321 | $315,708 | **11.3%** | $1,698 |
| Corporate | 3,076 | $5,498,905 | $599,746 | 10.9% | $1,788 |
| Consumer | 1,649 | $3,063,611 | $287,960 | 9.4% | $1,858 |
| Home Office | 2,032 | $3,564,764 | $318,354 | **8.9%** | $1,754 |

*Query: `14_segment_performance`*

Corporate is the largest and healthiest at scale. **Home Office is the weakest at 8.9%** despite being the second-largest segment by transaction count — and it dominates the loss-making customer list below.

---

## Finding 13 — Customer concentration: best and worst

**Top profit contributors:**

| Customer | Segment | Orders | Sales | Profit |
|---|---|---|---|---|
| Emily Phan | Consumer | 10 | $117,124 | **$34,005** |
| Deborah Brumfield | Small Business | 15 | $67,845 | $23,299 |
| Grant Carroll | Small Business | 13 | $56,895 | $21,506 |

**Largest value destroyers:**

| Customer | Segment | Orders | Sales | Profit |
|---|---|---|---|---|
| Julia West | Home Office | 3 | $31,154 | **-$13,057** |
| Laurel Workman | Home Office | 7 | $21,139 | -$12,587 |
| Adrian Barton | Small Business | 5 | $23,089 | -$11,853 |

*Queries: `15_top_customers`, `16_worst_customers`*

**Interpretation:** Julia West lost $13,057 across only **three orders** — roughly $4,350 destroyed per order. **Four of the ten worst accounts are Home Office**, consistent with that segment's weak overall margin. The top ten loss-making customers destroy approximately **$107,000** combined.

---

## Finding 14 — Order priority reveals a counterintuitive pattern

| Priority | Transactions | Sales | Profit | Margin | Avg Shipping |
|---|---|---|---|---|---|
| Critical | 1,608 | $2,724,799 | $182,877 | **6.7%** | $13.13 |
| Not Specified | 1,672 | $2,778,363 | $218,585 | 7.9% | $12.32 |
| Medium | 1,631 | $2,862,452 | $327,052 | 11.4% | $12.58 |
| Low | 1,720 | $3,282,630 | $386,185 | 11.8% | $13.34 |
| High | 1,768 | $3,267,356 | $407,070 | **12.5%** | $12.82 |

*Query: `19_order_priority`*

**"Critical" priority orders are the least profitable at 6.7%** — nearly half the margin of "High" priority orders. Notably, average shipping cost is flat across all priority levels (~$12–13), so this is **not** explained by expedited freight.

This warrants separate investigation: urgent orders may involve rush sourcing, partial shipments, or fulfilment concessions not captured in the shipping cost field.

---

## Finding 15 — Time trends

**By year:**

| Year | Transactions | Sales | Profit | Margin |
|---|---|---|---|---|
| 2009 | 2,153 | $4,209,139 | $434,539 | 10.3% |
| 2010 | 2,142 | $3,549,681 | $363,871 | 10.3% |
| 2011 | 2,002 | $3,436,817 | $381,456 | **11.1%** |
| 2012 | 2,102 | $3,719,964 | $341,902 | **9.2%** |

**Interpretation:** Sales declined 12% from 2009 to 2012, and margin deteriorated to its lowest point in 2012 (9.2%). The problem is worsening, not stable.

**By month (seasonality):**

| Strongest | Margin | Weakest | Margin |
|---|---|---|---|
| October | 12.6% | August | **6.7%** |
| September | 12.3% | March | 8.2% |
| January | 11.9% | February | 8.7% |

*Queries: `17_yearly_trend`, `18_monthly_seasonality`*

August is the weakest month by a wide margin. Q4 (Sep–Oct) is strongest, consistent with business purchasing cycles.

---

## Finding 16 — Priority intervention list

Product-and-province combinations that are both loss-making **and** material in size (>$50,000 sales):

| Subcategory | Province | Sales | Profit | Avg Shipping | Margin |
|---|---|---|---|---|---|
| Tables | Ontario | $406,440 | **-$42,423** | $54.98 | -10.4% |
| Tables | Quebec | $275,689 | -$28,301 | $58.72 | -10.3% |
| Office Machines | Alberta | $348,151 | -$15,217 | $19.70 | -4.4% |
| Bookcases | Ontario | $103,999 | -$15,037 | $44.70 | -14.5% |
| Bookcases | NWT | $70,225 | -$14,323 | $48.31 | **-20.4%** |
| Bookcases | Quebec | $69,113 | -$12,369 | $42.84 | -17.9% |
| Tables | Alberta | $160,388 | -$11,260 | $59.83 | -7.0% |
| Tables | Nova Scotia | $132,714 | -$9,617 | $57.27 | -7.2% |

*Query: `21_high_risk_flags` — CTE*

**The top 15 combinations destroy $192,144 in profit.** Tables in Ontario alone accounts for $42,423 — the single largest concentrated loss in the business.

**Analytical note:** Office Machines in Alberta is an exception worth flagging — it loses $15,217 despite a *low* $19.70 average shipping cost. This does not fit the shipping-cost thesis and likely reflects a pricing or discount issue specific to that market. It should be investigated separately rather than bundled into the shipping remediation.

---

## Finding 17 — No signal in shipping speed

| Ship Mode | Avg Days to Ship | Margin |
|---|---|---|
| Express Air | 2.0 | 12.4% |
| Delivery Truck | 2.0 | 4.3% |
| Regular Air | 2.0 | 14.7% |

*Query: `20_shipping_delay`*

**Interpretation:** Delivery time shows no variance across shipping modes in this dataset — all average 2.0 days. This rules out fulfilment *speed* as a factor and further isolates fulfilment *cost* as the driver.

*Reported for completeness: eliminating a variable strengthens the remaining conclusion.*

---

# RECOMMENDATIONS

**1. Introduce a $25 shipping-cost review trigger.**
Any transaction projected above $25 shipping should require margin validation; above $50, require approval. The over-$50 band lost $131,168 across 538 transactions.

**2. Reprice or re-source Tables and Bookcases.**
Strong base margins (69.3% and 66.0%) destroyed by fulfilment cost. Options: freight surcharge, minimum order value, regional distribution, or supplier renegotiation. Because the cost is product-driven rather than distance-driven, a national pricing fix is appropriate.

**3. Prioritise the top 15 product-province combinations.**
These destroy $192,144 in profit. Tables in Ontario ($42,423) and Quebec ($28,301) should be addressed first.

**4. Audit Delivery Truck economics.**
42% of revenue at 4.3% margin against a 10% target. Closing that gap alone would add roughly **$355,000**.

**5. Review the Home Office segment and its loss-making accounts.**
Weakest segment at 8.9%, and four of the ten worst customers. The top ten loss-making accounts destroy approximately $107,000.

**6. Investigate "Critical" priority orders separately.**
At 6.7% margin with normal shipping costs, the cause lies outside fulfilment and is currently unexplained.

**7. Review Storage & Organization pricing.**
$1.07M in sales at 0.6% margin — a large, quiet drag.

**8. Protect the high performers.**
Binders (30.1%), Labels (35.1%), and Envelopes (27.7%) prove the business can achieve strong margins where fulfilment economics work.

### Estimated recoverable annual profit: **$600,000 – $1,100,000**

---

# METHOD

- **Database:** PostgreSQL hosted on Supabase; 8,399 rows loaded and validated
- **Approach:** top-down analysis — overall health → profit segmentation → category → subcategory → root-cause driver → threshold identification → cross-dimensional validation
- **SQL techniques:** aggregate functions (`SUM`, `COUNT`, `AVG`, `ROUND`), `GROUP BY`, `ORDER BY`, `WHERE`, `CASE WHEN` conditional bucketing, multi-table `JOIN`, Common Table Expressions (`WITH`), date functions (`EXTRACT`)
- **Validation:** the shipping-cost hypothesis was tested against four independent dimensions — product subcategory, shipping mode, geography, and delivery speed — with consistent results. Contradictory cases (Office Machines in Alberta) are flagged rather than omitted.
