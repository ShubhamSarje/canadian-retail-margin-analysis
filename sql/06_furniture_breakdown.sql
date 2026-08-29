-- ============================================================
-- 06 | Furniture subcategory breakdown
-- Question: is all of Furniture unprofitable, or specific lines?
-- Finding: Office Furnishings earns 14.4% (above company average).
--          Tables (-5.2%) and Bookcases (-4.1%) destroy $132,644.
-- ============================================================

SELECT
    product_subcategory,
    COUNT(*)    AS transactions,
    SUM(sales)  AS total_sales,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct
FROM sales
WHERE product_category = 'Furniture'
GROUP BY product_subcategory
ORDER BY total_profit ASC;
