-- ============================================================
-- 12 | Performance by region
-- Question: are losses concentrated geographically?
-- Finding: margins vary (Nunavut 2.4% to NWT 12.6%) BUT average
--          shipping cost is nearly flat ($12.23-$13.78) across
--          all regions - the first evidence that shipping cost
--          is product-driven, not distance-driven.
-- ============================================================

SELECT
    region,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct,
    ROUND(AVG(shipping_cost), 2) AS avg_shipping
FROM sales
GROUP BY region
ORDER BY margin_pct ASC;
