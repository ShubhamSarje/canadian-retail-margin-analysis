-- ============================================================
-- 16 | Bottom 10 customers by profit
-- Question: which accounts destroy value?
-- Finding: Julia West lost $13,057 across just 3 orders
--          (~$4,350 destroyed per order). Four of the ten worst
--          accounts are Home Office, consistent with that
--          segment's weak margin. Top 10 destroy ~$107,000.
-- ============================================================

SELECT
    customer_name,
    customer_segment,
    COUNT(*)    AS orders,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit
FROM sales
GROUP BY customer_name, customer_segment
ORDER BY total_profit ASC
LIMIT 10;
