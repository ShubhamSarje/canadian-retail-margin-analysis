-- ============================================================
-- 03 | Overall business health
-- Question: what is the company's total sales, profit and margin?
-- Finding: $14.9M sales, $1.5M profit, 10.2% margin
-- ============================================================

SELECT
    COUNT(*)      AS total_transactions,
    SUM(sales)    AS total_sales,
    SUM(profit)   AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct
FROM sales;
