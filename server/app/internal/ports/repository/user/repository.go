package userrepoport

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/domain"
)

type Repository interface {
	FindOneByEmail(ctx context.Context, email string) (domain.User, error)
	FindOneById(ctx context.Context, id string) (domain.User, error)
	CreateOne(ctx context.Context, input domain.User) error
	DeleteOne(ctx context.Context, id string) error
	VerifyOne(ctx context.Context, userId string) error
}
