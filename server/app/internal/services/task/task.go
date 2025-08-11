package task

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/google/uuid"
	"github.com/udovichenk0/scheduler/internal/entity"
	"github.com/udovichenk0/scheduler/internal/ports/api/task"
	taskservice "github.com/udovichenk0/scheduler/internal/ports/api/task"
	taskRepo "github.com/udovichenk0/scheduler/internal/ports/repository/task"
	"github.com/udovichenk0/scheduler/internal/ports/repository/task/model"
	"github.com/udovichenk0/scheduler/pkg"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	"github.com/zhulik/pal"
)

type Service struct {
	TaskRepo taskRepo.Repository
	Logger   logger.ILogger
}

func (ts *Service) GetTasks(ctx context.Context, userId string) ([]entity.Task, error) {
	tasks, err := ts.TaskRepo.GetByUserId(ctx, userId)

	domainTasks := []entity.Task{}

	if err != nil {
		return domainTasks, errs.NewInternalErrorWithMsg(err, "failed to get tasks")
	}

	for _, task := range tasks {
		domainTasks = append(domainTasks, ToEntity(task))
	}

	return domainTasks, err
}

func (ts *Service) GetTasksByProjectId(ctx context.Context, params taskservice.GetByProjectIdInput) ([]entity.Task, error) {
	tasks, err := ts.TaskRepo.GetByProjectId(ctx, taskRepo.GetByProjectIdInput{ProjectId: params.ProjectId, UserId: params.UserId})

	domainTasks := []entity.Task{}

	if err != nil {
		return domainTasks, errs.NewInternalErrorWithMsg(err, fmt.Sprintf("failed to get tasks for project %s", params.ProjectId))
	}

	for _, task := range tasks {
		domainTasks = append(domainTasks, ToEntity(task))
	}

	return domainTasks, err
}

func (ts *Service) CreateTask(ctx context.Context, params taskservice.CreateInput) (entity.Task, error) {
	uuid, err := uuid.NewRandom()

	if err != nil {
		return entity.Task{}, errs.NewInternalError(err)
	}

	err = entity.ValidateDateRange(params.StartDate, params.DueDate)
	if err != nil {
		return entity.Task{}, errs.NewBusinessRuleViolationError(err, "startDate should be greater than dueDate")
	}

	err = entity.ValidateTypeAndDate(params.Type, params.StartDate, params.DueDate)
	if err != nil {
		return entity.Task{}, errs.NewBusinessRuleViolationError(err, err.Error())
	}

	createTaskParams := taskRepo.CreateInput{
		Title:       params.Title,
		Description: params.Description,
		Type:        string(params.Type),
		Status:      string(params.Status),
		UserId:      params.UserId,
		TaskId:      uuid.String(),
		Priority:    string(params.Priority),
		ProjectId:   params.ProjectId,
	}

	if params.StartDate != 0 {
		createTaskParams.StartDate = pkg.UnixToDateTime(params.StartDate)
	}
	if params.DueDate != 0 {
		createTaskParams.DueDate = pkg.UnixToDateTime(params.DueDate)
	}

	ts.Logger.Info("create task", slog.Any("createTaskParams", createTaskParams))

	if err := ts.TaskRepo.Create(ctx, createTaskParams); err != nil {
		return entity.Task{}, errs.NewError(err, "failed to create task")
	}

	taskDto, err := ts.TaskRepo.GetByTaskId(ctx, uuid.String())
	if err != nil {
		return entity.Task{}, errs.NewInternalErrorWithMsg(err, "failed to retrive task")
	}

	return ToEntity(taskDto), nil
}

func (ts *Service) UpdateTask(ctx context.Context, params taskservice.UpdateInput) (entity.Task, error) {
	taskType := entity.ChangeTypeBasedOnDate(params.StartDate, params.Type)

	err := entity.ValidateDateRange(params.StartDate, params.DueDate)
	if err != nil {
		return entity.Task{}, errs.NewBusinessRuleViolationError(err, "startDate should be greater than dueDate")
	}

	err = entity.ValidateTypeAndDate(params.Type, params.StartDate, params.DueDate)
	if err != nil {
		return entity.Task{}, errs.NewBusinessRuleViolationError(err, err.Error())
	}

	updateTaskParams := taskRepo.UpdateInput{
		Title:       params.Title,
		Description: params.Description,
		Type:        string(taskType),
		Status:      string(params.Status),
		TaskId:      params.TaskId,
		UserId:      params.UserId,
		Priority:    string(params.Priority),
	}

	if params.StartDate != 0 {
		updateTaskParams.StartDate = pkg.UnixToDateTime(params.StartDate)
	}
	if params.DueDate != 0 {
		updateTaskParams.DueDate = pkg.UnixToDateTime(params.DueDate)
	}

	ts.Logger.Info("update task", slog.Any("updateTaskParams", updateTaskParams))

	if err := ts.TaskRepo.Update(ctx, updateTaskParams); err != nil {
		return entity.Task{}, errs.NewError(err, "failed to update task")
	}

	repoTask, err := ts.TaskRepo.GetByTaskId(ctx, updateTaskParams.TaskId)
	if err != nil {
		return entity.Task{}, errs.NewInternalErrorWithMsg(err, "failed to retrive task")
	}

	return ToEntity(repoTask), nil
}

func (ts *Service) UpdateTaskDate(ctx context.Context, params taskservice.UpdateDateInput) (entity.Task, error) {
	err := entity.ValidateDateRange(params.StartDate, params.DueDate)
	if err != nil {
		return entity.Task{}, errs.NewBusinessRuleViolationError(err, "startDate should be greater than dueDate")
	}

	repoTask, err := ts.TaskRepo.GetByTaskId(ctx, params.TaskId)
	if err != nil {
		if errs.IsResourceNotFound(err) {
			return entity.Task{}, errs.NewResourceNotFoundError(err, fmt.Sprintf("task with id %s does not exist", params.TaskId))
		}
		return entity.Task{}, errs.NewInternalErrorWithMsg(err, "failed to get task")
	}

	task := ToEntity(repoTask)

	task.Type = entity.ChangeTypeBasedOnDate(params.StartDate, task.Type)
	task.StartDate = params.StartDate
	task.DueDate = params.DueDate

	updateDateAndTypeInput := taskRepo.UpdateDateInput{
		Type:   string(task.Type),
		TaskId: params.TaskId,
		UserId: params.UserId,
	}
	if params.StartDate != 0 {
		updateDateAndTypeInput.StartDate = pkg.UnixToDateTime(params.StartDate)
	}
	if params.DueDate != 0 {
		updateDateAndTypeInput.DueDate = pkg.UnixToDateTime(params.DueDate)
	}

	if err := ts.TaskRepo.UpdateDate(ctx, updateDateAndTypeInput); err != nil {
		return entity.Task{}, errs.NewError(err, "failed to update task date")
	}

	return task, nil
}

func (ts *Service) UpdateTaskStatus(ctx context.Context, params taskservice.UpdateStatusInput) error {
	updateStatusParams := taskRepo.UpdateStatusInput{
		TaskId: params.TaskId,
		UserId: params.UserId,
		Status: string(params.Status),
	}

	err := ts.TaskRepo.UpdateStatus(ctx, updateStatusParams)

	if err != nil {
		return errs.NewError(err, "failed to update task status")
	}
	return nil
}

func (ts *Service) UpdateTaskPriority(ctx context.Context, params taskservice.UpdatePriorityInput) error {
	updatePriorityParams := taskRepo.UpdatePriorityInput{
		TaskId:   params.TaskId,
		UserId:   params.UserId,
		Priority: string(params.Priority),
	}

	err := ts.TaskRepo.UpdatePriority(ctx, updatePriorityParams)
	if err != nil {
		return errs.NewError(err, "failed to update task priority")
	}
	return nil
}

func (ts *Service) TrashTask(ctx context.Context, params taskservice.TrashInput) error {
	trashTaskParams := taskRepo.UpdateTrashInput{
		TaskId: params.TaskId,
		UserId: params.UserId,
	}
	err := ts.TaskRepo.TrashTask(ctx, trashTaskParams)

	if err != nil {
		return errs.NewError(err, "failed to trash task")
	}

	return nil
}

func (ts *Service) DeleteTrashedTask(ctx context.Context, params taskservice.DeleteInput) error {
	deleteTrashedTaskParams := taskRepo.DeleteInput{
		TaskId: params.TaskId,
		UserId: params.UserId,
	}
	err := ts.TaskRepo.DeleteTrashedTask(ctx, deleteTrashedTaskParams)
	if err != nil {
		return errs.NewError(err, "failed to delete trashed task")
	}
	return nil
}

func (ts *Service) DeleteTrashedTasks(ctx context.Context, userId string) error {
	err := ts.TaskRepo.DeleteTrashedTasks(ctx, userId)
	if err != nil {
		return errs.NewError(err, "failed to delete trashed tasks")
	}
	return nil
}

func ToEntity(task model.Task) entity.Task {
	return entity.Task{
		Id:          task.Id,
		UserId:      task.UserId,
		ProjectId:   task.ProjectId.String,
		Title:       task.Title,
		Description: task.Description,
		Type:        entity.TaskType(task.Type),
		Status:      entity.TaskStatus(task.Status),
		StartDate:   task.StartDate.Int64,
		DueDate:     task.DueDate.Int64,
		IsTrashed:   task.IsTrashed,
		CreatedAt:   task.CreatedAt,
		Priority:    entity.Priority(task.Priority),
	}
}

func Provide() pal.ServiceDef {
	return pal.Provide[task.Api](&Service{})
}
