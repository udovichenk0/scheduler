package project

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/ports/repository/project/model"
)

type CreateInput struct {
	UserId    string
	Name      string
	ProjectId string
}

type Repository interface {
	GetByUserId(ctx context.Context, userId string) ([]model.Project, error)
	GetById(ctx context.Context, projectId string) (model.Project, error)
	Create(ctx context.Context, data CreateInput) error
}
