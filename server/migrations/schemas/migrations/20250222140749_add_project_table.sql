-- +goose Up
-- +goose StatementBegin
CREATE TABLE project (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  is_private BOOL NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES user(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down

ALTER TABLE project DROP FOREIGN KEY `1`;
-- +goose StatementBegin
DROP TABLE project;
-- +goose StatementEnd
