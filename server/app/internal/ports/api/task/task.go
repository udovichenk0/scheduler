package task

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/entity"
)

type CreateInput struct {
	Title       string            `json:"title"`
	Description string            `json:"description"`
	Type        entity.TaskType   `json:"type"`
	Status      entity.TaskStatus `json:"status"`
	StartDate   int64             `json:"start_date"`
	DueDate     int64             `json:"due_date"`
	UserId      string            `json:"user_id"`
}

type UpdateInput struct {
	UserId      string
	TaskId      string
	Title       string            `json:"title"`
	Description string            `json:"description"`
	Type        entity.TaskType   `json:"type"`
	Status      entity.TaskStatus `json:"status"`
	StartDate   int64             `json:"start_date"`
	DueDate     int64             `json:"due_date"`
}

type DeleteInput struct {
	TaskId string
	UserId string
}

type TrashInput struct {
	UserId string
	TaskId string
}

type UpdateDateInput struct {
	TaskId    string
	UserId    string
	StartDate int64
	DueDate   int64
}

type UpdateStatusInput struct {
	Status entity.TaskStatus
	TaskId string
	UserId string
}

type Port interface {
	GetTasks(ctx context.Context, userId string) ([]entity.Task, error)
	CreateTask(ctx context.Context, params CreateInput) (entity.Task, error)
	UpdateTask(ctx context.Context, taskDto UpdateInput) (entity.Task, error)
	UpdateTaskDate(ctx context.Context, params UpdateDateInput) (entity.Task, error)
	UpdateTaskStatus(ctx context.Context, params UpdateStatusInput) error
	DeleteTrashedTask(ctx context.Context, params DeleteInput) error
	DeleteTrashedTasks(ctx context.Context, userId string) error
	TrashTask(ctx context.Context, params TrashInput) error
}
