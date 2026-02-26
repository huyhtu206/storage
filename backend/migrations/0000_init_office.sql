-- Migration: Initial Office Products Table
CREATE TABLE IF NOT EXISTS office_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    product_id TEXT NOT NULL,
    apps TEXT,
    label TEXT,
    language TEXT,
    version_tag TEXT,
    platform TEXT,
    url TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_office_product_id ON office_products(product_id);
CREATE INDEX IF NOT EXISTS idx_office_language ON office_products(language);
