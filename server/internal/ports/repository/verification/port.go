package verification

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/ports/repository/verification/model"
)

type Port interface {
	GetByUserId(ctx context.Context, userId string) ([]model.Verification, error)
	Create(ctx context.Context, params CreateInput) error
	Delete(ctx context.Context, codeId string) error
	Update(ctx context.Context, params UpdateInput) error
}

type CreateInput struct {
	Id        string
	Code      string
	UserId    string
	ExpiresAt int64
}

type UpdateInput struct {
	UserId    string
	Code      string
	ExpiresAt int64
}
