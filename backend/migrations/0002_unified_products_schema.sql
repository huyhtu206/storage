-- Migration: 0002_unified_products_schema.sql
-- Description: Create a unified products table to support both Office and Windows ISOs.

-- Rename old table to backup if it exists, or just create the new one.
-- Actually, Cloudflare D1 doesn't support RENAME if it's in use by a Worker easily, 
-- but we can create the new table and transfer data.

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL, -- "OFFICE", "WINDOWS", "DRIVER", etc.
    product_id TEXT, -- e.g., "win11-consumer-25h2"
    label TEXT, -- UI label
    language TEXT, -- e.g., "en-us"
    version TEXT, -- e.g., "25H2"
    platform TEXT, -- e.g., "x64"
    filename TEXT, -- The real filename for ISDN pattern
    url TEXT, -- Full URL (for legacy or non-pattern links)
    apps TEXT, -- For Office products
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Copy existing office products into the new table
INSERT INTO products (category, product_id, label, language, version, platform, url, apps)
SELECT 'OFFICE', product_id, label, language, version_tag, platform, url, apps FROM office_products;

-- Note: We keep office_products for now to avoid breaking the existing worker 
-- until the new worker is deployed and tested.
