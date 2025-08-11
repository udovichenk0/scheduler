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
	StartDate   string
	DueDate     string
	UserId      string
	TaskId      string
	Priority    string
	ProjectId   string
}

type UpdateInput struct {
	Title       string
	Description string
	Type        string
	Status      string
	StartDate   string
	DueDate     string
	TaskId      string
	UserId      string
	Priority    string
	ProjectId   string
}

type UpdateDateInput struct {
	StartDate string
	DueDate   string
	Type      string
	TaskId    string
	UserId    string
}

type UpdateStatusInput struct {
	Status string
	TaskId string
	UserId string
}

type UpdatePriorityInput struct {
	Priority string
	TaskId   string
	UserId   string
}

type UpdateTrashInput struct {
	TaskId string
	UserId string
}

type DeleteInput struct {
	TaskId string
	UserId string
}

type UpdateProjectIdInput struct {
	TaskId    string
	ProjectId string
	UserId    string
}

type GetByProjectIdInput struct {
	ProjectId string
	UserId    string
}

type Repository interface {
	GetByTaskId(ctx context.Context, taskId string) (model.Task, error)
	GetByUserId(ctx context.Context, user_id string) ([]model.Task, error)
	GetByProjectId(ctx context.Context, params GetByProjectIdInput) ([]model.Task, error)
	DeleteTrashedTask(ctx context.Context, params DeleteInput) error
	DeleteTrashedTasks(ctx context.Context, userId string) error
	Create(ctx context.Context, task CreateInput) error
	CreateMany(ctx context.Context, tasks []CreateInput, userId string) error
	Update(ctx context.Context, taskFields UpdateInput) error
	UpdateDate(ctx context.Context, taskFields UpdateDateInput) error
	UpdateStatus(ctx context.Context, taskFields UpdateStatusInput) error
	UpdatePriority(ctx context.Context, taskFields UpdatePriorityInput) error
	TrashTask(ctx context.Context, params UpdateTrashInput) error
}
