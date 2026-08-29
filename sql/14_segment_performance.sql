-- ============================================================
-- 14 | Performance by customer segment
-- Question: which customer types are most profitable?
-- Finding: Home Office is weakest at 8.9% despite being the
--          second-largest segment. Corporate is largest and
--          healthy at 10.9% on $5.5M sales.
-- ============================================================

SELECT
    customer_segment,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct,
    ROUND(AVG(sales), 2) AS avg_order_value
FROM sales
GROUP BY customer_segment
ORDER BY total_profit DESC;
