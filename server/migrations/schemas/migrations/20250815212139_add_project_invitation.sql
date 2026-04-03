-- +goose Up
-- +goose StatementBegin
CREATE TABLE invitation (
    id UUID PRIMARY KEY,
    inviter_id UUID NOT NULL REFERENCES user(id),
    invitee_id UUID NOT NULL REFERENCES user(id),
    status TINYINT UNSIGNED NOT NULL DEFAULT 0, -- 0 pending, 1 accepted, 2 declined
    project_id UUID NOT NULL REFERENCES project(id),
    invited_at TIMESTAMP NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMP,
    declined_at TIMESTAMP
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE invitation;
-- +goose StatementEnd
