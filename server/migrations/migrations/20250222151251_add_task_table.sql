-- +goose Up
-- +goose StatementBegin

CREATE TABLE task (
  id VARCHAR(36) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type enum('inbox', 'unplaced') NOT NULL,
  status enum('finished', 'inprogress') DEFAULT 'inprogress',
  start_date TIMESTAMP,
  user_id VARCHAR(36) NOT NULL REFERENCES user(id),
  date_created TIMESTAMP DEFAULT NOW(),
  is_trashed tinyint(1) DEFAULT 0
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE task;
-- +goose StatementEnd
