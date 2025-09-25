import type { Context } from 'hono';

type ErrorCode = 'VALIDATION_ERROR' | 'INVALID_ID' | 'MISSING_QUERY' | 'NOT_FOUND' | 'DUPLICATE';

export function jsonError(c: Context, code: ErrorCode, message: string, status: 400 | 404 | 409) {
  return c.json({ code, message }, status);
}
