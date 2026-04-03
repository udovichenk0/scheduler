-- +goose Up
-- +goose StatementBegin
CREATE TABLE list (
  id            UUID PRIMARY KEY,
  name          TEXT NOT NULL,
  is_private    BOOLEAN DEFAULT FALSE,
  project_id    UUID NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  created_by    UUID NOT NULL,
  CONSTRAINT    `fk_list_project` FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
  CONSTRAINT    `fk_list_user` FOREIGN KEY (created_by) REFERENCES user(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE list;
-- +goose StatementEnd
