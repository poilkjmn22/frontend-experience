# Frontend Experience 参考资料

这份文档用于补充 `SKILL.md`，作为团队协作时的事实清单。

适合回答以下问题：

- 当前到底有哪些事件类型已经落地
- 某个事件由哪个包负责采集
- 某个字段在前端、ingest、ClickHouse 中分别如何表示
- 新增事件或字段时要同步修改哪些位置

## 使用原则

修改监控能力时，优先遵循以下顺序：

1. 先更新这份 `reference.md`
2. 再修改 SDK / ingest / SQL / dashboard
3. 最后更新 `README.public.md` 与 `README.internal.md`

如果文档描述与源码冲突，以源码为准，并尽快回写到这份文档。

## 架构层级速览

当前链路可以分成四层：

1. SDK 采集层：`packages/*`
2. 上报与上下文层：`packages/core`
3. 接收与落库层：`apps/ingest-service`
4. 查询与展示层：ClickHouse + Grafana

其中：

- `packages/core` 负责 `initCore()`、`report()`、context、采样
- `packages/preset-spa` 负责默认组合插件
- `packages/react` 是独立可选包，不在默认 preset 内
- ingest 当前只接收单条事件对象

## 事件类型矩阵

下表中的“状态”含义：

- 已实现：源码中已有明确采集逻辑
- 已声明未实现：类型与 schema 已预留，但未见明确采集逻辑
- 可选：能力已实现，但不在默认 `spaPreset()` 中

| 事件类型 | 中文含义 | 来源包 | 默认是否接入 | 状态 | 主要数值字段 | 常见扩展字段 |
| --- | --- | --- | --- | --- | --- | --- |
| `fcp` | 首次内容绘制 | `packages/vitals` | 是 | 已实现 | `value` | 无 |
| `lcp` | 最大内容绘制 | `packages/vitals` | 是 | 已实现 | `value` | `extra.element` |
| `cls` | 累积布局偏移 | `packages/vitals` | 是 | 已实现 | `value` | 无 |
| `inp` | 交互响应延迟 | `packages/vitals` | 是 | 已实现 | `value` | 无 |
| `longtask` | 长任务 / 卡顿 | `packages/preset-spa` | 是 | 已实现 | `duration` | `extra.startTime` `extra.blockingTime` `extra.name` |
| `route` | 路由切换耗时 | `packages/preset-spa` | 是 | 已实现 | `duration` | `extra.from` `extra.to` `extra.startTime` `extra.success` |
| `js-error` | JS 运行时错误 | `packages/error` | 是 | 已实现 | 无 | `extra.file` `extra.line` `extra.col` |
| `promise-error` | 未处理 Promise 异常 | `packages/error` | 是 | 已实现 | 无 | `extra.reason` |
| `white-screen` | 白屏 | `packages/css` | 是 | 已实现 | 无 | 无 |
| `css-visibility-error` | 关键节点不可见 | `packages/css` | 是 | 已实现 | 无 | `extra.selector` |
| `react-error` | React 组件错误 | `packages/react` | 否 | 可选 | 无 | `extra.componentStack` |
| `react-render` | React 渲染耗时 | `packages/react` | 否 | 可选 | `duration` | `extra.id` `extra.phase` |
| `css-covered` | 关键节点被遮挡 | 无明确来源 | 否 | 已声明未实现 | 无 | 未定义 |

## 事件来源说明

### 默认接入链路

`spaPreset()` 当前会组合以下插件：

- `vitalsPlugin()`
- `errorPlugin()`
- `cssPlugin()`
- `routePlugin()`
- `longTaskPlugin()`

因此只要业务侧执行：

```ts
spaPreset().forEach((plugin) => plugin.setup());
```

默认就会采集：

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

### 非默认接入链路

`react-error` 与 `react-render` 需要业务侧单独接入 `@whnz/frontend-experience-react`。

这意味着：

- README 或方案介绍里提到 React 能力时，应明确标注“可选”
- 不要把 React 能力误写成默认 preset 已包含

## 统一 payload 字段说明

当前前端上报的事件，围绕 `ExperienceEvent` 与 context 组合生成。

### 基础字段

| 字段 | 中文说明 | 来源 | 是否必填 | 当前用途 |
| --- | --- | --- | --- | --- |
| `app` | 应用名 | `initCore()` | 是 | 应用维度过滤 |
| `env` | 环境 | `initCore()` | 是 | 环境隔离 |
| `version` | 版本号 | `initCore()` | 否 | 版本对比 |
| `timestamp` | 事件时间戳 | 事件本身或 `report()` 默认补齐 | 是 | 时间序列分析 |
| `route` | 当前路由 | context / `report()` | 否 | 页面维度分析 |
| `device.ua` | 浏览器 UA | `initCore()` | 否 | 设备分析 |
| `device.network` | 网络类型 | `initCore()` | 否 | 网络环境分析 |
| `sample` | 采样率 | 当前 ingest schema 支持，但 SDK 实际未写入 payload | 否 | 预留 |

### 事件字段

| 字段 | 中文说明 | 适用事件 | 说明 |
| --- | --- | --- | --- |
| `type` | 事件类型 | 全部 | 事件主分类 |
| `value` | 核心数值 | `fcp` `lcp` `cls` `inp` | 通常用于分数或时长值 |
| `duration` | 持续时间 | `longtask` `route` `react-render` | 适合耗时型事件 |
| `rating` | 分档结果 | 部分性能事件 | 当前前端实现未稳定写入 |
| `name` | 名称 | 预留 | 当前大多数事件未使用 |
| `component` | 组件名 | 预留 | 当前大多数事件未使用 |
| `message` | 错误消息 | `js-error` `react-error` | 错误摘要 |
| `stack` | 错误堆栈 | `js-error` `react-error` | 错误详情 |
| `extra` | 扩展字段 | 按需 | 用于承载半结构化信息 |

## ingest schema 与 ClickHouse 字段映射

当前 `apps/ingest-service/src/utils/normalize.ts` 会把 payload 扁平化后写入单表。

| 前端字段 | ingest schema | ClickHouse 字段 | 默认值策略 | 备注 |
| --- | --- | --- | --- | --- |
| `app` | `app` | `app` | 无 | 必填 |
| `env` | `env` | `env` | 无 | 必填 |
| `version` | `version` | `version` | `''` | 可空时写空串 |
| `type` | `type` | `type` | 无 | 必填 |
| `name` | `name` | `name` | `''` | 预留字段 |
| `route` | `route` | `route` | `''` | 路由缺失时写空串 |
| `component` | `component` | `component` | `''` | 预留字段 |
| `timestamp` | `timestamp` | `timestamp` | 无 | 必填 |
| `value` | `value` | `value` | `0` | 数值缺失写 0 |
| `duration` | `duration` | `duration` | `0` | 数值缺失写 0 |
| `rating` | `rating` | `rating` | `''` | 预留字段 |
| `message` | `message` | `message` | `''` | 错误摘要 |
| `stack` | `stack` | `stack` | `''` | 错误详情 |
| `device.ua` | `device.ua` | `ua` | `''` | 被扁平化 |
| `device.network` | `device.network` | `network` | `''` | 被扁平化 |
| `sample` | `sample` | `sample` | `1` | 当前更多是预留位 |
| `extra` | `extra` | `extra` | `{}` | JSON 字段 |

## 当前语义校验规则

`reportSchema` 当前只有少量语义校验，主要包括：

- `longtask` 必须带 `duration`
- `fcp` 必须带 `value`

这说明当前系统还没有形成完善的“事件类型 -> 必填字段”约束体系。

如果要增强数据质量，推荐逐步补齐：

1. 为主要事件补完整语义校验
2. 在 reference 中同步更新事件必填字段
3. 让 README 只描述稳定能力，不描述未落地规则

## 当前实现缺口

以下点位在协作时最容易被误判：

### `createExperience()`

- 公开文档曾使用该写法
- 当前源码没有这个导出入口
- 实际入口是 `initCore()` + `spaPreset()`

### React 能力

- 已实现，但不是默认接入
- 需要显式引入 `@whnz/frontend-experience-react`

### `css-covered`

- 已在类型定义与 ingest schema 中出现
- 当前没有明确采集实现
- dashboard 和查询口径也不应默认把它当成已上线事件

### 批量上报

- `reporter.ts` 里有队列与 flush 逻辑
- 当前 `report()` 实际仍是单条直发
- ingest 路由也只处理单条对象，不处理数组

## 新增事件时的最小同步范围

新增一个事件类型时，至少检查并更新：

1. `packages/core/src/types.ts`
2. 对应采集插件源码
3. `apps/ingest-service/src/schema/report.ts`
4. `apps/ingest-service/src/utils/normalize.ts`
5. `apps/ingest-service/sql/init.sql`（如有新列）
6. Grafana 查询口径
7. `README.internal.md`
8. 本文件

## 建议的事件设计约定

为了后续协作更稳定，新增事件时优先遵守：

- 能用 `value` 表达就不要新建数值字段
- 耗时类优先使用 `duration`
- 事件特有信息优先放入 `extra`
- 只有成为稳定查询维度时，再考虑升为独立列
- 如果只是实验性信号，不要先写进公开 README

## 推荐补强方向

如果要把这套系统继续做稳，优先级建议如下：

1. 抽出共享 schema package
2. 明确事件必填字段规则
3. 打通批量上报与批量写入
4. 固化 dashboard 模板
5. 补最小 demo 与 smoke test

## 维护建议

每次变更后，至少做一次人工核对：

- 文档是否仍与源码一致
- 事件是否真的能从前端到 ClickHouse 走通
- 新字段是否会影响旧查询
- 是否无意间把 MVP 扩成重型平台
