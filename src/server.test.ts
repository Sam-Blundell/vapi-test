import { describe, it, expect } from 'bun:test';
process.env.DB_FILE = ':memory:';
import app from './server.ts';

describe('server routes', () => {
  it('GET /health returns ok (text)', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('ok');
  });

  it('GET /hello returns default JSON', async () => {
    const res = await app.request('/hello');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type') ?? '').toContain('application/json');
    const body = (await res.json()) as { message: string };
    expect(body).toEqual({ message: 'hello, World!' });
  });

  it('GET /hello?name=Sam customizes greeting', async () => {
    const res = await app.request('/hello?name=Sam');
    expect(res.status).toBe(200);
    const body = (await res.json()) as { message: string };
    expect(body.message).toBe('hello, Sam!');
  });

  it('unknown path returns JSON 404', async () => {
    const res = await app.request('/nope');
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type') ?? '').toContain('application/json');
    const body = (await res.json()) as { error: string };
    expect(body).toEqual({ error: 'Not Found' });
  });
});
