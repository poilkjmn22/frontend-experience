---
name: frontend-experience-iteration
description: 梳理并扩展 frontend-experience 监控系统的 SDK、ingest、ClickHouse 与 Grafana 能力边界。Use when the user asks to add signals, evolve schemas, refactor the frontend monitoring SDK, extend the ingest service, align docs with code, or iterate on frontend observability architecture in this repository.
---

# Frontend Experience Iteration

## 适用场景

在这个仓库里，用户如果提出以下需求，应优先应用本 skill：

- 扩展前端体验监控能力
- 新增或调整埋点事件类型
- 修改 SDK / ingest / ClickHouse schema
- 对齐 README 与真实实现
- 规划下一阶段平台化能力，但仍需保持 MVP 边界

## 先判断改动层级

先把需求归到一个层级，再继续实现：

1. `packages/*`：前端 SDK 能力
2. `apps/ingest-service`：接收、校验、落库
3. `apps/ingest-service/sql/init.sql`：存储模型
4. `apps/ingest-service/grapanaDashboard.json`：可视化
5. `README.public.md` / `README.internal.md`：对外/对内叙述

如果一个需求跨越多层，默认顺序是：

1. 事件模型
2. SDK 上报
3. ingest 校验与 normalize
4. ClickHouse 表结构
5. Grafana 展示
6. 文档更新

## 当前系统边界

当前仓库是一个前端团队可自维护的体验监控 MVP，不是完整 APM 平台。

### 已实现能力

前端 SDK 已具备以下采集能力：

- Web Vitals：`fcp`、`lcp`、`cls`、`inp`
- 卡顿：`longtask`
- SPA 路由耗时：`route`
- JS 错误：`js-error`
- Promise 未处理异常：`promise-error`
- React 错误边界：`react-error`
- React 渲染耗时：`react-render`
- 白屏检测：`white-screen`
- 关键节点可见性检测：`css-visibility-error`

后端 ingest 已具备以下职责：

- 接收 `/api/experience/report`
- 用 Zod 做基础结构校验
- 将事件扁平化为单表写入 ClickHouse `experience.events`
- 允许 Grafana 直接基于明细表查询

### 刻意不做的能力

除非用户明确要求升级系统边界，否则不要默认把需求扩成以下方向：

- 分布式链路追踪
- Kafka / Flink / 流式计算链路
- Session Replay
- 用户画像与会话重建
- 自动告警平台
- 聚合计算服务
- RUM 全链路平台化控制台

## 真实代码现状

实现时应以源码为准，不要只信 README。

### SDK 现状

- `packages/core` 提供 `initCore()`、`report()`、上下文与采样
- `packages/preset-spa` 当前导出的是 `spaPreset()`，不是 README.public.md 中展示的 `createExperience()`
- `packages/preset-spa` 默认组合了 `vitals`、`error`、`css`、`route`、`longtask`
- `packages/react` 是独立包，不在 `spaPreset()` 默认集合内

### 事件类型现状

源码中声明过但当前没有明确生产端实现的类型：

- `css-covered`

新增事件类型时，至少同步以下位置：

1. `packages/core/src/types.ts`
2. `apps/ingest-service/src/schema/report.ts`
3. `apps/ingest-service/src/utils/normalize.ts`
4. `apps/ingest-service/sql/init.sql`（如需要新字段）
5. 对应 SDK 插件源码

### ingest 现状

- 目前只处理单条事件对象，不支持批量数组写入
- 只做接收、校验、扁平化、落库，不做聚合/告警
- `text/plain` 被显式解析，以兼容 `sendBeacon`
- 落库前会 `console.dir(payload)`，这是调试痕迹，不是成熟审计链路

### 数据模型现状

当前是单表明细模型，核心字段包括：

- 基础维度：`app`、`env`、`version`
- 事件维度：`type`、`name`、`route`、`component`
- 数值字段：`value`、`duration`、`rating`
- 错误字段：`message`、`stack`
- 设备字段：`ua`、`network`
- 扩展字段：`extra JSON`

这意味着当前系统更适合：

- 趋势分析
- Top 问题定位
- 版本间手工对比

而不适合：

- 精细用户会话还原
- 高复杂度实时分析
- 大规模多租户隔离

## 文档与代码差异

做变更前先检查是否需要顺手修正文档。

当前已知差异：

- `README.public.md` 展示了 `createExperience()`，但源码暂无该 API
- 对外文档写了 `React Profiler`，但默认 `spaPreset()` 不自动接入 React 包
- 文档提到 release comparison / roadmap，但代码中尚无自动回归分析与告警闭环
- 内部文档提到 schema 共享包是后续方向，当前仓库里还没有独立 shared schema package

如果本次需求不是补齐这些差异，就不要擅自把目标态文档当成现状能力。

## 推荐迭代策略

### 小步迭代优先级

优先做这些高收益、低复杂度改动：

1. 对齐 README 与真实导出 API
2. 抽出共享事件 schema / payload 类型
3. 支持批量上报与批量写入
4. 为 Grafana 补充稳定 dashboard 模板
5. 增加最小可用 demo / fixture / smoke test

### 新能力接入原则

新增信号时遵循以下原则：

- 先复用现有单表模型，只有字段明显不够时再扩表
- 优先放进 `extra`，避免过早引入复杂 schema 演进
- 保持 SDK fail-silent，不影响业务线程
- 避免默认侵入式 patch
- 能做可选插件就不要直接塞进 `core`
- 能在 ingest 侧 normalize，就不要把前端 payload 设计得过重

### 什么时候需要升级系统边界

满足下列情况之一，再考虑从 MVP 升级为平台化设计：

- 事件量已逼近单表 + 单 ingest 的吞吐瓶颈
- 多个业务线需要强隔离
- 出现稳定的告警、回填、重放需求
- 需要跨端统一 schema 治理
- 需要按版本、环境、应用做自动回归判断

## 常用实现路径

### 新增一个事件类型

按这个顺序改：

1. 明确事件语义：是 `value` 型、`duration` 型，还是错误型
2. 在 `packages/core/src/types.ts` 增加类型
3. 在对应插件实现采集与 `report()`
4. 在 `apps/ingest-service/src/schema/report.ts` 增加校验
5. 在 `apps/ingest-service/src/utils/normalize.ts` 处理默认值
6. 如需新列，再改 `apps/ingest-service/sql/init.sql`
7. 补 dashboard 查询口径
8. 更新 README

### 新增一个前端插件

优先放在 `packages/<plugin-name>`，不要直接把逻辑写进 `core`。

插件应满足：

- 暴露 `name` 和 `setup()`
- 内部只负责采集，不负责存储策略
- 统一通过 `report()` 上报
- 出错时吞掉异常，不影响业务运行

### 扩展 ingest

ingest 适合做：

- 请求兼容
- 数据校验
- schema 演进兼容
- 扁平化与默认值补齐
- 批量写入优化

ingest 不适合做：

- 复杂聚合
- 业务规则判断
- 高耦合告警逻辑
- 面向单用户的重建分析

## 变更检查清单

提交前至少确认：

- [ ] 事件类型是否在 SDK 类型与 ingest schema 中同步
- [ ] SDK 变更是否保持 fail-silent
- [ ] `sendBeacon` / `text/plain` 兼容是否被破坏
- [ ] ClickHouse 字段与 normalize 是否一致
- [ ] README 是否仍描述真实现状
- [ ] 本次改动是否无意中把 MVP 扩成平台工程

## 当前风险提示

看到下面这些情况时，应主动提醒用户：

- 想直接引入 Kafka、Flink、画像、回放，这会明显突破当前系统边界
- 想在不改 schema 的情况下承载复杂分析场景
- 想把 React 能力误认为默认 preset 已包含
- 想依赖 `createExperience()`，但源码还没有该入口
- 想做“发布回归自动告警”，但当前链路还缺共享 schema、聚合和规则层

## 输出风格

当你基于本 skill 给出建议或实施方案时，优先使用以下结构：

1. 当前需求落在哪一层
2. 是否突破现有功能边界
3. 最小可行改法
4. 如果继续演进，下一步应该补什么

保持结论简洁，优先帮助用户区分：

- 已有能力
- 缺失能力
- 可低成本补齐的能力
- 需要架构升级才能做的能力

## 参考资料

- 事件类型矩阵与字段映射：见 [reference.md](reference.md)
