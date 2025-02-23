package dto

import "github.com/udovichenk0/scheduler/internal/entity"

type GetTaskRequestParams struct {
	Id string `params:"userId"`
}

type CreateTaskRequestBody struct {
	Title       string            `json:"title" validate:"required,min=1"`
	Description string            `json:"description"`
	Type        entity.TaskType   `json:"type" validate:"required,type"`
	Status      entity.TaskStatus `json:"status" validate:"required,status"`
	StartDate   int64             `json:"start_date" validate:"startDate"`
}

type UpdateTaskRequestBody struct {
	Title       string            `json:"title" validate:"required,min=1"`
	Description string            `json:"description"`
	Type        entity.TaskType   `json:"type" validate:"required,type"`
	Status      entity.TaskStatus `json:"status" validate:"required,status"`
	StartDate   int64             `json:"start_date" validate:"startDate"`
}
type UpdateTaskRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}

type TrashTaskRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}

type UpdateTaskDateRequestBody struct {
	StartDate int64 `json:"start_date" validate:"startDate"`
}
type UpdateDateRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}

type UpdateStatusRequestBody struct {
	Status entity.TaskStatus `json:"status" validate:"required,status"`
}
type UpdateStatusRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}

type DeleteTrashedTaskRequestParams struct {
	TaskId string `json:"taskId" validate:"required"`
}
