-- ============================================================
-- 21 | Priority intervention list  [CTE]
-- Question: which product-province combinations should be
--           addressed first?
-- Finding: the top 15 combinations destroy $192,144.
--          Tables in Ontario alone accounts for $42,423 - the
--          single largest concentrated loss in the business.
--          Exception: Office Machines in Alberta loses $15,217
--          despite LOW shipping cost ($19.70) - does not fit the
--          shipping thesis, needs separate investigation.
-- ============================================================

WITH flagged AS (
    SELECT
        product_subcategory,
        province,
        COUNT(*)    AS transactions,
        SUM(sales)  AS total_sales,
        SUM(profit) AS total_profit,
        ROUND(AVG(shipping_cost), 2) AS avg_shipping
    FROM sales
    GROUP BY product_subcategory, province
)
SELECT *,
    ROUND(total_profit / total_sales * 100, 1) AS margin_pct
FROM flagged
WHERE total_profit < 0
  AND total_sales > 50000
ORDER BY total_profit ASC
LIMIT 15;
