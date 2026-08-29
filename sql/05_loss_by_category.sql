-- ============================================================
-- 05 | Performance by product category
-- Question: where are the losses concentrated?
-- Finding: Furniture returns only 2.3% margin vs Technology's
--          14.8% on near-identical revenue (7.5x less profit).
-- ============================================================

SELECT
    product_category,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct
FROM sales
GROUP BY product_category
ORDER BY total_profit ASC;
