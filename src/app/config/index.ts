import dotenv from 'dotenv';
import path from 'path';
const envDir: string = path.join(process.cwd(), '.env');
dotenv.config({ path: envDir });

export default {
  port: process.env.PORT,
  db_url: process.env.DATABASE_URL,
};
