package dto

import (
	"time"
)

type GetTasksByListIdParams struct {
	ListId string `json:"listId" validate:"required"`
}

type CreateTaskRequestBody struct {
	Title       string     `json:"title" validate:"required,min=1"`
	Description string     `json:"description"`
	Type        string     `json:"type"`
	Status      string     `json:"status"`
	StartDate   *time.Time `json:"start_date"`
	DueDate     *time.Time `json:"due_date"`
	Priority    string     `json:"priority"`
	ListId      string     `json:"list_id" validate:"required"`
}

type UpdateTaskRequestBody struct {
	Title       *string     `json:"title" validate:"required,min=1"`
	Description *string     `json:"description"`
	Type        *string     `json:"type"`
	Status      *string     `json:"status"`
	StartDate   **time.Time `json:"start_date"`
	DueDate     **time.Time `json:"due_date"`
	Priority    *string     `json:"priority"`
	ListId      *string     `json:"list_id"`
}

type CreateTaskParams struct {
	ListId string `json:"listId" validate:"required"`
}

type UpdateTaskRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}

type TrashTaskRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}

type UpdateTaskDateRequestBody struct {
	StartDate time.Time `json:"start_date"`
	DueDate   time.Time `json:"due_date"`
}
type UpdateDateRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}

type UpdateStatusRequestBody struct {
	Status string `json:"status"`
}
type UpdateStatusRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}

type UpdatePriorityRequestBody struct {
	Priority string `json:"priority"`
}
type UpdatePriorityRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}

type DeleteTrashedTaskRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}
