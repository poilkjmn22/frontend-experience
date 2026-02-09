CREATE DATABASE IF NOT EXISTS experience;

CREATE TABLE IF NOT EXISTS experience.events (
  app String,
  env String,
  version String,
  type String,
  name String,
  value Float64,
  rating String,
  route String,
  component String,
  message String,
  stack String,
  timestamp DateTime64(3, 'UTC'),
  sample Float64,
  device Nested (
    ua String,
    network String
  ),
  extra String
)
ENGINE = MergeTree
PARTITION BY toDate(timestamp)
ORDER BY (app, env, type, name, timestamp);
