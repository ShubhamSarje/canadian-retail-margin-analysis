-- ============================================================
-- 04 | Profitable vs loss-making transactions
-- Question: is the whole business low-margin, or is a healthy
--           business being masked by loss-making transactions?
-- Finding: 51% of transactions lose money, destroying $1,102,503.
--          The profitable half runs a healthy 24.6% margin.
-- ============================================================

SELECT
    CASE WHEN profit < 0 THEN 'Loss-making' ELSE 'Profitable' END AS outcome,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit
FROM sales
GROUP BY 1;
