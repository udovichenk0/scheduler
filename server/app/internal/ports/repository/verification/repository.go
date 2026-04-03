package verificationrepoport

import (
	"context"
	"time"

	"github.com/udovichenk0/scheduler/internal/ports/repository/verification/model"
)

type Repository interface {
	GetByUserId(ctx context.Context, userId string) ([]model.Verification, error)
	Create(ctx context.Context, params CreateInput) error
	Delete(ctx context.Context, codeId string) error
	Update(ctx context.Context, params UpdateInput) error
}

type CreateInput struct {
	Id        string
	Code      string
	UserId    string
	ExpiresAt time.Time
}

type UpdateInput struct {
	UserId    string
	Code      string
	ExpiresAt time.Time
}
