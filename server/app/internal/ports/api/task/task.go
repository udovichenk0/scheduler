package task

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/entity"
)

type CreateInput struct {
	Title       string
	Description string
	Type        entity.TaskType
	Status      entity.TaskStatus
	StartDate   int64
	DueDate     int64
	UserId      string
	Priority    entity.Priority
}

type UpdateInput struct {
	UserId      string
	TaskId      string
	Title       string
	Description string
	Type        entity.TaskType
	Status      entity.TaskStatus
	StartDate   int64
	DueDate     int64
	Priority    entity.Priority
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

type UpdatePriorityInput struct {
	TaskId   string
	UserId   string
	Priority entity.Priority
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
	UpdateTaskPriority(ctx context.Context, params UpdatePriorityInput) error
	UpdateTaskStatus(ctx context.Context, params UpdateStatusInput) error
	DeleteTrashedTask(ctx context.Context, params DeleteInput) error
	DeleteTrashedTasks(ctx context.Context, userId string) error
	TrashTask(ctx context.Context, params TrashInput) error
}
