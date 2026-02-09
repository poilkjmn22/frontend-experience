export const env = {
  port: Number(process.env.PORT ?? 3000),
  clickhouseHost: process.env.CLICKHOUSE_HOST ?? 'http://localhost:9000',
  database: process.env.CLICKHOUSE_DB ?? 'experience',
};
