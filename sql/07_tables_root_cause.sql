-- ============================================================
-- 07 | Root cause test: discounting vs shipping cost
-- Question: what drives the Tables/Bookcases losses?
-- Finding: discounting is flat (~5%) across all subcategories -
--          ruled out. Shipping cost is the driver: Tables average
--          $57.29 vs Office Furnishings' $10.66 (5.4x).
--          Tables also have the HIGHEST base margin (69.3%),
--          proving the product is not underpriced at source.
-- ============================================================

SELECT
    product_subcategory,
    ROUND(AVG(discount) * 100, 1)            AS avg_discount_pct,
    ROUND(AVG(shipping_cost), 2)             AS avg_shipping_cost,
    ROUND(AVG(sales), 2)                     AS avg_sale_value,
    ROUND(AVG(product_base_margin) * 100, 1) AS avg_base_margin_pct
FROM sales
WHERE product_category = 'Furniture'
GROUP BY product_subcategory
ORDER BY avg_shipping_cost DESC;
