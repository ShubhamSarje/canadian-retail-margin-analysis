-- ============================================================
-- 20 | Fulfilment speed by shipping mode
-- Question: does delivery time correlate with profitability?
-- Finding: NO SIGNAL - all modes average 2.0 days. This rules
--          out fulfilment SPEED as a factor and further isolates
--          fulfilment COST as the driver.
--          (A negative result is still a result.)
-- ============================================================

SELECT
    ship_mode,
    ROUND(AVG(ship_date - order_date), 1) AS avg_days_to_ship,
    COUNT(*)    AS transactions,
    SUM(profit) AS total_profit,
    ROUND(SUM(profit) / SUM(sales) * 100, 1) AS margin_pct
FROM sales
GROUP BY ship_mode
ORDER BY avg_days_to_ship;
