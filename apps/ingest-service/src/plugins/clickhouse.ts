import { createClient } from '@clickhouse/client';
import { env } from '../env';
export const clickhouse = createClient({
  host: env.clickhouseHost,
  database: env.database,
  username: 'default',
  password: '123456',
});
