-- +goose Up
-- +goose StatementBegin
CREATE TABLE user (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  hash VARCHAR(100) NOT NULL,
  verified tinyint(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE user;
-- +goose StatementEnd
