package task

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/ports/repository/task/model"
)

type CreateInput struct {
	Title       string
	Description string
	Type        string
	Status      string
	StartDate   int64
	UserId      string
	TaskId      string
}

type UpdateInput struct {
	Title       string
	Description string
	Type        string
	Status      string
	StartDate   int64
	TaskId      string
	UserId      string
	IsTrashed   bool
}

type DeleteInput struct {
	TaskId string
	UserId string
}

type Port interface {
	GetByTaskId(ctx context.Context, taskId string) (model.Task, error)
	GetByUserId(ctx context.Context, user_id string) ([]model.Task, error)
	DeleteTrashedTask(ctx context.Context, params DeleteInput) error
	DeleteTrashedTasks(ctx context.Context, userId string) error
	Create(ctx context.Context, task CreateInput) error
	CreateMany(ctx context.Context, tasks []CreateInput, userId string) error
	Update(ctx context.Context, taskFields UpdateInput) error
}
