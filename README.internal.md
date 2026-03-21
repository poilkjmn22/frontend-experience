# frontend-experience-monorepo（内部版）

公司统一的前端体验监控基础设施，当前处于 MVP 阶段。

本仓库以“可落地、可维护、可演进”为目标，覆盖：

- 前端体验数据采集（SDK）
- 后端 ingest 服务
- ClickHouse 存储
- Grafana 可视化分析

---

## 一、项目定位

这是一个试水级但生产可用的前端体验监控系统，用于：

- 量化性能与体验问题
- 辅助版本发布回归判断
- 为后续平台化提供真实数据与演进依据

当前刻意不做：

- 分布式链路追踪
- Kafka / Flink 流式架构
- Session Replay
- 用户画像与会话重建
- 平台级告警中心

原则：前端团队自己能维护，不成为平台级负担。

---

## 二、Monorepo 结构说明

```txt
frontend-experience/
├─ packages/
│  ├─ core
│  ├─ vitals
│  ├─ error
│  ├─ css
│  ├─ react
│  └─ preset-spa
├─ apps/
│  └─ ingest-service
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
└─ tsup.config.ts
```

各包职责如下：

- `packages/core`：`initCore()`、`report()`、context、采样
- `packages/vitals`：Web Vitals 采集
- `packages/error`：`js-error`、`promise-error`
- `packages/css`：`white-screen`、`css-visibility-error`
- `packages/react`：`react-error`、`react-render`
- `packages/preset-spa`：默认组合 `vitals`、`error`、`css`、`route`、`longtask`
- `apps/ingest-service`：接收、校验、扁平化、写入 ClickHouse

为什么 SDK 和后端放在一个仓库：

- Schema / Payload 更容易保持一致
- 本地联调成本更低
- SDK 升级时可同步调整 ingest
- 后续仍可按需拆仓

---

## 三、前端 SDK 现状

技术栈：

- TypeScript
- tsup
- pnpm workspace
- `web-vitals`
- React Profiler（可选）

SDK 设计原则：

- 插件化
- 默认安全：采样、try/catch、fail-silent
- 不影响业务主线程
- 不做默认侵入式 patch

### 实际接入方式

当前源码中的接入入口是 `initCore()` + `spaPreset()`，不是 `createExperience()`。

```ts
import { initCore } from '@whnz/frontend-experience-core';
import { spaPreset } from '@whnz/frontend-experience-preset-spa';

initCore({
  app: 'order-spa',
  env: 'prod',
  version: '1.2.3',
  reporter: '/api/experience/report',
  sample: 0.1,
});

spaPreset().forEach((plugin) => plugin.setup());
```

### 当前默认信号

默认 `spaPreset()` 已包含：

- `fcp`
- `lcp`
- `cls`
- `inp`
- `longtask`
- `route`
- `js-error`
- `promise-error`
- `white-screen`
- `css-visibility-error`

React 相关能力需要单独引入 `@whnz/frontend-experience-react`：

- `react-error`
- `react-render`

### 当前代码边界

- `packages/core/src/types.ts` 允许插件扩展事件类型
- `css-covered` 已在类型和 ingest schema 中声明，但当前没有明确采集实现
- `report()` 当前是单条事件上报路径，队列批量逻辑存在但未启用
- 采样在 SDK 侧进行，当前为随机采样

---

## 四、后端 ingest 服务现状

技术栈：

- Fastify
- Zod
- ClickHouse
- TypeScript + tsup

职责边界：

1. 接收 `/api/experience/report`
2. 兼容 `text/plain`，支持 `sendBeacon`
3. 做基础结构校验
4. `normalize` 扁平化
5. 写入 `experience.events`

明确不做：

- 聚合计算
- 告警
- 用户维度重建
- 流式处理

### 当前实现注意点

- 目前只处理单条事件对象，不支持数组批量写入
- `reportSchema` 对不同事件做了少量语义校验，例如 `longtask` 要求 `duration`
- 设备信息当前只包含 `ua` 和 `network`
- 路由、错误、扩展字段都进入单表明细模型
- ClickHouse client 当前使用固定账号 `default` / `123456`
- 路由中仍保留 `console.dir(payload)` 调试输出

---

## 五、数据模型现状

ClickHouse 表为 `experience.events`，当前字段大致分为：

- 基础维度：`app`、`env`、`version`
- 事件维度：`type`、`name`、`route`、`component`
- 数值字段：`value`、`duration`、`rating`
- 错误字段：`message`、`stack`
- 设备字段：`ua`、`network`
- 扩展字段：`extra JSON`

这套模型当前更适合：

- 趋势分析
- Top 问题定位
- 版本间手工对比

不适合：

- 会话回放
- 单用户行为重建
- 高复杂度实时分析
- 多租户平台化隔离

### 详细事件矩阵与字段映射

为了避免 README 继续膨胀，事件类型矩阵、payload 语义和 ClickHouse 字段映射已拆到：

- `.cursor/skills/frontend-experience-iteration/reference.md`

后续新增事件类型时，建议先更新该 reference，再同步修改 SDK、ingest schema、normalize、SQL 与 dashboard。

这个 reference 更适合承担团队协作中的“事实来源”角色，用来回答：

- 某个事件当前是否真的已实现
- 某个字段在哪一层出现、在哪一层落库
- 新增事件时需要同步改哪些位置

---

## 六、本地开发与联调

依赖：

- Node.js >= 18
- pnpm >= 8
- Docker

启动 ClickHouse：

```bash
docker run -d \
  --name clickhouse \
  -p 8123:8123 \
  -p 9000:9000 \
  clickhouse/clickhouse-server
```

初始化表：

```bash
docker exec -i clickhouse clickhouse-client < apps/ingest-service/sql/init.sql
```

启动 ingest：

```bash
cd apps/ingest-service
pnpm dev
```

根目录常用命令：

```bash
pnpm build
pnpm typecheck
pnpm dev
```

---

## 七、Grafana 使用说明

当前 Grafana 侧默认依赖 ClickHouse 明细查询。

已存在的 dashboard 资源主要用于观察：

- Web Vitals 趋势
- 卡顿分布
- 错误 Top
- 版本对比

仓库中已有 dashboard JSON，可作为继续演进的基础。

---

## 八、当前风险与下一步

已知风险：

- ingest 仍是单体服务
- 无数据清洗 / 回填机制
- SDK schema 仍可能继续演进
- 公开文档与源码实现曾有偏差，后续需保持同步

优先级较高的演进方向：

- 抽出共享 schema package
- 支持批量上报与批量写入
- 形成稳定的 dashboard 模板
- 补最小 demo / smoke test
- 再考虑发布回归告警

---

## 九、维护说明

- SDK 与 ingest 由前端团队维护
- ClickHouse / Grafana 可由平台或 SRE 协作托管
- 任何跨层变更都应同步检查 SDK 类型、ingest schema、normalize、SQL 与 README
