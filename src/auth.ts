import type { Context, Next } from 'hono';
import { jsonError } from './errors.ts';

export async function apiKeyMiddleware(c: Context, next: Next) {
  const requiredKey = process.env.API_KEY;
  if (!requiredKey) return next();

  const headerKey = c.req.header('x-api-key');
  const auth = c.req.header('authorization');
  const bearer = auth?.toLowerCase().startsWith('bearer ')
    ? auth.slice(7)
    : undefined;

  const provided = headerKey ?? bearer;
  if (provided && provided === requiredKey) return next();

  return jsonError(c, 'UNAUTHORIZED', 'missing or invalid API key', 401);
}
