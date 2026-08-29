-- ============================================================
-- 11 | Profit contribution by subcategory  [CTE]
-- Question: what share of total company profit does each
--           subcategory represent?
-- Finding: Tables erase 6.5% of company profit. Three
--          subcategories (Telephones, Office Machines, Binders)
--          generate 61% of all profit.
-- ============================================================

WITH subcat_profit AS (
    SELECT
        product_category,
        product_subcategory,
        SUM(sales)  AS total_sales,
        SUM(profit) AS total_profit
    FROM sales
    GROUP BY product_category, product_subcategory
)
SELECT
    product_category,
    product_subcategory,
    total_sales,
    total_profit,
    ROUND(total_profit / total_sales * 100, 1) AS margin_pct,
    ROUND(total_profit / (SELECT SUM(total_profit) FROM subcat_profit) * 100, 1)
        AS pct_of_company_profit
FROM subcat_profit
ORDER BY total_profit ASC;
