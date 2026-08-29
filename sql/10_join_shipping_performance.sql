-- ============================================================
-- 10 | Actual vs target margin by shipping mode  [JOIN]
-- Question: which shipping modes miss their margin targets?
-- Finding: Delivery Truck (freight) carries 42% of revenue at
--          4.3% margin against a 10% target - a 5.7pt gap.
--          Regular Air hits target almost exactly (14.7% vs 15%),
--          confirming the business performs where fulfilment is
--          cheap and fails where it is expensive.
-- ============================================================

SELECT
    s.ship_mode,
    p.service_level,
    p.target_margin_pct,
    COUNT(*)      AS transactions,
    SUM(s.sales)  AS total_sales,
    SUM(s.profit) AS total_profit,
    ROUND(SUM(s.profit) / SUM(s.sales) * 100, 1) AS actual_margin_pct
FROM sales s
JOIN shipping_policy p ON s.ship_mode = p.ship_mode
GROUP BY s.ship_mode, p.service_level, p.target_margin_pct
ORDER BY actual_margin_pct ASC;
