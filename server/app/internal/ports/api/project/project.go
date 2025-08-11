package project

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/entity"
)

type CreateProject struct {
	UserId string
	Name   string
}

type Api interface {
	GetProjects(ctx context.Context, userId string) ([]entity.Project, error)
	CreateProject(ctx context.Context, params CreateProject) (entity.Project, error)
}
