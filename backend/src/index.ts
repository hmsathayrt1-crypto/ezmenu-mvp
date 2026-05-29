import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { menuRoutes } from './routes/menu';
import { adminRoutes } from './routes/admin';
import { authRoutes } from './routes/auth';

type Bindings = {
  DB: D1Database;
  ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use('*', cors({
  origin: ['*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/', (c) => c.json({ status: 'ok', service: 'ezmenu-api', version: '1.0.0' }));

// Routes
app.route('/api/menu', menuRoutes);
app.route('/api/auth', authRoutes);
app.route('/api/admin', adminRoutes);

export default app;
