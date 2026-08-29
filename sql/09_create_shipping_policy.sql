-- ============================================================
-- 09 | Create shipping policy reference table
-- Purpose: a lookup table of service levels and target margins,
--          used to validate actual performance against policy.
-- ============================================================

DROP TABLE IF EXISTS shipping_policy;

CREATE TABLE shipping_policy (
    ship_mode         TEXT PRIMARY KEY,
    service_level     TEXT,
    target_margin_pct NUMERIC(5,2)
);

INSERT INTO shipping_policy VALUES
('Regular Air',    'Standard',  15.00),
('Express Air',    'Expedited', 20.00),
('Delivery Truck', 'Freight',   10.00);

SELECT * FROM shipping_policy;
