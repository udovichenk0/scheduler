package db

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/udovichenk0/scheduler/internal/ports/repository/session"
	"github.com/udovichenk0/scheduler/internal/ports/repository/session/model"
	"github.com/udovichenk0/scheduler/pkg"
)

type SessionRepo struct {
	DB *sqlx.DB
}

func NewSessionRepo(db *sqlx.DB) *SessionRepo {
	return &SessionRepo{db}
}

func (s SessionRepo) Create(ctx context.Context, id string, input session.CreateInput) error {
	_, err := pkg.ExecWithTx(ctx, s.DB, "INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, FROM_UNIXTIME(?))", id, input.UserId, input.ExpiresAt)
	return err
}

func (s SessionRepo) Get(ctx context.Context, sessionId string) (model.Session, error) {
	session := model.Nil
	err := pkg.QueryRowWithTx(ctx, &session, s.DB, "SELECT id, user_id, UNIX_TIMESTAMP(expires_at) from session where id = ?", sessionId)

	if err != nil {
		return model.Nil, err
	}

	return session, nil
}

func (s SessionRepo) GetByUserId(ctx context.Context, userId string) (model.Session, error) {
	session := model.Nil
	err := s.DB.GetContext(ctx, &session, "SELECT id, user_id, UNIX_TIMESTAMP(expires_at) FROM session WHERE user_id = ?", userId)
	if err != nil {
		return model.Nil, err
	}
	return session, nil
}

func (s SessionRepo) ExtendSessionByUserId(ctx context.Context, userId string, expiresAt int64) error {
	_, err := s.DB.ExecContext(ctx, "UPDATE session SET expires_at = FROM_UNIXTIME(?) WHERE user_id = ?", expiresAt, userId)
	return err
}

func (s SessionRepo) Delete(ctx context.Context, sessionId string) error {
	_, err := s.DB.ExecContext(ctx, "DELETE FROM session WHERE id = ?", sessionId)
	return err
}
