package task

import (
	"context"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
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
	db       *sqlx.DB
}

func New(taskRepo taskRepo.Port, logger logger.Logger, db *sqlx.DB) *Service {
	return &Service{taskRepo, logger, db}
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
		StartDate:   params.StartDate,
		UserId:      params.UserId,
		TaskId:      uuid.String(),
	}

	isValid, err := entity.IsValidTaskTypeAndStartTime(params.Type, params.StartDate)

	if !isValid {
		return entity.Task{}, errs.NewBadRequestError(err)
	}

	uow := pkg.NewUnitOfWork(ts.db, ctx)
	err = uow.StartUOW(func(ctx context.Context) error {
		if err := ts.taskRepo.Create(ctx, createTaskParams); err != nil {
			return errs.NewInternalError(err)
		}
		return nil
	})

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
		StartDate:   params.StartDate,
		TaskId:      params.TaskId,
		UserId:      params.UserId,
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

	updateDateAndTypeInput := taskRepo.UpdateInput{
		Type:      string(taskType),
		StartDate: params.Date,
		TaskId:    params.TaskId,
		UserId:    params.UserId,
	}

	if err := ts.taskRepo.Update(ctx, updateDateAndTypeInput); err != nil {
		return entity.Task{}, errs.CheckSqlError(err, "Task")
	}

	return task, nil
}

func (ts *Service) UpdateTaskStatus(ctx context.Context, params taskservice.UpdateStatusInput) error {
	updateStatusParams := taskRepo.UpdateInput{
		TaskId: params.TaskId,
		UserId: params.UserId,
		Status: string(params.Status),
	}

	err := ts.taskRepo.Update(ctx, updateStatusParams)

	if err != nil {
		return errs.CheckSqlError(err, "Task")
	}
	return nil
}

func (ts *Service) TrashTask(ctx context.Context, params taskservice.TrashInput) error {
	trashTaskParams := taskRepo.UpdateInput{
		TaskId: params.TaskId,
		UserId: params.UserId,
	}
	err := ts.taskRepo.Update(ctx, trashTaskParams)

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
