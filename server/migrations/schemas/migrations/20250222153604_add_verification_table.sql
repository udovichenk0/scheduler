-- +goose Up
-- +goose StatementBegin

CREATE TABLE verification (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE verification;
-- +goose StatementEnd
