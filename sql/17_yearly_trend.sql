-- ============================================================
-- 17 | Yearly trend
-- Question: is the margin problem improving or worsening?
-- Finding: worsening. Margin fell to 9.2% in 2012 (lowest of
--          four years) while sales declined 12% from 2009.
-- ============================================================

SELECT
    EXTRACT(YEAR FROM order_date) AS year,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct
FROM sales
GROUP BY 1
ORDER BY 1;
