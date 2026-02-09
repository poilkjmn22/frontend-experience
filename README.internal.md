# frontend-experience-monorepo（内部版）

公司统一的前端体验监控基础设施（MVP 阶段）。

本仓库以 **“可落地、可维护、可演进”** 为目标，覆盖：
- 前端体验数据采集（SDK）
- 后端 ingest 服务
- ClickHouse 存储
- Grafana 可视化分析

---

## 一、项目定位

这是一个 **试水级但生产可用的前端体验监控系统**，用于：

- 量化性能与体验问题
- 辅助版本发布回归判断
- 为后续平台化提供数据与验证基础

当前 **刻意不做**：
- 分布式链路追踪
- Kafka / Flink 流式架构
- Session Replay / 用户画像

> 原则：**前端团队自己能维护，不成为平台级负担**

---

## 二、Monorepo 结构说明

```txt
frontend-experience-monorepo/
├─ packages/                  # 前端 SDK（npm 包）
│  ├─ core                    # 上报、调度、公共能力
│  ├─ vitals                  # Web Vitals
│  ├─ error                   # JS Error
│  ├─ css                     # CSS / 视觉异常
│  ├─ react                   # React Profiler
│  └─ preset-spa              # SPA 一站式集成
│
├─ apps/
│  └─ ingest-service          # 后端 ingest 服务
│
├─ configs/
│  └─ tsconfig.base.json      # TS 统一配置

为什么 SDK 和后端在一个仓库

Schema / Payload 强一致

本地联调成本低

SDK 升级可同步调整 ingest

后期可 随时拆仓，不影响现在效率



---

三、前端 SDK 技术说明

技术栈

TypeScript

tsup（esm + cjs + dts）

pnpm workspace

web-vitals

React Profiler（可选）


SDK 设计原则

插件化（vitals / error / css / react）

默认安全（采样、try/catch、fail silent）

不影响业务主线程

不做侵入式 patch（如重写 fetch）



---

四、后端 ingest 服务说明

技术栈

Fastify

ClickHouse

TypeScript + tsup


职责边界

ingest 服务只做：

1. 接收 SDK 上报


2. 基础校验 / 采样


3. 扁平化 & 写入 ClickHouse



不做：

聚合计算

告警

用户维度重建



---

五、本地开发 & 联调

依赖

Node.js >= 18

pnpm >= 8

Docker


启动 ClickHouse

docker run -d \
  --name clickhouse \
  -p 8123:8123 \
  -p 9000:9000 \
  clickhouse/clickhouse-server

Start clickhouse-server with:
clickhouse start --pid-path var/run/clickhouse-server --config-path etc/clickhouse-server --binary-path usr/local/bin

Start clickhouse-client with:
 clickhouse-client --password
初始化表：

docker exec -i clickhouse clickhouse-client \
  < apps/ingest-service/sql/init.sql

启动 ingest

cd apps/ingest-service
pnpm dev


---

六、Grafana 使用说明

ClickHouse 作为数据源

Dashboard JSON 已验证可用

支持：

Web Vitals 趋势

卡顿分布

错误 Top

发布前后对比




---

七、当前风险 & TODO

已知风险

ingest 为单体服务

无数据清洗 / 回填机制

SDK schema 仍可能变动


后续可演进方向

schema 共享包

告警阈值（发布维度）

多环境数据隔离



---

八、维护说明

SDK & ingest 由前端团队维护

ClickHouse / Grafana 可交由平台或 SRE
