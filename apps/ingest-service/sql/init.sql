CREATE DATABASE IF NOT EXISTS experience;

CREATE TABLE IF NOT EXISTS experience.events (
  ts DateTime64(3),
  app LowCardinality(String),
  env LowCardinality(String),
  version String,

  type LowCardinality(String),     -- vitals | error | longtask | route | css
  name String,                     -- LCP | CLS | JS_ERROR
  value Float64,
  rating LowCardinality(String),

  route String,
  component String,

  message String,
  stack String,

  ua String,
  network String
)
ENGINE = MergeTree
PARTITION BY toDate(ts)
ORDER BY (app, env, type, name, ts);
