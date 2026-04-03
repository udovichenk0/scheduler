package userserviceport

import (
	"context"
)

type Api interface {
	GetByEmail(ctx context.Context, email string) (UserOutput, error)
	GetById(ctx context.Context, id string) (UserOutput, error)
	Create(ctx context.Context, params CreateInput) (UserOutput, error)
	Delete(ctx context.Context, id string) error
	ExistsVerified(ctx context.Context, email string) (bool, error)
	MarkAsVerified(ctx context.Context, id string) error
}

type CreateInput struct {
	Email        string
	HashPassword string
}

type UserOutput struct {
	Id        string `json:"id"`
	Email     string `json:"email"`
	Verified  bool   `json:"verified"`
	CreatedAt string `json:"createdAt"`
}
