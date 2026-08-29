-- ============================================================
-- 18 | Monthly seasonality
-- Question: does profitability vary by month?
-- Finding: August is weakest (6.7%), October strongest (12.6%).
--          Q4 (Sep-Oct) aligns with business purchasing cycles.
-- ============================================================

SELECT
    EXTRACT(MONTH FROM order_date) AS month,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct
FROM sales
GROUP BY 1
ORDER BY 1;
