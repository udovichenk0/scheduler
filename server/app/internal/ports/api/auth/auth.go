package authserviceport

import (
	"context"

	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
)

type Api interface {
	SignIn(ctx context.Context, email, pass string) (AuthResult, error)
	SignUp(ctx context.Context, email, pass string) (AuthUser, error)
	SignOut(ctx context.Context, sessionId string) error
}

type AuthUser struct {
	Id        string `json:"id"`
	Email     string `json:"email"`
	Verified  bool   `json:"verified"`
	CreatedAt string `json:"createdAt"`
}

type AuthResult struct {
	User    AuthUser
	Session sessionManager.Session
}
