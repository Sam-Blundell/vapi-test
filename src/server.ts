import { Hono } from 'hono';

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

// 404
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

export default app;

