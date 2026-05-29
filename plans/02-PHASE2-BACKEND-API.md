# Phase 2 — Backend API + قاعدة البيانات

## 🎯 الهدف
بناء API كامل باستخدام Cloudflare Workers + Hono + D1 يخدم واجهة الزبون ولوحة التحكم.

## ✅ المهام

### Task 2.1: إعداد Backend
- [ ] إنشاء مشروع Cloudflare Workers مع Hono
- [ ] إعداد `wrangler.toml` مع D1 binding
- [ ] إعداد CORS headers
- [ ] هيكل المجلدات: routes, middleware, utils, types

### Task 2.2: مخطط قاعدة البيانات (D1 Schema)
```sql
-- المطاعم
CREATE TABLE restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  whatsapp_number TEXT,
  currency_default TEXT DEFAULT 'SYP',
  description TEXT,
  address TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- التصنيفات
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  parent_id TEXT,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- الأصناف
CREATE TABLE menu_items (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_syp REAL,
  price_usd REAL,
  image_url TEXT,
  badge TEXT, -- 'featured', 'new', 'spicy', etc.
  is_available INTEGER DEFAULT 1,
  is_featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- الإضافات
CREATE TABLE extras (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price_syp REAL,
  price_usd REAL,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- أصناف ↔ إضافات (many-to-many)
CREATE TABLE item_extras (
  item_id TEXT NOT NULL,
  extra_id TEXT NOT NULL,
  PRIMARY KEY (item_id, extra_id)
);

-- العروض
CREATE TABLE offers (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  discount_percent REAL,
  start_date TEXT,
  end_date TEXT,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- عروض ↔ أصناف
CREATE TABLE offer_items (
  offer_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  PRIMARY KEY (offer_id, item_id)
);

-- الإحصائيات (زيارات + طلبات)
CREATE TABLE analytics (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'whatsapp_order', 'qr_scan'
  data TEXT, -- JSON
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- المستخدمين (Admin)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin', -- 'admin', 'super_admin'
  created_at TEXT DEFAULT (datetime('now'))
);
```

### Task 2.3: API Routes — القائمة (Public)
- [ ] `GET /api/menu/:slug` — جلب كلشي (مطعم + تصنيفات + أصناف + عروض)
- [ ] `GET /api/menu/:slug/categories` — التصنيفات فقط
- [ ] `GET /api/menu/:slug/items` — الأصناف مع تصفية بالتصنيف
- [ ] `GET /api/menu/:slug/offers` — العروض النشطة
- [ ] `POST /api/menu/:slug/analytics` — تسجيل حدث (زيارة/طلب)

### Task 2.4: API Routes — المصادقة
- [ ] `POST /api/auth/login` — تسجيل دخول (email + password)
- [ ] `POST /api/auth/register` — تسجيل (super_admin فقط)
- [ ] Middleware: التحقق من JWT token

### Task 2.5: API Routes — لوحة التحكم (Protected)
- [ ] `GET /api/admin/restaurant` — بيانات المطعم
- [ ] `PUT /api/admin/restaurant` — تحديث بيانات المطعم
- [ ] `POST /api/admin/restaurant/logo` — رفع الشعار
- [ ] CRUD `/api/admin/categories`
- [ ] CRUD `/api/admin/menu-items` (مع رفع صور)
- [ ] CRUD `/api/admin/extras`
- [ ] CRUD `/api/admin/offers`
- [ ] `GET /api/admin/stats` — إحصائيات (زيارات + طلبات واتساب)

### Task 2.6: صور R2
- [ ] إعداد R2 bucket
- [ ] Endpoint رفع صور `POST /api/admin/upload`
- [ ] توليد URL عام للصور
- [ ] ضغط تلقائي (resize → 400px width)

### Task 2.7: Seeder
- [ ] بيانات تجريبية كاملة (مطعم + تصنيفات + أصناف)
- [ ] مستخدم admin تجريبي

## 📦 المخرجات
- API شغال على Cloudflare Workers
- قاعدة بيانات D1 مع schema + seed data
- جميع endpoints تعمل ومختبرة
- رفع صور يعمل مع R2

## ⏱️ الوقت المتوقع: 6-8 ساعات (وكيل واحد)
