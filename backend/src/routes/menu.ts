import { Hono } from 'hono';

type Bindings = { DB: D1Database };

export const menuRoutes = new Hono<{ Bindings: Bindings }>();

// GET /api/menu/:slug — جلب القائمة كاملة (الزبون)
menuRoutes.get('/:slug', async (c) => {
  const { slug } = c.req.param();
  const db = c.env.DB;

  try {
    // المطعم
    const restaurant = await db.prepare(
      'SELECT id, name, slug, logo_url, whatsapp_number, description FROM restaurants WHERE slug = ? AND is_active = 1'
    ).bind(slug).first();

    if (!restaurant) {
      return c.json({ error: 'المطعم غير موجود' }, 404);
    }

    // التصنيفات
    const categories = await db.prepare(
      'SELECT id, name, icon, sort_order FROM categories WHERE restaurant_id = ? AND is_active = 1 ORDER BY sort_order'
    ).bind(restaurant.id).all();

    // الأصناف
    const items = await db.prepare(
      'SELECT id, category_id, name, name_en, description, price_syp, price_usd, image_url, is_featured, is_available FROM menu_items WHERE restaurant_id = ? AND is_available = 1 ORDER BY sort_order'
    ).bind(restaurant.id).all();

    // الإضافات لكل صنف
    const itemIds = items.results.map((i: any) => i.id);
    let addonsMap: Record<string, any[]> = {};

    if (itemIds.length > 0) {
      const placeholders = itemIds.map(() => '?').join(',');
      const addons = await db.prepare(
        `SELECT ia.item_id, a.id, a.name, a.price_syp, a.price_usd FROM item_addons ia JOIN addons a ON ia.addon_id = a.id WHERE ia.item_id IN (${placeholders}) AND a.is_active = 1`
      ).bind(...itemIds).all();

      for (const a of addons.results as any[]) {
        if (!addonsMap[a.item_id]) addonsMap[a.item_id] = [];
        addonsMap[a.item_id].push({ id: a.id, name: a.name, price_syp: a.price_syp, price_usd: a.price_usd });
      }
    }

    // العروض النشطة
    const offers = await db.prepare(
      `SELECT o.id, o.title, o.description, o.discount_percent FROM offers o WHERE o.restaurant_id = ? AND o.is_active = 1 AND date(o.start_date) <= date('now') AND date(o.end_date) >= date('now')`
    ).bind(restaurant.id).all();

    // دمج الإضافات مع الأصناف
    const itemsWithAddons = items.results.map((item: any) => ({
      ...item,
      addons: addonsMap[item.id] || [],
    }));

    return c.json({
      restaurant,
      categories: categories.results,
      items: itemsWithAddons,
      offers: offers.results,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/menu/:slug/analytics — تسجيل حدث
menuRoutes.post('/:slug/analytics', async (c) => {
  const { slug } = c.req.param();
  const body = await c.req.json();
  const db = c.env.DB;

  try {
    const restaurant = await db.prepare(
      'SELECT id FROM restaurants WHERE slug = ?'
    ).bind(slug).first();

    if (!restaurant) return c.json({ error: 'المطعم غير موجود' }, 404);

    const id = crypto.randomUUID();
    await db.prepare(
      'INSERT INTO analytics (id, restaurant_id, event_type, data) VALUES (?, ?, ?, ?)'
    ).bind(id, restaurant.id, body.event_type || 'view', JSON.stringify(body.data || {})).run();

    return c.json({ ok: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});
