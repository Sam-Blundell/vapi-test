import { Hono } from 'hono';
import api from './api.ts';

const app = new Hono();

// tiny logger
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${c.req.method} ${new URL(c.req.url).pathname} -> ${c.res.status} ${ms}ms`);
});

// health
app.get('/health', (c) => c.text('ok'));

// plain hello
app.get('/hello', (c) => {
  const name = c.req.query('name') ?? 'World';
  return c.json({ message: `hello, ${name}!` });
});

// api routes
app.route('/api', api);

// healthz (optional deep check)
app.get('/healthz', async (c) => {
  const deep = c.req.query('deep');
  if (deep === '1') {
    try {
      // lightweight DB check via people count
      const res = (await import('./db.ts')).default.query('SELECT COUNT(*) as cnt FROM people').get() as { cnt: number };
      return c.json({ ok: true, db: { people: res.cnt } });
    } catch {
      return c.json({ ok: false, db: { error: 'unavailable' } }, 503);
    }
  }
  return c.text('ok');
});

// 404
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

export default app;

