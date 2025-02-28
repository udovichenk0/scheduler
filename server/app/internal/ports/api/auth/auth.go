package auth

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/entity"
	session_manager "github.com/udovichenk0/scheduler/pkg/session-manager"
)

type AuthResult struct {
	User    entity.User
	Session session_manager.Session
}

type Port interface {
	SignIn(ctx context.Context, email, pass string) (AuthResult, error)
	SignUp(ctx context.Context, email, pass string) (entity.User, error)
	SignOut(ctx context.Context, sessionId string) error
}
