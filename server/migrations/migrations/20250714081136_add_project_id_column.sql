-- +goose Up
-- +goose StatementBegin
ALTER TABLE task ADD (
  project_id VARCHAR(36) REFERENCES project(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE task DROP project_id;
-- +goose StatementEnd
