# ingest 服务

接收前端 SDK 上报，校验后写入 **ClickHouse**。

## 常用命令

```bash
pnpm dev    # 开发
pnpm build  # 构建
pnpm start  # 运行 dist
```

## 相关文档

- 库表初始化：`sql/init.sql`
- **Grafana** 自建与迁移（勿再依赖本目录下的二进制 Grafana 目录）：[`GRAFANA.md`](GRAFANA.md)
