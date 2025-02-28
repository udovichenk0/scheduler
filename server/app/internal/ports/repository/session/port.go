package session

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/ports/repository/session/model"
)

type Port interface {
	Create(ctx context.Context, id string, params CreateInput) error
	GetByUserId(ctx context.Context, userId string) (model.Session, error)
	Get(ctx context.Context, sessionId string) (model.Session, error)
	ExtendSessionByUserId(ctx context.Context, sessionId string, expiresAt int64) error
	Delete(ctx context.Context, sessionId string) error
}

type CreateInput struct {
	UserId    string `json:"user_id"`
	ExpiresAt int64     `json:"expires_at"`
}
