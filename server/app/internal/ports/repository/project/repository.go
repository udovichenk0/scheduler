package projectrepoport

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/domain"
)

type Repository interface {
	FindManyFull(ctx context.Context, userId string) ([]domain.Project, error)
	FindByID(ctx context.Context, projectId string) (domain.Project, error)
	FindPrivateOneByUserId(ctx context.Context, userId string) (domain.Project, error)
	CreateOne(ctx context.Context, data domain.Project) error

	CreateList(ctx context.Context, list domain.List) error
	// FindList(ctx context.Context, listId string) (domain.List, error)

	CreateMembership(ctx context.Context, membership domain.ProjectMembership) error
	FindMembership(ctx context.Context, membership domain.ProjectMembership) (domain.ProjectMembership, error)
}
