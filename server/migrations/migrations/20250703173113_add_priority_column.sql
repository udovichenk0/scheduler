-- +goose Up
-- +goose StatementBegin
ALTER TABLE task ADD priority ENUM('none', 'low', 'normal', 'high', 'urgent') NOT NULL DEFAULT 'none';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE task DROP COLUMN priority;
-- +goose StatementEnd
