# Frontend Experience Monitor

一套轻量、可落地、面向真实业务的 Web 前端体验监控方案。

> Not another APM.  
> Just enough observability for frontend teams.

---

## 这是什么

Frontend Experience Monitor 当前聚焦 Web 前端体验监控，主要覆盖：

- Web Vitals
- 页面卡顿
- JS 运行时错误
- SPA 路由体验
- CSS / 白屏类问题
- React 错误与渲染性能（可选）

它由三部分组成：

1. 前端 SDK
2. ingest 服务
3. ClickHouse + Grafana 可视化

---

## 为什么不是传统 APM

| 传统 APM | 本方案 |
| --- | --- |
| 重 | 轻 |
| 平台依赖强 | 前端可自建 |
| 成本高 | 成本可控 |
| 黑盒 | 数据透明 |

更适合：

- SPA 项目
- 对性能与体验敏感的前端团队
- 想先试水前端可观测性，而不是直接上重型平台的团队

---

## 前端 SDK

当前源码里的最小接入方式是 `initCore()` + `spaPreset()`：

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

spaPreset({
  keySelectors: ['#root'],
  blockingThreshold: 50,
}).forEach((plugin) => plugin.setup());
```

当前默认 `spaPreset()` 已包含：

- Web Vitals：`fcp` / `lcp` / `cls` / `inp`
- 页面卡顿：`longtask`
- 异常采集：`js-error` / `promise-error`
- 路由体验：`route`
- CSS / 视觉异常：`white-screen` / `css-visibility-error`

React 相关能力当前是独立包，不在默认 preset 内：

- `@whnz/frontend-experience-react`
- `react-error`
- `react-render`

---

## ingest 服务

当前 ingest 服务：

- 基于 Fastify
- 接收 `/api/experience/report`
- 兼容 `sendBeacon` 的 `text/plain` 上报
- 当前按单条事件对象接收，不支持批量数组写入
- 做基础校验与扁平化
- 写入 ClickHouse 明细表

它是无状态、易替换、易扩展的接收层，不承担复杂聚合与告警职责。

---

## 当前已覆盖的事件类型

当前源码已覆盖的事件类型包括：

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
- `react-error`（可选，需单独接入 React 包）
- `react-render`（可选，需单独接入 React 包）

说明：

- `css-covered` 虽然在类型定义与 ingest schema 中预留，但当前没有明确采集实现
- 批量上报、统一 schema 包、发布回归告警仍属于 roadmap，而不是已完成能力

---

## 可视化

当前可视化链路为：

- ClickHouse 作为明细存储
- Grafana 作为查询与展示层

适合查看：

- 性能趋势
- 错误分布
- 卡顿分布
- 版本间对比分析

---

## 设计原则

- 优先衡量真正影响用户体验的信号
- 保持可定位、可解释、可调试
- 避免过度设计
- 让前端团队拥有自己的可观测性能力

---

## 当前边界

当前仓库是一个前端团队可维护的体验监控 MVP，刻意不做：

- 分布式链路追踪
- Kafka / Flink 流式架构
- Session Replay
- 用户画像与会话重建
- 平台级自动告警系统

---

## 后续方向

- 抽出统一 schema package
- 支持批量上报 / 批量写入
- 支持发布回归告警
- 补一个 Demo SPA
- 补充 CI / Docker 模板

---

## 许可证

MIT
