import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'ep-odd-darkness-ahjesyay.c-3.us-east-1.aws.neon.tech',
    port: 5432,
    user: 'neondb_owner',
    password: 'npg_iKF2UZmYPhQ5',
    database: 'neondb',
    ssl: true,
  },
});
