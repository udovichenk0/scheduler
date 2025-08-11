package auth

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/entity"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
)

type AuthResult struct {
	User    entity.User
	Session sessionManager.Session
}

type Api interface {
	SignIn(ctx context.Context, email, pass string) (AuthResult, error)
	SignUp(ctx context.Context, email, pass string) (entity.User, error)
	SignOut(ctx context.Context, sessionId string) error
}
