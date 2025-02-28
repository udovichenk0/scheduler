package user

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/ports/repository/user/model"
)

type Port interface {
	Get(ctx context.Context, email string) (model.User, error)
	GetById(ctx context.Context, id string) (model.User, error)
	Create(ctx context.Context, id string, input CreateInput) error
	Delete(ctx context.Context, id string) error
	Update(ctx context.Context, input UpdateInput) error
}

type CreateInput struct {
	Email    string
	PassHash string
}

type UpdateInput struct {
	Id       string
	Email    string
	Verified bool
}
