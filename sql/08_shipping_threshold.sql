-- ============================================================
-- 08 | Shipping cost threshold analysis
-- Question: at what shipping cost do transactions stop being
--           profitable?
-- Finding: margin collapses above $25 and turns negative above
--          $50. 538 transactions (6.4%) destroy $131,168.
--          $25 is a usable operational review trigger.
-- ============================================================

SELECT
    CASE
        WHEN shipping_cost < 10  THEN 'A. Under $10'
        WHEN shipping_cost < 25  THEN 'B. $10-25'
        WHEN shipping_cost < 50  THEN 'C. $25-50'
        ELSE                          'D. Over $50'
    END AS shipping_band,
    COUNT(*)    AS transactions,
    ROUND(AVG(shipping_cost), 2) AS avg_shipping,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct
FROM sales
GROUP BY 1
ORDER BY 1;
