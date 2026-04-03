-- +goose Up
-- +goose StatementBegin

CREATE TABLE task (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type enum('inbox', 'unplaced') NOT NULL,
  status enum('todo','finished', 'inprogress') DEFAULT 'todo',
  priority ENUM('none', 'low', 'normal', 'high', 'urgent') NOT NULL DEFAULT 'none',
  start_date TIMESTAMP,
  due_date TIMESTAMP,
  user_id UUID NOT NULL,
  date_created TIMESTAMP DEFAULT NOW(),
  is_trashed tinyint(1) DEFAULT 0,
  CONSTRAINT `fk_task_user` FOREIGN KEY (user_id) REFERENCES user(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE task;
-- +goose StatementEnd
