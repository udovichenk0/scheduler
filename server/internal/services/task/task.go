package task

import (
	"context"

	"github.com/google/uuid"
	"github.com/udovichenk0/scheduler/internal/entity"
	taskservice "github.com/udovichenk0/scheduler/internal/ports/api/task"
	taskRepo "github.com/udovichenk0/scheduler/internal/ports/repository/task"
	"github.com/udovichenk0/scheduler/internal/ports/repository/task/model"
	"github.com/udovichenk0/scheduler/pkg"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
)

type Service struct {
	taskRepo taskRepo.Port
	logger   logger.Logger
}

func New(taskRepo taskRepo.Port, logger logger.Logger) *Service {
	return &Service{taskRepo, logger}
}

func (ts *Service) GetTasks(ctx context.Context, userId string) ([]entity.Task, error) {
	tasks, err := ts.taskRepo.GetByUserId(ctx, userId)

	var domainTasks []entity.Task

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

	createTaskParams := taskRepo.CreateInput{
		Title:       params.Title,
		Description: params.Description,
		Type:        string(params.Type),
		Status:      string(params.Status),
		UserId:      params.UserId,
		TaskId:      uuid.String(),
	}
	if params.StartDate != 0 {
		createTaskParams.StartDate = pkg.UnixToDateTime(params.StartDate)
	}

	isValid, err := entity.IsValidTaskTypeAndStartTime(params.Type, params.StartDate)

	if !isValid {
		return entity.Task{}, errs.NewBadRequestError(err)
	}

	if err := ts.taskRepo.Create(ctx, createTaskParams); err != nil {
		return entity.Task{}, errs.NewInternalError(err)
	}

	if err != nil {
		return entity.Task{}, err
	}

	taskDto, err := ts.taskRepo.GetByTaskId(ctx, uuid.String())

	if err != nil {
		return entity.Task{}, errs.CheckSqlError(err, "Task")
	}

	return ToEntity(taskDto), nil
}

func (ts *Service) UpdateTask(ctx context.Context, params taskservice.UpdateInput) (entity.Task, error) {
	taskType := entity.ChangeTypeBasedOnDate(params.StartDate, params.Type)

	updateTaskParams := taskRepo.UpdateInput{
		Title:       params.Title,
		Description: params.Description,
		Type:        string(taskType),
		Status:      string(params.Status),
		TaskId:      params.TaskId,
		UserId:      params.UserId,
	}
	if params.StartDate != 0 {
		updateTaskParams.StartDate = pkg.UnixToDateTime(params.StartDate)
	}
	if err := ts.taskRepo.Update(ctx, updateTaskParams); err != nil {
		return entity.Task{}, errs.CheckSqlError(err, "Task")
	}

	repoTask, err := ts.taskRepo.GetByTaskId(ctx, updateTaskParams.TaskId)

	if err != nil {
		return entity.Task{}, errs.CheckSqlError(err, "Task")
	}

	return ToEntity(repoTask), nil
}

func (ts *Service) UpdateTaskDate(ctx context.Context, params taskservice.UpdateDateInput) (entity.Task, error) {
	repoTask, err := ts.taskRepo.GetByTaskId(ctx, params.TaskId)
	if err != nil {
		return entity.Task{}, errs.CheckSqlError(err, "Task")
	}

	task := ToEntity(repoTask)
	taskType := entity.ChangeTypeBasedOnDate(params.Date, task.Type)
	task.Type = taskType
	task.StartDate = params.Date

	updateDateAndTypeInput := taskRepo.UpdateDateInput{
		Type:   string(taskType),
		TaskId: params.TaskId,
		UserId: params.UserId,
	}
	if params.Date != 0 {
		updateDateAndTypeInput.StartDate = pkg.UnixToDateTime(params.Date)
	}

	if err := ts.taskRepo.UpdateDate(ctx, updateDateAndTypeInput); err != nil {
		return entity.Task{}, errs.CheckSqlError(err, "Task")
	}

	return task, nil
}

func (ts *Service) UpdateTaskStatus(ctx context.Context, params taskservice.UpdateStatusInput) error {
	updateStatusParams := taskRepo.UpdateStatusInput{
		TaskId: params.TaskId,
		UserId: params.UserId,
		Status: string(params.Status),
	}

	err := ts.taskRepo.UpdateStatus(ctx, updateStatusParams)

	if err != nil {
		return errs.CheckSqlError(err, "Task")
	}
	return nil
}

func (ts *Service) TrashTask(ctx context.Context, params taskservice.TrashInput) error {
	trashTaskParams := taskRepo.UpdateTrashInput{
		TaskId: params.TaskId,
		UserId: params.UserId,
	}
	err := ts.taskRepo.TrashTask(ctx, trashTaskParams)

	if err != nil {
		return errs.CheckSqlError(err, "Task")
	}

	return nil
}

func (ts *Service) DeleteTrashedTask(ctx context.Context, params taskservice.DeleteInput) error {
	deleteTrashedTaskParams := taskRepo.DeleteInput{
		TaskId: params.TaskId,
		UserId: params.UserId,
	}
	err := ts.taskRepo.DeleteTrashedTask(ctx, deleteTrashedTaskParams)
	if err != nil {
		return errs.CheckSqlError(err, "Task")
	}
	return nil
}

func (ts *Service) DeleteTrashedTasks(ctx context.Context, userId string) error {
	err := ts.taskRepo.DeleteTrashedTasks(ctx, userId)
	if err != nil {
		return errs.CheckSqlError(err, "Task")
	}
	return nil
}

func ToEntity(task model.Task) entity.Task {
	return entity.Task{
		Id:          task.Id,
		UserId:      task.UserId,
		Title:       task.Title,
		Description: task.Description,
		Type:        entity.TaskType(task.Type),
		Status:      entity.TaskStatus(task.Status),
		StartDate:   task.StartDate.Int64,
		IsTrashed:   task.IsTrashed,
		CreatedAt:   task.CreatedAt,
	}
}
