-- +goose Up
-- +goose StatementBegin
CREATE TABLE project (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  created_by VARCHAR(36) NOT NULL REFERENCES user(id)
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE project;
-- +goose StatementEnd
