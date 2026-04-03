-- +goose Up
-- +goose StatementBegin
CREATE TABLE project_membership (
    project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    PRIMARY KEY(project_id, user_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE project_membership;
-- +goose StatementEnd
