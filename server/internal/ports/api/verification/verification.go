package verification

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/entity"
)

type Verification struct {
	Id        string
	Code      string
	UserId    string
	CreatedAt string
}

type Port interface {
	VerifyUser(ctx context.Context, code, userId string) (entity.User, error)
	CreateCode(ctx context.Context, userId string) (string, error)
	ChangeCode(ctx context.Context, userId string, email string) error
}
