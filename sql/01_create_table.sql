-- ============================================================
-- 01 | Create the sales table
-- Purpose: define the schema for the Canadian retail dataset
-- ============================================================

DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
    row_id              INTEGER PRIMARY KEY,
    order_id            INTEGER,
    order_date          DATE,
    ship_date           DATE,
    order_priority      TEXT,
    order_quantity      INTEGER,
    sales               NUMERIC(12,2),
    discount            NUMERIC(5,3),
    ship_mode           TEXT,
    profit              NUMERIC(12,2),
    unit_price          NUMERIC(12,2),
    shipping_cost       NUMERIC(12,2),
    customer_name       TEXT,
    province            TEXT,
    region              TEXT,
    customer_segment    TEXT,
    product_category    TEXT,
    product_subcategory TEXT,
    product_name        TEXT,
    product_container   TEXT,
    product_base_margin NUMERIC(5,3)
);

-- Validate load (expected: 8399 after CSV import)
SELECT COUNT(*) AS row_count FROM sales;
