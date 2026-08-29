-- ============================================================
-- 15 | Top 10 customers by profit
-- Question: who are the most valuable accounts?
-- Finding: Emily Phan contributes $34,005 across 10 orders.
-- ============================================================

SELECT
    customer_name,
    customer_segment,
    COUNT(*)    AS orders,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit
FROM sales
GROUP BY customer_name, customer_segment
ORDER BY total_profit DESC
LIMIT 10;
