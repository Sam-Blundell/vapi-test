import type { Context, Next } from 'hono';

function parseOrigins(input: string | undefined): string[] | '*'
{
  if (!input || input.trim() === '') return '*';
  const items = input.split(',').map((s) => s.trim()).filter(Boolean);
  return items.length ? items : '*';
}

export function corsMiddleware(originsEnv = process.env.CORS_ORIGINS) {
  const origins = parseOrigins(originsEnv);
  return async (c: Context, next: Next) => {
    const origin = c.req.header('origin') ?? '';
    const allowed = origins === '*' || (origin && (origins as string[]).includes(origin));

    // Preflight
    if (c.req.method === 'OPTIONS') {
      c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
      c.header('Access-Control-Allow-Headers', 'content-type, authorization, x-api-key');
      c.header('Access-Control-Max-Age', '600');
      if (allowed && origin) c.header('Access-Control-Allow-Origin', origin);
      return new Response(null, { status: 204 });
    }

    if (allowed && origin) c.header('Access-Control-Allow-Origin', origin);
    await next();
  };
}
