package rest

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	"github.com/udovichenk0/scheduler/internal/entity"
	projectservice "github.com/udovichenk0/scheduler/internal/ports/api/project"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	sessionmanager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	"github.com/zhulik/pal"
)

type ProjectHandler struct {
	Project projectservice.Api
	Sm      sessionmanager.ISessionManager
	Logger  logger.ILogger
}

func (h *ProjectHandler) GetByUserId(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(entity.User)
	projects, err := h.Project.GetProjects(fc.Context(), user.Id)
	if err != nil {
		h.Logger.Error("failed to get projects", slog.Any("err", err))
		return err
	}
	return fc.JSON(projects)
}

func (h *ProjectHandler) Create(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(entity.User)
	body := new(dto.CreateProjectRequestBody)
	if err := fc.BodyParser(body); err != nil {
		return errs.NewBadRequestError(err)
	}
	createProjectParams := projectservice.CreateProject{
		UserId: user.Id,
		Name:   body.Name,
	}
	project, err := h.Project.CreateProject(fc.Context(), createProjectParams)
	if err != nil {
		h.Logger.Error("failed to create a project", slog.Any("err", err))
		return err
	}

	return fc.JSON(project)
}

func ProvideProject() pal.ServiceDef {
	return pal.Provide(&ProjectHandler{})
}
