# Grafana 部署说明（与 ingest 解耦）

## 推荐方式

本仓库的 **Grafana** 已统一放在仓库根目录的 **`deploy/grafana/`**，通过 **Docker Compose** 运行，并使用 **provisioning** 注册 **ClickHouse** 数据源与 **Dashboard**。

- **ingest**（本目录应用）只负责接收上报并写入 **ClickHouse**
- **Grafana** 只读查询，不应再与 ingest 代码混在同一部署单元里

详细步骤见：[`../../deploy/grafana/README.md`](../../deploy/grafana/README.md)。

## 关于旧目录 `grafana-12.3.2/`

若你本地仍保留历史上放在 `apps/ingest-service/grafana-12.3.2/`（或其它路径）下的 **Grafana 二进制解压目录**：

1. **不要**再将其作为团队标准部署方式；该方式难以版本对齐、难以在 CI 中复现。
2. 请迁移到 **`deploy/grafana`**：使用同一 **Grafana** 镜像版本（如 `12.3.2`）与 **`grafana-clickhouse-datasource`** 插件。
3. 将面板 JSON 以文件形式纳入 `deploy/grafana/dashboards/`（可与本目录旁的 `grapanaDashboard.json` 保持内容同步）。
4. 旧目录可在确认无引用后删除，并加入 **`.gitignore`**（若尚未忽略）。

## Dashboard JSON 的单一来源

- 开发中常改的文件：`apps/ingest-service/grapanaDashboard.json`（历史命名保留）
- 面向部署的副本：`deploy/grafana/dashboards/frontend-experience.json`

发布或交付运维时，请以 **`deploy/grafana`** 侧文件为准，并在变更后同步两份，避免漂移。
