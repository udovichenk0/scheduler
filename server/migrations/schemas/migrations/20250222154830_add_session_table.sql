-- +goose Up
-- +goose StatementBegin

CREATE TABLE session (
  id VARCHAR(36) PRIMARY KEY,
  expires_at TIMESTAMP NOT NULL,
  data BLOB NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE session;
-- +goose StatementEnd
