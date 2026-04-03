package taskrepoport

import (
	"context"
	"database/sql"

	"github.com/udovichenk0/scheduler/internal/domain"
)

type UpdateDateInput struct {
	StartDate sql.NullTime
	DueDate   sql.NullTime
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

type GetByListIdInput struct {
	ListId string
}

type Repository interface {
	FindOneById(ctx context.Context, taskId string) (domain.Task, error)
	FindOneByListId(ctx context.Context, params GetByListIdInput) ([]domain.Task, error)
	CreateOne(ctx context.Context, task domain.Task) error
	DeleteOne(ctx context.Context, params DeleteInput) error
	DeleteMany(ctx context.Context, userId string) error
	UpdateOne(ctx context.Context, input domain.Task) error
	UpdateDate(ctx context.Context, taskFields UpdateDateInput) error
	UpdateStatus(ctx context.Context, taskFields UpdateStatusInput) error
	UpdatePriority(ctx context.Context, taskFields UpdatePriorityInput) error
	TrashOne(ctx context.Context, params UpdateTrashInput) error
}
