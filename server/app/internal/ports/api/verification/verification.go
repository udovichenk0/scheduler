package verificationserviceport

import (
	"context"
)

type Verification struct {
	Id        string
	Code      string
	UserId    string
	CreatedAt string
}

type VerifyUserOutput struct {
	Id        string
	Email     string
	Verified  bool
	CreatedAt string
}

type Api interface {
	VerifyUser(ctx context.Context, code, userId string) (VerifyUserOutput, error)
	CreateCode(ctx context.Context, userId string) (string, error)
	ChangeCode(ctx context.Context, userId string, email string) error
}
