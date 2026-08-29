-- ============================================================
-- 19 | Performance by order priority
-- Question: does urgency affect profitability?
-- Finding: UNEXPECTED - "Critical" orders are the LEAST
--          profitable (6.7%) vs "High" (12.5%). Shipping cost is
--          flat across all priorities (~$12-13), so this is NOT
--          explained by expedited freight. Flagged as an
--          exception requiring separate investigation.
-- ============================================================

SELECT
    order_priority,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct,
    ROUND(AVG(shipping_cost), 2) AS avg_shipping
FROM sales
GROUP BY order_priority
ORDER BY margin_pct ASC;
