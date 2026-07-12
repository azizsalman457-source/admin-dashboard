import 'dotenv/config';
console.log("Loaded URL:", process.env.DIRECT_URL);
import{defineConfig} from 'drizzle-kit';

if (!process.env.DIRECT_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect:'postgresql',
  dbCredentials: {
    url: process.env.DIRECT_URL,
  },
});