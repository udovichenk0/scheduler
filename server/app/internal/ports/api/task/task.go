package taskserviceport

import (
	"context"
	"time"
)

type CreateInput struct {
	Title       string
	Description string
	Type        string
	Status      string
	StartDate   *time.Time
	DueDate     *time.Time
	UserId      string
	Priority    string
	ListId      string
}

type UpdateInput struct {
	UserId      string
	TaskId      string
	Title       *string
	Description *string
	Type        *string
	Status      *string
	StartDate   **time.Time
	DueDate     **time.Time
	Priority    *string
	ListId      *string
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
	StartDate time.Time
	DueDate   time.Time
}

type UpdatePriorityInput struct {
	TaskId   string
	UserId   string
	Priority string
}

type UpdateStatusInput struct {
	Status string
	TaskId string
	UserId string
}

type UpdateListIdInput struct {
	TaskId string
	UserId string
	ListId string
}

type GetByListIdInput struct {
	UserId string
	ListId string
}

// type GetByListIdInput struct {
// 	ListId string
// }

type GetTasksInput struct {
	UserId string
}

type Api interface {
	// GetTasks(ctx context.Context, params GetTasksInput) ([]domain.Task, error)
	GetTasksByListId(ctx context.Context, params GetByListIdInput) ([]Task, error)
	CreateTask(ctx context.Context, params CreateInput) (Task, error)
	UpdateTask(ctx context.Context, taskDto UpdateInput) (Task, error)
	// UpdateTaskDate(ctx context.Context, params UpdateDateInput) (Task, error)
	// UpdateTaskPriority(ctx context.Context, params UpdatePriorityInput) error
	// UpdateTaskStatus(ctx context.Context, params UpdateStatusInput) error
	DeleteTrashedTask(ctx context.Context, params DeleteInput) error
	DeleteTrashedTasks(ctx context.Context, userId string) error
	TrashTask(ctx context.Context, params TrashInput) error
}

type TaskType string
type TaskStatus string
type Priority string

const (
	Inbox    TaskType = "inbox"
	Unplaced TaskType = "unplaced"
)

const (
	Finished   TaskStatus = "finished"
	ToDo       TaskStatus = "todo"
	Inprogress TaskStatus = "inprogress"
)

const (
	None   Priority = "none"
	Low    Priority = "low"
	Normal Priority = "normal"
	High   Priority = "high"
	Urgent Priority = "urgent"
)

type Task struct {
	Id          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Type        TaskType   `json:"type"`
	Status      TaskStatus `json:"status"`
	StartDate   *time.Time `json:"start_date"`
	DueDate     *time.Time `json:"due_date"`
	UserId      string     `json:"user_id"`
	ListId      string     `json:"list_id"`
	CreatedAt   time.Time  `json:"date_created"`
	IsTrashed   bool       `json:"is_trashed"`
	Priority    Priority   `json:"priority"`
}
