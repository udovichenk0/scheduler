package rest

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	authserviceport "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	taskservice "github.com/udovichenk0/scheduler/internal/ports/api/task"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	validator "github.com/udovichenk0/scheduler/pkg/validation"
	"github.com/zhulik/pal"
)

type TaskHandler struct {
	Task taskservice.Api
	// List list.Api
	User userservice.Api
	*validator.Validator
	Sm     sessionManager.ISessionManager
	Logger logger.ILogger
}

// func (h *TaskHandler) GetPrivateTasks(fc *fiber.Ctx) error {
// 	user := h.Sm.Get(fc.UserContext(), "user").(domain.User)

// 	tasks, err := h.List.GetPrivateTasksByListId(fc.Context(), list.GetPrivateTasksByListIdInput{
// 		UserId: user.Id,
// 	})
// 	if err != nil {
// 		// h.Logger.Error("failed to get user's private tasks", slog.Any("err", err), slog.String("userId", user.Id))
// 		return err
// 	}
// 	fc.JSON(tasks)
// 	return nil
// }

func (h *TaskHandler) GetTasksByListId(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
	params := new(dto.GetTasksByListIdParams)
	if err := fc.ParamsParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := h.Vali.Struct(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	tasks, err := h.Task.GetTasksByListId(fc.Context(), taskservice.GetByListIdInput{
		UserId: user.Id,
		ListId: params.ListId,
	})
	if err != nil {
		h.Logger.Error("failed to get tasks by list id", slog.Any("err", err))
		return err
	}
	return fc.JSON(tasks)
}

func (h *TaskHandler) Create(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)

	taskFields := new(dto.CreateTaskRequestBody)
	if err := fc.BodyParser(taskFields); err != nil {
		return errs.NewBadRequestError(err)
	}
	if fieldErrs := h.Vali.Struct(taskFields); fieldErrs != nil {
		return errs.CheckValidationError(fieldErrs)
	}

	task, err := h.Task.CreateTask(fc.Context(), taskservice.CreateInput{
		UserId:      user.Id,
		Title:       taskFields.Title,
		Description: taskFields.Description,
		Type:        taskFields.Type,
		Status:      taskFields.Status,
		StartDate:   taskFields.StartDate,
		DueDate:     taskFields.DueDate,
		Priority:    taskFields.Priority,
		ListId:      taskFields.ListId,
	})

	if err != nil {
		h.Logger.Error("failed to create task", slog.Any("err", err))
		return err
	}
	fc.JSON(task)
	return nil
}

func (h *TaskHandler) Trash(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)

	params := new(dto.TrashTaskRequestParams)

	if err := fc.ParamsParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	trashTaskParams := taskservice.TrashInput{
		TaskId: params.TaskId,
		UserId: user.Id,
	}

	err := h.Task.TrashTask(fc.Context(), trashTaskParams)

	if err != nil {
		h.Logger.Error("failed to trash task", err)
		return err
	}

	return nil
}

func (h *TaskHandler) Update(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)

	taskFields := new(dto.UpdateTaskRequestBody)
	params := new(dto.UpdateTaskRequestParams)

	if err := fc.ParamsParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := h.Vali.Struct(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := fc.BodyParser(taskFields); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := h.Vali.Struct(taskFields); err != nil {
		return errs.NewBadRequestError(err)
	}

	task, err := h.Task.UpdateTask(fc.Context(), taskservice.UpdateInput{
		UserId:      user.Id,
		TaskId:      params.TaskId,
		Title:       taskFields.Title,
		Description: taskFields.Description,
		Type:        taskFields.Type,
		Status:      taskFields.Status,
		StartDate:   taskFields.StartDate,
		DueDate:     taskFields.DueDate,
		Priority:    taskFields.Priority,
		ListId:      taskFields.ListId,
	})

	if err != nil {
		h.Logger.Error("failed to update task", err)
		return err
	}

	fc.JSON(task)
	return nil
}

// func (h *TaskHandler) UpdateDate(fc *fiber.Ctx) error {
// 	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)

// 	params := new(dto.UpdateDateRequestParams)
// 	if err := fc.ParamsParser(params); err != nil {
// 		return errs.NewBadRequestError(err)
// 	}
// 	if err := h.Vali.Struct(params); err != nil {
// 		return errs.NewBadRequestError(err)
// 	}

// 	data := new(dto.UpdateTaskDateRequestBody)
// 	if err := fc.BodyParser(data); err != nil {
// 		return errs.NewBadRequestError(err)
// 	}
// 	if err := h.Vali.Struct(data); err != nil {
// 		return errs.NewBadRequestError(err)
// 	}

// 	updateTaskDateParams := taskservice.UpdateDateInput{
// 		TaskId:    params.TaskId,
// 		UserId:    user.Id,
// 		StartDate: data.StartDate,
// 		DueDate:   data.DueDate,
// 	}

// 	task, err := h.Task.UpdateTaskDate(fc.Context(), updateTaskDateParams)
// 	if err != nil {
// 		h.Logger.Error("failed to update task date", slog.Any("err", err))
// 		return err
// 	}

// 	fc.JSON(task)
// 	return nil
// }

// func (h *TaskHandler) UpdateStatus(fc *fiber.Ctx) error {
// 	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)

// 	params := new(dto.UpdateStatusRequestParams)
// 	if err := fc.ParamsParser(params); err != nil {
// 		return errs.NewBadRequestError(err)
// 	}

// 	body := new(dto.UpdateStatusRequestBody)
// 	if err := fc.BodyParser(body); err != nil {
// 		return errs.NewBadRequestError(err)
// 	}

// 	updateStatusParams := taskservice.UpdateStatusInput{
// 		Status: body.Status,
// 		TaskId: params.TaskId,
// 		UserId: user.Id,
// 	}

// 	if err := h.Task.UpdateTaskStatus(fc.Context(), updateStatusParams); err != nil {
// 		h.Logger.Error("failed to update task status", slog.Any("err", err))
// 		return err
// 	}

// 	return nil
// }

// func (h *TaskHandler) UpdatePriority(fc *fiber.Ctx) error {
// 	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)

// 	params := new(dto.UpdatePriorityRequestParams)
// 	if err := fc.ParamsParser(params); err != nil {
// 		return errs.NewBadRequestError(err)
// 	}

// 	body := new(dto.UpdatePriorityRequestBody)
// 	if err := fc.BodyParser(body); err != nil {
// 		return errs.NewBadRequestError(err)
// 	}

// 	updatePriorityParams := taskservice.UpdatePriorityInput{
// 		Priority: body.Priority,
// 		TaskId:   params.TaskId,
// 		UserId:   user.Id,
// 	}

// 	if err := h.Task.UpdateTaskPriority(fc.Context(), updatePriorityParams); err != nil {
// 		h.Logger.Error("failed to update task priority", slog.Any("err", err))
// 		return err
// 	}

// 	return nil
// }

func (h *TaskHandler) DeleteTrashedTask(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)

	params := new(dto.DeleteTrashedTaskRequestParams)
	if err := fc.ParamsParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	deleteTrashedTaskParams := taskservice.DeleteInput{
		TaskId: params.TaskId,
		UserId: user.Id,
	}

	if err := h.Task.DeleteTrashedTask(fc.Context(), deleteTrashedTaskParams); err != nil {
		h.Logger.Error("failed to delete trashed task", slog.Any("err", err))
		return err
	}

	return nil
}

func (h *TaskHandler) DeleteTrashedTasks(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)

	if err := h.Task.DeleteTrashedTasks(fc.Context(), user.Id); err != nil {
		h.Logger.Error("failed to delete trashed tasks", slog.Any("err", err))
		return err
	}

	return nil
}

func ProvideTask() pal.ServiceDef {
	return pal.Provide(&TaskHandler{})
}
