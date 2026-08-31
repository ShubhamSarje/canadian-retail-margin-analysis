# Canadian Retail Margin Analysis

**Finding $1.1M in hidden losses across 8,399 retail transactions using SQL**

### [View the live report →](https://canadian-retail-margin-report.vercel.app)

An end-to-end root-cause analysis of a retail business running a thin 10.2% margin. The analysis reveals that the company is really *two businesses* — a healthy one earning 24.6%, and a loss-making one destroying $1.1M — and identifies the specific, controllable driver behind the losses.

> **About the data:** this uses the *Superstore* sample dataset (Canadian variant) — synthetic data originally produced by Tableau Software for analytics training. The figures are illustrative rather than real business results. **The analytical method is the point of this project**, not the findings themselves.

**Tools:** PostgreSQL (Supabase) · SQL · 21 analytical queries
**Techniques:** aggregations, `CASE WHEN` bucketing, multi-table `JOIN`, Common Table Expressions, date functions

---

## The headline

| Metric | Value |
|---|---|
| Transactions analysed | 8,399 |
| Total sales | $14,915,601 |
| Total profit | $1,521,768 |
| Overall margin | **10.2%** |
| **Transactions losing money** | **4,264 (51%)** |
| **Profit destroyed** | **$1,102,503** |
| **Estimated recoverable profit** | **$600K – $1.1M** |

**The conclusion in one sentence:** the company's losses are not caused by discounting, competition, or geography — they are caused by shipping costs on bulky products that current pricing does not account for.

---

## Contents

- [**Live report**](https://canadian-retail-margin-report.vercel.app)
- [Business context](#business-context)
- [Business questions](#business-questions)
- [The dataset](#the-dataset)
- [Analysis walkthrough](#analysis-walkthrough) — 10 steps with SQL
- [Supporting findings](#supporting-findings)
- [Exceptions and limitations](#exceptions-and-limitations)
- [Recommendations](#recommendations)
- [Method](#method)
- [Repository structure](#repository-structure)

---

## Business context

The dataset models a fictional retail distributor operating across all 13 Canadian provinces and territories, selling Furniture, Office Supplies, and Technology to Consumer, Corporate, Home Office, and Small Business customers between **2009 and 2012**.

The scenario: at 10.2% net margin, leadership would reasonably assume the business is simply low-margin. The purpose of this analysis was to test that assumption and determine whether the margin problem is structural or fixable — and, if fixable, to quantify exactly where and by how much.

---

## Business questions

1. Is the entire business low-margin, or is a healthy business being masked?
2. Where are the losses concentrated — by product, geography, customer, or time?
3. What is the underlying driver: discounting, pricing, or fulfilment cost?
4. Is there a measurable threshold at which transactions stop being profitable?
5. Which specific interventions would recover the most profit?

---

## The dataset

**Source:** the *Superstore* sales dataset — Canadian variant — obtained from the public [curran/data](https://github.com/curran/data) repository on GitHub.

**Nature of the data:** Superstore is a widely used sample dataset originally created by Tableau Software for business intelligence education. It is **synthetic**: the transactions, customers, and companies are fictional, generated to simulate realistic retail patterns including both profitable and loss-making orders. It is not real trading data, and no conclusion here should be read as a statement about any actual retailer or market.

**Why it was chosen:** because the dataset is clean and widely understood, it removes data-wrangling noise and puts the focus squarely on analytical reasoning — forming a hypothesis, testing it, ruling out alternatives, and quantifying the result. This project is a demonstration of *method*.

| | |
|---|---|
| Rows | 8,399 transactions |
| Columns | 21 |
| Period | 2009 – 2012 |
| Geography | 13 Canadian provinces and territories |
| Categories | Furniture, Office Supplies, Technology (17 sub-categories) |
| Segments | Consumer, Corporate, Home Office, Small Business |

**Fields include:** order and ship dates, order priority, quantity, sales, discount, profit, unit price, shipping cost, customer name and segment, province and region, product category and sub-category, product container, and product base margin.

Loaded into a PostgreSQL database hosted on Supabase. Row count validated at 8,399 post-import.

---

## Analysis walkthrough

### Step 1 — Establish the baseline

```sql
SELECT
    COUNT(*)      AS total_transactions,
    SUM(sales)    AS total_sales,
    SUM(profit)   AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct
FROM sales;
```

**Result:** $14.9M sales, $1.5M profit, 10.2% margin.

---

### Step 2 — Split profitable from loss-making transactions

```sql
SELECT
    CASE WHEN profit < 0 THEN 'Loss-making' ELSE 'Profitable' END AS outcome,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit
FROM sales
GROUP BY 1;
```

| Outcome | Transactions | Sales | Profit | Margin |
|---|---|---|---|---|
| Profitable | 4,135 | $10,669,516 | $2,624,271 | **24.6%** |
| Loss-making | 4,264 | $4,246,085 | **-$1,102,503** | -26.0% |

**Finding:** The profitable half runs a strong 24.6% margin. More than half of all transactions lose money, cutting company profit by 42%. This is not a low-margin business — it is a healthy business with a systemic loss problem.

---

### Step 3 — Locate the losses by category

| Category | Sales | Profit | Margin |
|---|---|---|---|
| Furniture | $5,178,591 | $117,433 | **2.3%** |
| Office Supplies | $3,752,762 | $518,021 | 13.8% |
| Technology | $5,984,249 | $886,314 | 14.8% |

**Finding:** Furniture and Technology generate near-identical revenue, but Technology produces **7.5× the profit**. Furniture is 35% of revenue and 8% of profit.

---

### Step 4 — Drill into Furniture

```sql
SELECT
    product_subcategory,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct
FROM sales
WHERE product_category = 'Furniture'
GROUP BY product_subcategory
ORDER BY total_profit ASC;
```

| Subcategory | Sales | Profit | Margin |
|---|---|---|---|
| Tables | $1,896,008 | **-$99,062** | **-5.2%** |
| Bookcases | $822,652 | **-$33,582** | **-4.1%** |
| Chairs & Chairmats | $1,761,837 | $149,650 | 8.5% |
| Office Furnishings | $698,094 | $100,428 | **14.4%** |

**Finding:** Furniture is not broken — Office Furnishings *outperforms* the company average. Two subcategories destroy $132,644. The problem scope narrows from an entire category to two product lines.

---

### Step 5 — Test the two candidate causes

Discounting and shipping cost were the two plausible drivers. Both were tested directly.

```sql
SELECT
    product_subcategory,
    ROUND(AVG(discount) * 100, 1)            AS avg_discount_pct,
    ROUND(AVG(shipping_cost), 2)             AS avg_shipping_cost,
    ROUND(AVG(product_base_margin) * 100, 1) AS avg_base_margin_pct
FROM sales
WHERE product_category = 'Furniture'
GROUP BY product_subcategory
ORDER BY avg_shipping_cost DESC;
```

| Subcategory | Avg Discount | Avg Shipping | Base Margin | Actual Margin |
|---|---|---|---|---|
| Tables | 5.0% | **$57.29** | 69.3% | -5.2% |
| Bookcases | 4.8% | $45.75 | 66.0% | -4.1% |
| Chairs & Chairmats | 5.0% | $40.19 | 63.5% | 8.5% |
| Office Furnishings | 4.9% | **$10.66** | 52.6% | 14.4% |

**Finding — the root cause:**

- **Discounting is ruled out.** Every subcategory discounts at approximately 5%. Tables discount *no more* than the profitable Office Furnishings.
- **Shipping cost is the driver.** Tables cost **5.4× more to ship**.
- **Decisively:** Tables have the *highest* base margin in the category at 69.3% — the product is not underpriced at source. Fulfilment cost destroys the margin after the sale.

---

### Step 6 — Find the break-even threshold

```sql
SELECT
    CASE
        WHEN shipping_cost < 10 THEN 'A. Under $10'
        WHEN shipping_cost < 25 THEN 'B. $10-25'
        WHEN shipping_cost < 50 THEN 'C. $25-50'
        ELSE                         'D. Over $50'
    END AS shipping_band,
    COUNT(*)    AS transactions,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct
FROM sales
GROUP BY 1
ORDER BY 1;
```

| Shipping Band | Transactions | Sales | Profit | Margin |
|---|---|---|---|---|
| Under $10 | 5,944 | $4,185,274 | $572,198 | 13.7% |
| $10–25 | 1,259 | $4,977,739 | $945,154 | **19.0%** |
| $25–50 | 658 | $3,040,636 | $135,584 | 4.5% |
| Over $50 | 538 | $2,711,952 | **-$131,168** | **-4.8%** |

**Finding:** Margin collapses above $25 shipping cost and turns negative above $50. **538 transactions — 6.4% of volume — destroy $131,168.**

The $10–25 band is the healthiest at 19.0%: mid-sized orders carry enough value to absorb fulfilment cost while remaining cheap to ship.

**$25 is a directly usable operational review trigger.**

---

### Step 7 — Validate against shipping policy (JOIN)

A reference table of service levels and target margins was created and joined to the transaction data.

```sql
SELECT
    s.ship_mode,
    p.service_level,
    p.target_margin_pct,
    SUM(s.sales)  AS total_sales,
    ROUND(SUM(s.profit) / SUM(s.sales) * 100, 1) AS actual_margin_pct
FROM sales s
JOIN shipping_policy p ON s.ship_mode = p.ship_mode
GROUP BY s.ship_mode, p.service_level, p.target_margin_pct
ORDER BY actual_margin_pct ASC;
```

| Ship Mode | Service Level | Target | Actual | Gap | Sales |
|---|---|---|---|---|---|
| Delivery Truck | Freight | 10.0% | **4.3%** | **-5.7 pts** | $6,224,879 |
| Express Air | Expedited | 20.0% | 12.4% | -7.6 pts | $1,184,419 |
| Regular Air | Standard | 15.0% | 14.7% | -0.3 pts | $7,506,303 |

**Finding:** Delivery Truck carries **42% of company revenue** at less than half its target margin. Regular Air — used for small items — hits its target almost exactly, proving the business *can* perform when fulfilment economics work.

---

### Step 8 — Rule out geography

The obvious counter-argument: *isn't this just the cost of shipping across Canada?*

| Dimension | Avg Shipping Cost Range |
|---|---|
| Across all 8 regions | $12.23 – $13.78 |
| Across all 13 provinces | $11.41 – $14.08 |
| **Tables, in every province** | **$54.98 – $59.90** |

**Finding:** Shipping cost varies by only about $2 nationwide — including Nunavut and the Northwest Territories. But Tables cost $55–60 to ship *everywhere*.

**Distance is not the driver. Product characteristics are.** This matters operationally: the fix is national product pricing, not regional logistics.

---

### Step 9 — Quantify contribution (CTE)

```sql
WITH subcat_profit AS (
    SELECT
        product_category,
        product_subcategory,
        SUM(sales)  AS total_sales,
        SUM(profit) AS total_profit
    FROM sales
    GROUP BY product_category, product_subcategory
)
SELECT
    product_subcategory,
    total_profit,
    ROUND(total_profit / (SELECT SUM(total_profit) FROM subcat_profit) * 100, 1)
        AS pct_of_company_profit
FROM subcat_profit
ORDER BY total_profit ASC;
```

**Destroyers:** Tables **-6.5%** of company profit · Bookcases -2.2%
**Contributors:** Telephones 20.8% · Office Machines 20.2% · Binders 20.2% (at a 30.1% margin)

Three subcategories generate **61% of all company profit**. Tables alone erase 6.5% of it.

---

### Step 10 — Build the intervention list

```sql
WITH flagged AS (
    SELECT
        product_subcategory, province,
        SUM(sales)  AS total_sales,
        SUM(profit) AS total_profit,
        ROUND(AVG(shipping_cost), 2) AS avg_shipping
    FROM sales
    GROUP BY product_subcategory, province
)
SELECT *, ROUND(total_profit / total_sales * 100, 1) AS margin_pct
FROM flagged
WHERE total_profit < 0 AND total_sales > 50000
ORDER BY total_profit ASC
LIMIT 15;
```

| Subcategory | Province | Sales | Profit | Avg Shipping | Margin |
|---|---|---|---|---|---|
| Tables | Ontario | $406,440 | **-$42,423** | $54.98 | -10.4% |
| Tables | Quebec | $275,689 | -$28,301 | $58.72 | -10.3% |
| Office Machines | Alberta | $348,151 | -$15,217 | $19.70 | -4.4% |
| Bookcases | Ontario | $103,999 | -$15,037 | $44.70 | -14.5% |
| Bookcases | NWT | $70,225 | -$14,323 | $48.31 | **-20.4%** |

**The top 15 combinations destroy $192,144.** Tables in Ontario alone accounts for $42,423 — the single largest concentrated loss in the business.

---

## Supporting findings

**Customer segments** — Home Office is weakest at 8.9% margin despite being the second-largest segment, and accounts for four of the ten largest loss-making customers. One account, Julia West, lost $13,057 across just three orders.

**Time trend** — Margin fell to 9.2% in 2012, its lowest of four years, while sales declined 12% from 2009. The problem is worsening.

**Seasonality** — August is the weakest month at 6.7% margin; October the strongest at 12.6%.

**Hidden underperformer** — Storage & Organization moves $1,070,183 in sales and returns $6,664 (0.6%). It never registers as a loss, so it escapes attention entirely.

---

## Exceptions and limitations

Two results do **not** fit the shipping-cost thesis and are reported rather than omitted:

- **Office Machines in Alberta** loses $15,217 despite a low $19.70 average shipping cost. This points to a pricing or discount issue specific to that market and requires separate investigation.
- **"Critical" priority orders** are the least profitable at 6.7% margin, yet their shipping costs are normal (~$13). The cause lies outside fulfilment — possibly rush sourcing or partial shipments — and is not explained by this analysis.

**Data limitation:** delivery time showed no variance across shipping modes (all 2.0 days), so fulfilment *speed* could not be assessed as a factor.

---

## Recommendations

| # | Action | Estimated Impact |
|---|---|---|
| 1 | Introduce a **$25 shipping-cost review trigger**; require approval above $50 | Protects $131,168 currently lost |
| 2 | **Reprice or re-source Tables and Bookcases** — surcharge, minimum order value, or regional distribution | $132,644 |
| 3 | Address the **top 15 loss-making product-province combinations**, starting with Tables in Ontario and Quebec | $192,144 |
| 4 | **Audit Delivery Truck economics** — 42% of revenue at 4.3% against a 10% target | ~$355,000 |
| 5 | Review the **Home Office segment** and its ten worst accounts | ~$107,000 |
| 6 | Investigate **"Critical" priority orders** separately — cause unexplained | To be determined |
| 7 | Review **Storage & Organization** pricing — $1.07M sales at 0.6% | Material, unquantified |

**Estimated recoverable annual profit: $600,000 – $1,100,000**

Because the cost driver is product-based rather than geographic, remediation can be applied as a single national pricing change rather than 13 regional ones.

---

## Method

**Approach:** top-down funnel — establish baseline → segment profitable vs. loss-making → isolate by category → drill to subcategory → test candidate causes → identify threshold → validate across independent dimensions.

**Validation:** the shipping-cost hypothesis was tested against four independent dimensions — product subcategory, shipping mode, geography, and delivery speed — and held in each. Contradictory cases are documented in *Exceptions* above rather than excluded.

**SQL techniques used:**

| Technique | Applied in |
|---|---|
| Aggregate functions (`SUM`, `COUNT`, `AVG`, `ROUND`) | All queries |
| `GROUP BY` / `ORDER BY` | Category, subcategory, region, segment analysis |
| `WHERE` filtering | Furniture drill-down, risk flagging |
| `CASE WHEN` conditional bucketing | Profit split, shipping bands |
| Multi-table `JOIN` | Shipping policy vs. actual performance |
| Common Table Expressions (`WITH`) | Profit contribution, intervention list |
| Subqueries | Company-total comparison |
| Date functions (`EXTRACT`) | Yearly and monthly trends |

---

## Repository structure

```
canadian-retail-margin-analysis/
├── README.md          # This file — analysis walkthrough and findings
├── FINDINGS.md        # Detailed findings log (17 findings with full tables)
├── sql/               # 21 documented queries, numbered in analysis order
│   ├── 01_create_table.sql          # Schema definition
│   ├── 02_explore_sample.sql        # Initial data inspection
│   ├── 03_overall_health.sql        # Baseline metrics
│   ├── 04_profit_split.sql          # Profitable vs loss-making
│   ├── 05_loss_by_category.sql      # Category performance
│   ├── 06_furniture_breakdown.sql   # Subcategory drill-down
│   ├── 07_tables_root_cause.sql     # Root cause test
│   ├── 08_shipping_threshold.sql    # Break-even threshold
│   ├── 09_create_shipping_policy.sql
│   ├── 10_join_shipping_performance.sql   # JOIN
│   ├── 11_profit_contribution.sql         # CTE
│   ├── 12_regional_performance.sql
│   ├── 13_province_performance.sql
│   ├── 14_segment_performance.sql
│   ├── 15_top_customers.sql
│   ├── 16_worst_customers.sql
│   ├── 17_yearly_trend.sql
│   ├── 18_monthly_seasonality.sql
│   ├── 19_order_priority.sql
│   ├── 20_shipping_delay.sql
│   └── 21_high_risk_flags.sql             # CTE
├── data/
│   └── retail_sales.csv   # Cleaned dataset, 8,399 rows
└── dashboard/             # React report deployed to Vercel
    ├── README.md          # Stack and design notes
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx        # All 11 report sections
        ├── data.js        # Baked query results
        ├── index.css      # Palette, typography, responsive rules
        └── components/    # Charts, scroll reveals, SQL toggles
```

Each SQL file includes a header comment stating the business question it answers and the finding it produced.

---

## About

**Shubham Sarje** — Data & Business Analyst, Toronto

**Approach:** Start with a business question, follow the evidence rather than the assumption, and stop only when the recommendation is specific enough to act on.

**Background:** Accounting-trained (B.Com) with dual post-graduate analytics credentials (4.0 GPA, Durham College) — which is why margin, cost structure, and profitability analysis are natural territory. Currently a Technical & Customer Experience Analyst at Transcom.

**Toolkit:** SQL (PostgreSQL) · Power BI · Tableau · Excel *(certified)* · Python

[Live report](https://canadian-retail-margin-report.vercel.app) · [LinkedIn](https://linkedin.com/in/shubhamsarje) · shubham.s.sarje@gmail.com · Toronto, ON
