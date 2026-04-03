package taskservice

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/udovichenk0/scheduler/internal/domain"
	taskserviceport "github.com/udovichenk0/scheduler/internal/ports/api/task"
	taskrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/task"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	"github.com/zhulik/pal"
)

type Service struct {
	TaskRepo taskrepoport.Repository
	// ListApi  list.Api
	Logger logger.ILogger
}

// func (ts *Service) GetTasks(ctx context.Context, params taskservice.GetTasksInput) ([]domain.Task, error) {
// 	tasks, err := ts.TaskRepo.GetByUserId(ctx, params.UserId)

// 	domainTasks := []domain.Task{}

// 	if err != nil {
// 		ts.Logger.Error("failed to get tasks", err)
// 		return domainTasks, errs.NewInternalErrorWithMsg(err, "GetByUserId: get tasks by userid")
// 	}

// 	for _, task := range tasks {
// 		domainTasks = append(domainTasks, ToEntity(task))
// 	}

//		return domainTasks, err
//	}

type Task struct{}

func (ts *Service) GetTasksByListId(ctx context.Context, params taskserviceport.GetByListIdInput) ([]taskserviceport.Task, error) {
	tasks, err := ts.TaskRepo.FindOneByListId(ctx, taskrepoport.GetByListIdInput{
		ListId: params.ListId,
	})

	if err != nil {
		return nil, errs.NewInternalErrorWithMsg(err, fmt.Sprintf("failed to get tasks for list %s", params.ListId))
	}

	return tasksToDto(tasks), nil
}

func (ts *Service) CreateTask(ctx context.Context, params taskserviceport.CreateInput) (taskserviceport.Task, error) {
	task, err := domain.NewTask(domain.CreateTaskInput{
		Title:       params.Title,
		Description: params.Description,
		Type:        params.Type,
		Status:      params.Status,
		StartDate:   params.StartDate,
		DueDate:     params.DueDate,
		UserId:      params.UserId,
		ListId:      params.ListId,
		Priority:    params.Priority,
	})
	if err != nil {
		ts.Logger.Info("Create task", slog.Any("params", params))
		return taskserviceport.Task{}, errs.NewBadRequestError(err)
	}

	if err := ts.TaskRepo.CreateOne(ctx, task); err != nil {
		return taskserviceport.Task{}, errs.NewError(err, "failed to create task")
	}

	taskEntity, err := ts.TaskRepo.FindOneById(ctx, task.Id)
	if err != nil {
		ts.Logger.Error("Failed to get task", slog.Any("err", err))
		return taskserviceport.Task{}, errs.NewInternalErrorWithMsg(err, "failed to get task")
	}

	return taskToDto(taskEntity), nil
}

func (ts *Service) UpdateTask(ctx context.Context, params taskserviceport.UpdateInput) (taskserviceport.Task, error) {
	task, err := ts.TaskRepo.FindOneById(ctx, params.TaskId)
	if err != nil {
		ts.Logger.Error("Find task by id", slog.Any("err", err))
		return taskserviceport.Task{}, errs.NewError(err, "failed to get task")
	}

	task.ApplyChanges(domain.UpdateTaskInput{
		Title:       params.Title,
		Description: params.Description,
		Type:        params.Type,
		Status:      params.Status,
		StartDate:   params.StartDate,
		DueDate:     params.DueDate,
		ListId:      params.ListId,
		Priority:    params.Priority,
	})

	if err := ts.TaskRepo.UpdateOne(ctx, task); err != nil {
		return taskserviceport.Task{}, errs.NewError(err, "failed to update task")
	}

	return taskToDto(task), nil
}

// func (ts *Service) UpdateTaskDate(ctx context.Context, params taskserviceport.UpdateDateInput) (taskserviceport.Task, error) {
// 	err := domain.ValidateDateRange(params.StartDate, params.DueDate)
// 	if err != nil {
// 		return taskserviceport.Task{}, errs.NewBusinessRuleViolationError(err, "startDate should be greater than dueDate")
// 	}

// 	repoTask, err := ts.TaskRepo.GetByTaskId(ctx, params.TaskId)
// 	if err != nil {
// 		if errs.IsResourceNotFound(err) {
// 			return taskserviceport.Task{}, errs.NewResourceNotFoundError(err, fmt.Sprintf("task with id %s does not exist", params.TaskId))
// 		}
// 		return taskserviceport.Task{}, errs.NewInternalErrorWithMsg(err, "failed to get task")
// 	}

// 	task := taskToDto(repoTask)

// 	// task.Type = domain.ChangeTypeBasedOnDate(params.StartDate, task.Type)
// 	// if !params.StartDate.IsZero() {
// 	// 	task.StartDate = &params.StartDate
// 	// }
// 	// if !params.DueDate.IsZero() {
// 	// 	task.DueDate = &params.DueDate
// 	// }

// 	updateDateAndTypeInput := taskrepoport.UpdateDateInput{
// 		Type:      string(task.Type),
// 		TaskId:    params.TaskId,
// 		UserId:    params.UserId,
// 		StartDate: dbutils.TimeToNullTime(params.StartDate),
// 		DueDate:   dbutils.TimeToNullTime(params.DueDate),
// 	}

// 	if err := ts.TaskRepo.UpdateDate(ctx, updateDateAndTypeInput); err != nil {
// 		return taskserviceport.Task{}, errs.NewError(err, "failed to update task date")
// 	}

// 	return task, nil
// }

// func (ts *Service) UpdateTaskStatus(ctx context.Context, params taskserviceport.UpdateStatusInput) error {
// 	updateStatusParams := taskrepoport.UpdateStatusInput{
// 		TaskId: params.TaskId,
// 		UserId: params.UserId,
// 		Status: string(params.Status),
// 	}

// 	err := ts.TaskRepo.UpdateStatus(ctx, updateStatusParams)

// 	if err != nil {
// 		return errs.NewError(err, "failed to update task status")
// 	}
// 	return nil
// }

// func (ts *Service) UpdateTaskPriority(ctx context.Context, params taskserviceport.UpdatePriorityInput) error {
// 	updatePriorityParams := taskrepoport.UpdatePriorityInput{
// 		TaskId:   params.TaskId,
// 		UserId:   params.UserId,
// 		Priority: string(params.Priority),
// 	}

// 	err := ts.TaskRepo.UpdatePriority(ctx, updatePriorityParams)
// 	if err != nil {
// 		return errs.NewError(err, "failed to update task priority")
// 	}
// 	return nil
// }

func (ts *Service) TrashTask(ctx context.Context, params taskserviceport.TrashInput) error {
	trashTaskParams := taskrepoport.UpdateTrashInput{
		TaskId: params.TaskId,
		UserId: params.UserId,
	}
	err := ts.TaskRepo.TrashOne(ctx, trashTaskParams)
	if err != nil {
		return errs.NewError(err, "failed to trash task")
	}

	return nil
}

func (ts *Service) DeleteTrashedTask(ctx context.Context, params taskserviceport.DeleteInput) error {
	deleteTrashedTaskParams := taskrepoport.DeleteInput{
		TaskId: params.TaskId,
		UserId: params.UserId,
	}
	err := ts.TaskRepo.DeleteOne(ctx, deleteTrashedTaskParams)
	if err != nil {
		return errs.NewError(err, "failed to delete trashed task")
	}
	return nil
}

func (ts *Service) DeleteTrashedTasks(ctx context.Context, userId string) error {
	err := ts.TaskRepo.DeleteMany(ctx, userId)
	if err != nil {
		return errs.NewError(err, "failed to delete trashed tasks")
	}
	return nil
}

func Provide() pal.ServiceDef {
	return pal.Provide[taskserviceport.Api](&Service{})
}
