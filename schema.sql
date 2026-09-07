-- SQLite Syntax (Correct for Cloudflare D1)
PRAGMA foreign_keys = OFF;
-- DROP TABLE IF EXISTS product_tags;
-- DROP TABLE IF EXISTS cart_items;
-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS categories;
-- DROP TABLE IF EXISTS brands;
-- DROP TABLE IF EXISTS tags;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS pending_registrations;
-- PRAGMA foreign_keys = ON;

-- 🔗 Create the Cart Items bridge table safely
CREATE TABLE IF NOT EXISTS cart_items (
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- CREATE TABLE FOR PENDING REUQESTS
CREATE TABLE IF NOT EXISTS pending_registrations (
  token_id TEXT,
  email TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  display_name TEXT,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- CREATE TABLE FOR USERS
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  google_id TEXT UNIQUE, -- the 'sub' field from Google's token
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT,
  salt TEXT,
  picture TEXT,
  role TEXT DEFAULT 'user', -- Use 'admin' for yourself
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- create index on email for faster login lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL -- Useful for URLs like /category/electronics
);

CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    color_code TEXT DEFAULT '#808080'
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT, -- SQLite uses AUTOINCREMENT
  name TEXT UNIQUE NOT NULL,                   -- SQLite uses TEXT instead of VARCHAR
  price REAL NOT NULL,                  -- SQLite uses REAL for decimals
  rating REAL DEFAULT 0.0,
  image_url TEXT,
  discount_label TEXT,
  stock_count INTEGER DEFAULT 10,
  description TEXT,
  -- Foreign Keys
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_tags (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_product_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_brand_id ON products(brand_id);

-- Seed Categories
INSERT OR IGNORE INTO categories (name, slug) VALUES 
('Laptops', 'laptops'), ('Smartphones', 'smartphones'), 
('Audio', 'audio'), ('Wearables', 'wearables'), ('Accessories', 'accessories');

-- Seed Brands
INSERT OR IGNORE INTO brands (name, slug) VALUES 
('Quantum', 'quantum'), ('NovaTech', 'novatech'), ('Aether', 'aether'), 
('Apex', 'apex'), ('Lumina', 'lumina'), ('Zenith', 'zenith'), 
('Titan', 'titan'), ('Vortex', 'vortex'), ('Echo', 'echo'), ('Orbit', 'orbit');

-- Seed Tags
INSERT OR IGNORE INTO tags (name, slug, color_code) VALUES 
('New', 'new', '#2196f3'), 
('Sale', 'sale', '#f44336'), 
('Best Seller', 'best-seller', '#4caf50'), 
('Limited', 'limited', '#ff9800'), 
('Gaming', 'gaming', '#e91e63');

-- Example for 20 products (Repeat this block with incremented names for 100)
-- Updated logic to ensure true randomness per row
INSERT OR IGNORE INTO products (name, price, rating, image_url, discount_label, category_id, brand_id, description)
SELECT 
  'Product ' || id_val, 
  -- Use id_val to help vary the "random" seed
  (ABS(RANDOM() + id_val) % 1000 + 50.99), 
  (ABS(RANDOM() + id_val) % 50 / 10.0), 
  'https://picsum.photos/seed/' || id_val || '/300/400', 
  CASE WHEN id_val % 5 = 0 THEN '20% OFF' ELSE NULL END,
  (ABS(RANDOM() + id_val) % 5 + 1), 
  (ABS(RANDOM() + id_val) % 10 + 1),
  'High-quality description for product ' || id_val
FROM (
  WITH RECURSIVE cnt(id_val) AS ( 
     SELECT 1 UNION ALL SELECT id_val + 1 FROM cnt WHERE id_val <= 100 -- Use <= 100 for exactly 100
  )
  SELECT id_val FROM cnt
);
-- explanation for sql statement above:
-- It's a statement to insert values from the product table with generated table
-- The statement in FROM (...) run first, WITH RECURSIVE cnt(id_val) AS (...) will run with an anchor first. SELECT 1 automatically infers 
--  id_val as a number, UNION ALL SELECT id_val + 1 will stack the new row on top after table merging with id_val + 1 as the second id. 
-- In the next loop it automatically know to SELECT 2 next and UNION ALL on this new id. After this function in the FROM (...) block finishes,
-- it returns a table with 100 rows of id_val and the INSERT INTO SELECT statement above will generate new column for each selection contains either a cosntant
-- or constant operations that involve id_val.

-- 1. Give every product at least one random tag
INSERT OR IGNORE INTO product_tags (product_id, tag_id)
SELECT p.id, (
  SELECT t.id 
  FROM tags t 
  WHERE p.id IS NOT NULL -- This "links" the subquery to the outer row
  ORDER BY RANDOM() 
  LIMIT 1
)
FROM products p;

-- -- 2. Give products with EVEN IDs a second, different random tag
-- INSERT INTO product_tags (product_id, tag_id)
-- SELECT id, (SELECT id FROM tags ORDER BY RANDOM() LIMIT 1)
-- FROM products
-- WHERE id % 2 = 0;

-- -- 3. (Optional) Cleanup: Remove any accidental duplicates 
-- -- (In case the second random tag was the same as the first)
-- DELETE FROM product_tags 
-- WHERE rowid NOT IN (
--   SELECT MIN(rowid) 
--   FROM product_tags 
--   GROUP BY product_id, tag_id
-- );

PRAGMA foreign_keys = ON;