package session

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/entity"
	session_manager "github.com/udovichenk0/scheduler/pkg/session-manager"
)

type CreateInput struct {
	Id     string `json:"id"`
	UserId string `json:"user_id"`
}

type Port interface {
	CreateSession(ctx context.Context, userId string) (session_manager.Session, error)
	CheckSession(ctx context.Context, id string) (entity.User, error)
	RefreshSessionByUserId(ctx context.Context, sessionId string) (session_manager.Session, error)
	DeleteSession(ctx context.Context, sessionId string) error
}
