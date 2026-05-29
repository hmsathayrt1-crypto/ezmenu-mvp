-- المطاعم
CREATE TABLE IF NOT EXISTS restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  whatsapp_number TEXT NOT NULL,
  currency_default TEXT DEFAULT 'SYP',
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- التصنيفات
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🍽️',
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- الأصناف
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price_syp REAL NOT NULL,
  price_usd REAL DEFAULT 0,
  image_url TEXT DEFAULT '',
  is_featured INTEGER DEFAULT 0,
  is_available INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- الإضافات
CREATE TABLE IF NOT EXISTS addons (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price_syp REAL DEFAULT 0,
  price_usd REAL DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- أصناف ↔ إضافات
CREATE TABLE IF NOT EXISTS item_addons (
  item_id TEXT NOT NULL,
  addon_id TEXT NOT NULL,
  PRIMARY KEY (item_id, addon_id)
);

-- العروض
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  discount_percent REAL DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- عروض ↔ أصناف
CREATE TABLE IF NOT EXISTS offer_items (
  offer_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  PRIMARY KEY (offer_id, item_id)
);

-- الإحصائيات
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- المستخدمين
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_restaurant ON categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_restaurant ON analytics(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics(event_type);
