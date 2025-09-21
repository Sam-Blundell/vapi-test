import app from './server.ts';
import { serve } from 'bun';

const PORT = Number(process.env.PORT ?? 3000);
serve({ port: PORT, fetch: app.fetch });
console.log(`listening on http://localhost:${PORT}`);

