import { Hono } from 'hono';

type Bindings = { DB: D1Database };

type Variables = {
  user: { userId: string; restaurantId: string; role: string };
};

type AppType = { Bindings: Bindings; Variables: Variables };

export const adminRoutes = new Hono<AppType>();

// Middleware: Simple auth check
adminRoutes.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'غير مصرح' }, 401);
  }
  try {
    const token = authHeader.slice(7);
    const decoded = JSON.parse(atob(token));
    c.set('user', decoded);
    await next();
  } catch {
    return c.json({ error: 'رمز غير صالح' }, 401);
  }
});

// GET /api/admin/restaurant
adminRoutes.get('/restaurant', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;

  const restaurant = await db.prepare(
    'SELECT * FROM restaurants WHERE id = ?'
  ).bind(user.restaurantId).first();

  return c.json(restaurant);
});

// PUT /api/admin/restaurant
adminRoutes.put('/restaurant', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const body = await c.req.json();

  await db.prepare(
    'UPDATE restaurants SET name = ?, whatsapp_number = ?, description = ? WHERE id = ?'
  ).bind(body.name, body.whatsapp_number, body.description, user.restaurantId).run();

  return c.json({ ok: true });
});

// ====== التصنيفات ======

adminRoutes.get('/categories', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;

  const categories = await db.prepare(
    'SELECT * FROM categories WHERE restaurant_id = ? ORDER BY sort_order'
  ).bind(user.restaurantId).all();

  return c.json(categories.results);
});

adminRoutes.post('/categories', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const body = await c.req.json();
  const id = crypto.randomUUID();

  await db.prepare(
    'INSERT INTO categories (id, restaurant_id, name, icon, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, user.restaurantId, body.name, body.icon || '🍽️', body.sort_order || 0).run();

  return c.json({ id, ok: true });
});

adminRoutes.put('/categories/:id', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const { id } = c.req.param();
  const body = await c.req.json();

  await db.prepare(
    'UPDATE categories SET name = ?, icon = ?, sort_order = ?, is_active = ? WHERE id = ? AND restaurant_id = ?'
  ).bind(body.name, body.icon, body.sort_order, body.is_active ? 1 : 0, id, user.restaurantId).run();

  return c.json({ ok: true });
});

adminRoutes.delete('/categories/:id', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const { id } = c.req.param();

  await db.prepare('DELETE FROM categories WHERE id = ? AND restaurant_id = ?')
    .bind(id, user.restaurantId).run();

  return c.json({ ok: true });
});

// ====== الأصناف ======

adminRoutes.get('/items', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;

  const items = await db.prepare(
    'SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY sort_order'
  ).bind(user.restaurantId).all();

  return c.json(items.results);
});

adminRoutes.post('/items', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const body = await c.req.json();
  const id = crypto.randomUUID();

  await db.prepare(
    'INSERT INTO menu_items (id, restaurant_id, category_id, name, name_en, description, price_syp, price_usd, image_url, is_featured, is_available, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, user.restaurantId, body.category_id, body.name, body.name_en || '', body.description || '', body.price_syp, body.price_usd || 0, body.image_url || '', body.is_featured ? 1 : 0, 1, body.sort_order || 0).run();

  return c.json({ id, ok: true });
});

adminRoutes.put('/items/:id', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const { id } = c.req.param();
  const body = await c.req.json();

  await db.prepare(
    'UPDATE menu_items SET name = ?, name_en = ?, description = ?, price_syp = ?, price_usd = ?, image_url = ?, category_id = ?, is_featured = ?, is_available = ?, sort_order = ? WHERE id = ? AND restaurant_id = ?'
  ).bind(body.name, body.name_en || '', body.description || '', body.price_syp, body.price_usd || 0, body.image_url || '', body.category_id, body.is_featured ? 1 : 0, body.is_available ? 1 : 0, body.sort_order || 0, id, user.restaurantId).run();

  return c.json({ ok: true });
});

adminRoutes.delete('/items/:id', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const { id } = c.req.param();

  await db.prepare('DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?')
    .bind(id, user.restaurantId).run();
  await db.prepare('DELETE FROM item_addons WHERE item_id = ?').bind(id).run();

  return c.json({ ok: true });
});

// ====== الإضافات ======

adminRoutes.get('/addons', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const addons = await db.prepare('SELECT * FROM addons WHERE restaurant_id = ? AND is_active = 1').bind(user.restaurantId).all();
  return c.json(addons.results);
});

adminRoutes.post('/addons', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const body = await c.req.json();
  const id = crypto.randomUUID();

  await db.prepare('INSERT INTO addons (id, restaurant_id, name, price_syp, price_usd) VALUES (?, ?, ?, ?, ?)')
    .bind(id, user.restaurantId, body.name, body.price_syp || 0, body.price_usd || 0).run();

  return c.json({ id, ok: true });
});

adminRoutes.delete('/addons/:id', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const { id } = c.req.param();

  await db.prepare('DELETE FROM addons WHERE id = ? AND restaurant_id = ?').bind(id, user.restaurantId).run();
  await db.prepare('DELETE FROM item_addons WHERE addon_id = ?').bind(id).run();

  return c.json({ ok: true });
});

// ====== العروض ======

adminRoutes.get('/offers', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const offers = await db.prepare('SELECT * FROM offers WHERE restaurant_id = ? ORDER BY created_at DESC').bind(user.restaurantId).all();
  return c.json(offers.results);
});

adminRoutes.post('/offers', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const body = await c.req.json();
  const id = crypto.randomUUID();

  await db.prepare(
    'INSERT INTO offers (id, restaurant_id, title, description, discount_percent, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, user.restaurantId, body.title, body.description || '', body.discount_percent || 0, body.start_date, body.end_date).run();

  if (body.item_ids && body.item_ids.length > 0) {
    for (const itemId of body.item_ids) {
      await db.prepare('INSERT INTO offer_items (offer_id, item_id) VALUES (?, ?)').bind(id, itemId).run();
    }
  }

  return c.json({ id, ok: true });
});

adminRoutes.delete('/offers/:id', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const { id } = c.req.param();

  await db.prepare('DELETE FROM offers WHERE id = ? AND restaurant_id = ?').bind(id, user.restaurantId).run();
  await db.prepare('DELETE FROM offer_items WHERE offer_id = ?').bind(id).run();

  return c.json({ ok: true });
});

// ====== الإحصائيات ======

adminRoutes.get('/stats', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;

  const [views, orders, categories, items] = await Promise.all([
    db.prepare("SELECT COUNT(*) as count FROM analytics WHERE restaurant_id = ? AND event_type = 'view'").bind(user.restaurantId).first(),
    db.prepare("SELECT COUNT(*) as count FROM analytics WHERE restaurant_id = ? AND event_type = 'whatsapp_order'").bind(user.restaurantId).first(),
    db.prepare('SELECT COUNT(*) as count FROM categories WHERE restaurant_id = ?').bind(user.restaurantId).first(),
    db.prepare('SELECT COUNT(*) as count FROM menu_items WHERE restaurant_id = ?').bind(user.restaurantId).first(),
  ]);

  const dailyViews = await db.prepare(
    "SELECT date(created_at) as date, COUNT(*) as count FROM analytics WHERE restaurant_id = ? AND event_type = 'view' AND date(created_at) >= date('now', '-7 days') GROUP BY date(created_at) ORDER BY date"
  ).bind(user.restaurantId).all();

  return c.json({
    totalViews: (views as any)?.count || 0,
    totalOrders: (orders as any)?.count || 0,
    totalCategories: (categories as any)?.count || 0,
    totalItems: (items as any)?.count || 0,
    dailyViews: dailyViews.results,
  });
});
