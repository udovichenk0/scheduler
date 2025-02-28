package user

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/entity"
)

type CreateInput struct {
	UserId string
	Email  string
	Hash   string
}

type Port interface {
	GetUserByEmail(ctx context.Context, email string) (entity.User, error)
	CreateUser(ctx context.Context, params CreateInput) (entity.User, error)
	DeleteUser(ctx context.Context, id string) error
	IsVerifiedUserExist(ctx context.Context, email string) (bool, error)
	GetUserById(ctx context.Context, id string) (entity.User, error)
	Verify(ctx context.Context, id string) error
}
