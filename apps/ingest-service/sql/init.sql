CREATE DATABASE IF NOT EXISTS experience;

CREATE TABLE IF NOT EXISTS experience.events (
  -- ===== 基础维度 =====
  app             LowCardinality(String),
  env             LowCardinality(String),
  version         LowCardinality(String),

  type            LowCardinality(String),
  name            String,

  route           String,
  component       String,

  -- ===== 时间 =====
  timestamp       UInt64,

  -- ===== 核心数值 =====
  value           Float64,
  duration        Float64,

  rating          LowCardinality(String),

  -- ===== 错误相关 =====
  message         String,
  stack           String,

  -- ===== 设备信息 =====
  ua              String,
  network         LowCardinality(String),

  -- ===== 采样 =====
  sample          Float32,

  -- ===== 扩展字段 =====
  extra           JSON

)
ENGINE = MergeTree
ORDER BY (app, env, type, timestamp)
SETTINGS index_granularity = 8192;
