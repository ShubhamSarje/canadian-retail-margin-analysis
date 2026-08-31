export const headline = {
  transactions: 8399,
  totalSales: 14915601,
  totalProfit: 1521768,
  marginPct: 10.2,
  lossTransactions: 4264,
  lossAmount: 1102503,
};

export const split = [
  { name: 'Profitable', transactions: 4135, sales: 10669516, profit: 2624271, margin: 24.6 },
  { name: 'Loss-making', transactions: 4264, sales: 4246085, profit: -1102503, margin: -26.0 },
];

export const categories = [
  { name: 'Furniture', sales: 5178591, profit: 117433, margin: 2.3 },
  { name: 'Office Supplies', sales: 3752762, profit: 518021, margin: 13.8 },
  { name: 'Technology', sales: 5984249, profit: 886314, margin: 14.8 },
];

export const furniture = [
  { name: 'Tables', sales: 1896008, profit: -99062, margin: -5.2 },
  { name: 'Bookcases', sales: 822652, profit: -33582, margin: -4.1 },
  { name: 'Chairs & Chairmats', sales: 1761837, profit: 149650, margin: 8.5 },
  { name: 'Office Furnishings', sales: 698094, profit: 100428, margin: 14.4 },
];

export const suspects = [
  { name: 'Tables', discount: 5.0, shipping: 57.29, baseMargin: 69.3, actualMargin: -5.2 },
  { name: 'Bookcases', discount: 4.8, shipping: 45.75, baseMargin: 66.0, actualMargin: -4.1 },
  { name: 'Chairs & Chairmats', discount: 5.0, shipping: 40.19, baseMargin: 63.5, actualMargin: 8.5 },
  { name: 'Office Furnishings', discount: 4.9, shipping: 10.66, baseMargin: 52.6, actualMargin: 14.4 },
];

export const threshold = [
  { band: 'Under $10', transactions: 5944, avgShipping: 4.61, sales: 4185274, profit: 572198, margin: 13.7 },
  { band: '$10–25', transactions: 1259, avgShipping: 16.95, sales: 4977739, profit: 945154, margin: 19.0 },
  { band: '$25–50', transactions: 658, avgShipping: 36.20, sales: 3040636, profit: 135584, margin: 4.5 },
  { band: 'Over $50', transactions: 538, avgShipping: 65.61, sales: 2711952, profit: -131168, margin: -4.8 },
];

export const shipModes = [
  { name: 'Delivery Truck', service: 'Freight', target: 10.0, actual: 4.3, sales: 6224879 },
  { name: 'Express Air', service: 'Expedited', target: 20.0, actual: 12.4, sales: 1184419 },
  { name: 'Regular Air', service: 'Standard', target: 15.0, actual: 14.7, sales: 7506303 },
];

export const geography = [
  { name: 'Nunavut', shipping: 13.31, margin: 2.4 },
  { name: 'Yukon', shipping: 12.23, margin: 7.6 },
  { name: 'West', shipping: 13.78, margin: 8.3 },
  { name: 'Quebec', shipping: 12.86, margin: 9.3 },
  { name: 'Ontario', shipping: 12.86, margin: 11.3 },
  { name: 'Prairie', shipping: 12.61, margin: 11.3 },
  { name: 'Atlantic', shipping: 13.02, margin: 11.9 },
  { name: 'NW Territories', shipping: 12.75, margin: 12.6 },
];

export const tablesShippingByProvince = [
  { province: 'Ontario', shipping: 54.98 },
  { province: 'Quebec', shipping: 58.72 },
  { province: 'Alberta', shipping: 59.83 },
  { province: 'Nova Scotia', shipping: 57.27 },
  { province: 'Manitoba', shipping: 59.90 },
];

export const interventions = [
  { subcategory: 'Tables', province: 'Ontario', sales: 406440, profit: -42423, shipping: 54.98, margin: -10.4 },
  { subcategory: 'Tables', province: 'Quebec', sales: 275689, profit: -28301, shipping: 58.72, margin: -10.3 },
  { subcategory: 'Office Machines', province: 'Alberta', sales: 348151, profit: -15217, shipping: 19.70, margin: -4.4, exception: true },
  { subcategory: 'Bookcases', province: 'Ontario', sales: 103999, profit: -15037, shipping: 44.70, margin: -14.5 },
  { subcategory: 'Bookcases', province: 'NW Territories', sales: 70225, profit: -14323, shipping: 48.31, margin: -20.4 },
  { subcategory: 'Bookcases', province: 'Quebec', sales: 69113, profit: -12369, shipping: 42.84, margin: -17.9 },
  { subcategory: 'Tables', province: 'Alberta', sales: 160388, profit: -11260, shipping: 59.83, margin: -7.0 },
  { subcategory: 'Tables', province: 'Nova Scotia', sales: 132714, profit: -9617, shipping: 57.27, margin: -7.2 },
];

export const recommendations = [
  { n: 1, action: 'Introduce a $25 shipping-cost review trigger; require approval above $50', impact: '$131,168', note: 'Protects the profit currently lost in the over-$50 band' },
  { n: 2, action: 'Reprice or re-source Tables and Bookcases', impact: '$132,644', note: 'Strong base margins destroyed by fulfilment cost' },
  { n: 3, action: 'Address the top 15 loss-making product-province combinations', impact: '$192,144', note: 'Starting with Tables in Ontario and Quebec' },
  { n: 4, action: 'Audit Delivery Truck economics', impact: '~$355,000', note: '42% of revenue at 4.3% against a 10% target' },
  { n: 5, action: 'Review the Home Office segment and its ten worst accounts', impact: '~$107,000', note: 'Weakest segment at 8.9% margin' },
];

export const sqlQueries = {
  split: `SELECT
    CASE WHEN profit < 0 THEN 'Loss-making' ELSE 'Profitable' END AS outcome,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit
FROM sales
GROUP BY 1;`,
  suspects: `SELECT
    product_subcategory,
    ROUND(AVG(discount) * 100, 1)            AS avg_discount_pct,
    ROUND(AVG(shipping_cost), 2)             AS avg_shipping_cost,
    ROUND(AVG(product_base_margin) * 100, 1) AS avg_base_margin_pct
FROM sales
WHERE product_category = 'Furniture'
GROUP BY product_subcategory
ORDER BY avg_shipping_cost DESC;`,
  threshold: `SELECT
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
ORDER BY 1;`,
  shipMode: `SELECT
    s.ship_mode,
    p.service_level,
    p.target_margin_pct,
    SUM(s.sales) AS total_sales,
    ROUND(SUM(s.profit) / SUM(s.sales) * 100, 1) AS actual_margin_pct
FROM sales s
JOIN shipping_policy p ON s.ship_mode = p.ship_mode
GROUP BY s.ship_mode, p.service_level, p.target_margin_pct
ORDER BY actual_margin_pct ASC;`,
  intervention: `WITH flagged AS (
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
LIMIT 15;`,
};

export const REPO_URL = 'https://github.com/ShubhamSarje/canadian-retail-margin-analysis';
