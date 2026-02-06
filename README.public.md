# Frontend Experience Monitor

一套 **轻量、可落地、面向真实业务的前端体验监控方案**。

> Not another APM.  
> Just enough observability for frontend teams.

---

## 🚀 What is this

Frontend Experience Monitor 是一套覆盖：

- Web 性能（Web Vitals）
- 页面卡顿
- JS 运行时错误
- SPA 路由体验
- React 渲染性能

的 **端到端前端体验监控方案**。

它由三部分组成：

1. 前端 SDK（npm 包）
2. 后端 ingest 服务
3. ClickHouse + Grafana 可视化

---

## ✨ Why not traditional APM

| 传统 APM | 本方案 |
|--------|-------|
| 重 | 轻 |
| 平台依赖强 | 前端可自建 |
| 成本高 | 成本可控 |
| 黑盒 | 数据透明 |

适合：
- SPA 项目
- 对性能与体验敏感的前端团队
- 想先“试水”，而不是一步到位的平台建设

---

## 📦 Frontend SDK

```ts
import { createExperience } from '@whnz/frontend-experience-preset-spa';

createExperience({
  app: 'order-spa',
  env: 'prod',
  version: '1.2.3',
  reportUrl: '/api/experience/report',
  sample: 0.1
});

Supported Signals

Web Vitals (LCP / FCP / CLS / INP)

Long Task

JS Error / Promise Rejection

CSS / Visual Issues

SPA Routing

React Profiler



---

🧩 Backend Ingest Service

Fastify-based HTTP service

Writes to ClickHouse

Stateless & scalable

Easy to replace or extend



---

📊 Visualization

ClickHouse as OLAP storage

Grafana dashboards

Performance trends

Error distribution

Release comparison



---

🧭 Philosophy

Measure what matters

Keep it debuggable

Avoid over-engineering

Let frontend teams own their observability



---

🛣 Roadmap

Unified schema package

Alerting on release regressions

Demo SPA

CI / Docker templates



---

📄 License

MIT
