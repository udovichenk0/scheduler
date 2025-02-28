package rest

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	"github.com/udovichenk0/scheduler/internal/entity"
	taskservice "github.com/udovichenk0/scheduler/internal/ports/api/task"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	"github.com/udovichenk0/scheduler/pkg/errs"
	session_manager "github.com/udovichenk0/scheduler/pkg/session-manager"
)

type TaskHandler struct {
	task taskservice.Port
	user userservice.Port
	v    *validator.Validate
	sm   session_manager.SessionManager
}

func NewTaskHandler(task taskservice.Port, user userservice.Port, validator *validator.Validate, sm session_manager.SessionManager) *TaskHandler {
	return &TaskHandler{task, user, validator, sm}
}

func (th *TaskHandler) Get(fc *fiber.Ctx) error {

	user := th.sm.Get(fc.UserContext(), "user").(entity.User)
	tasks, err := th.task.GetTasks(fc.Context(), user.Id)
	if err != nil {
		return err
	}
	fc.JSON(tasks)
	return nil
}

func (th *TaskHandler) Create(fc *fiber.Ctx) error {
	user := th.sm.Get(fc.UserContext(), "user").(entity.User)

	taskFields := new(dto.CreateTaskRequestBody)
	if err := fc.BodyParser(taskFields); err != nil {
		return errs.NewBadRequestError(err)
	}
	if fieldErrs := th.v.Struct(taskFields); fieldErrs != nil {
		return errs.CheckValidationError(fieldErrs)
	}

	newTask := taskservice.CreateInput{
		UserId:      user.Id,
		Title:       taskFields.Title,
		Description: taskFields.Description,
		Type:        taskFields.Type,
		Status:      taskFields.Status,
		StartDate:   taskFields.StartDate,
	}

	task, err := th.task.CreateTask(fc.Context(), newTask)

	if err != nil {
		return err
	}

	fc.JSON(task)
	return nil
}

func (th *TaskHandler) Trash(fc *fiber.Ctx) error {
	user := th.sm.Get(fc.UserContext(), "user").(entity.User)

	params := new(dto.TrashTaskRequestParams)

	if err := fc.ParamsParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	trashTaskParams := taskservice.TrashInput{
		TaskId: params.TaskId,
		UserId: user.Id,
	}

	err := th.task.TrashTask(fc.Context(), trashTaskParams)

	if err != nil {
		return err
	}

	return nil
}

func (th *TaskHandler) Update(fc *fiber.Ctx) error {
	user := th.sm.Get(fc.UserContext(), "user").(entity.User)

	taskFields := new(dto.UpdateTaskRequestBody)
	params := new(dto.UpdateTaskRequestParams)

	if err := fc.ParamsParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := th.v.Struct(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := fc.BodyParser(taskFields); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := th.v.Struct(taskFields); err != nil {
		return errs.NewBadRequestError(err)
	}

	updateTaskParams := taskservice.UpdateInput{
		UserId:      user.Id,
		TaskId:      params.TaskId,
		Title:       taskFields.Title,
		Description: taskFields.Description,
		Type:        taskFields.Type,
		Status:      taskFields.Status,
		StartDate:   taskFields.StartDate,
	}

	task, err := th.task.UpdateTask(fc.Context(), updateTaskParams)

	if err != nil {
		return err
	}

	fc.JSON(task)
	return nil
}

func (th *TaskHandler) UpdateDate(fc *fiber.Ctx) error {
	user := th.sm.Get(fc.UserContext(), "user").(entity.User)

	params := new(dto.UpdateDateRequestParams)
	if err := fc.ParamsParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := th.v.Struct(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	data := new(dto.UpdateTaskDateRequestBody)
	if err := fc.BodyParser(data); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := th.v.Struct(data); err != nil {
		return errs.NewBadRequestError(err)
	}

	updateTaskDateParams := taskservice.UpdateDateInput{
		TaskId: params.TaskId,
		UserId: user.Id,
		Date:   data.StartDate,
	}
	task, err := th.task.UpdateTaskDate(fc.Context(), updateTaskDateParams)
	if err != nil {
		return err
	}

	fc.JSON(task)
	return nil
}

func (th *TaskHandler) UpdateStatus(fc *fiber.Ctx) error {
	user := th.sm.Get(fc.UserContext(), "user").(entity.User)

	params := new(dto.UpdateStatusRequestParams)
	if err := fc.ParamsParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	body := new(dto.UpdateStatusRequestBody)
	if err := fc.BodyParser(body); err != nil {
		return errs.NewBadRequestError(err)
	}

	updateStatusParams := taskservice.UpdateStatusInput{
		Status: body.Status,
		TaskId: params.TaskId,
		UserId: user.Id,
	}

	if err := th.task.UpdateTaskStatus(fc.Context(), updateStatusParams); err != nil {
		return err
	}

	return nil
}

func (th *TaskHandler) DeleteTrashedTask(fc *fiber.Ctx) error {
	user := th.sm.Get(fc.UserContext(), "user").(entity.User)

	params := new(dto.DeleteTrashedTaskRequestParams)
	if err := fc.ParamsParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	deleteTrashedTaskParams := taskservice.DeleteInput{
		TaskId: params.TaskId,
		UserId: user.Id,
	}

	if err := th.task.DeleteTrashedTask(fc.Context(), deleteTrashedTaskParams); err != nil {
		return err
	}

	return nil
}

func (th *TaskHandler) DeleteTrashedTasks(fc *fiber.Ctx) error {
	user := th.sm.Get(fc.UserContext(), "user").(entity.User)

	if err := th.task.DeleteTrashedTasks(fc.Context(), user.Id); err != nil {
		return err
	}

	return nil
}
