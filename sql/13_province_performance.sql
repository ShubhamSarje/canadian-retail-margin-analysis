-- ============================================================
-- 13 | Performance by province
-- Question: does remoteness explain the shipping cost problem?
-- Finding: NO. Average shipping cost ranges only $11.41-$14.08
--          across all 13 provinces, including Nunavut and NWT.
--          Distance is ruled out as the driver.
--          Note: British Columbia is a material outlier - a large
--          market ($1.9M sales) at only 7.7% margin.
-- ============================================================

SELECT
    province,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct,
    ROUND(AVG(shipping_cost), 2) AS avg_shipping
FROM sales
GROUP BY province
ORDER BY margin_pct ASC;
