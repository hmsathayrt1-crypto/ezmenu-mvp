import { Hono } from 'hono';

type Bindings = { DB: D1Database };

export const authRoutes = new Hono<{ Bindings: Bindings }>();

// POST /api/auth/login
authRoutes.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  const db = c.env.DB;

  if (!email || !password) {
    return c.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, 400);
  }

  try {
    const user = await db.prepare(
      'SELECT u.id, u.email, u.role, u.restaurant_id, r.name as restaurant_name, r.slug FROM users u JOIN restaurants r ON u.restaurant_id = r.id WHERE u.email = ? AND u.password_hash = ?'
    ).bind(email, password).first();

    if (!user) {
      return c.json({ error: 'بيانات الدخول غير صحيحة' }, 401);
    }

    // Simple token: base64 encoded JSON (MVP — replace with JWT later)
    const token = btoa(JSON.stringify({ userId: user.id, restaurantId: user.restaurant_id, role: user.role }));

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurant_id,
        restaurantName: user.restaurant_name,
        restaurantSlug: user.slug,
      },
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});
