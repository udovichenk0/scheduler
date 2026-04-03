-- +goose Up
-- +goose StatementBegin
ALTER TABLE task
ADD COLUMN list_id UUID NOT NULL,
ADD CONSTRAINT `fk_list` FOREIGN KEY (list_id) REFERENCES list(id);
-- +goose StatementEnd

-- +goose Down
ALTER TABLE task DROP FOREIGN KEY `fk_list`;
ALTER TABLE task DROP COLUMN list_id;
-- +goose StatementBegin
-- +goose StatementEnd
