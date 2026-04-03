package rest

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	authserviceport "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	projectservice "github.com/udovichenk0/scheduler/internal/ports/api/project"
	projectserviceport "github.com/udovichenk0/scheduler/internal/ports/api/project"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	sessionmanager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	validator "github.com/udovichenk0/scheduler/pkg/validation"
	"github.com/zhulik/pal"
)

type ProjectHandler struct {
	Project projectservice.Api
	Sm      sessionmanager.ISessionManager
	*validator.Validator
	Logger logger.ILogger
}

func (h *ProjectHandler) GetByUserId(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
	projects, err := h.Project.GetProjects(fc.Context(), user.Id)
	if err != nil {
		h.Logger.Error("failed to get projects", slog.Any("err", err))
		return err
	}
	return fc.JSON(projects)
}

func (h *ProjectHandler) GetPrivateProject(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
	projects, err := h.Project.GetPrivateProjectByUserId(fc.Context(), user.Id)
	if err != nil {
		h.Logger.Error("failed to get projects", slog.Any("err", err))
		return err
	}
	return fc.JSON(projects)
}

func (h *ProjectHandler) Create(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
	body := new(dto.CreateProjectRequestBody)
	if err := fc.BodyParser(body); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := h.Vali.Struct(body); err != nil {
		return errs.NewBadRequestError(err)
	}

	project, err := h.Project.CreateProjectWithDefaultList(fc.Context(), projectservice.CreateProjectInput{
		UserId: user.Id,
		Name:   body.Name,
	})
	if err != nil {
		return err
	}

	return fc.JSON(project)
}

func (h *ProjectHandler) CreateList(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
	query := new(dto.CreateListRequestQuery)
	if err := fc.QueryParser(query); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := h.Vali.Struct(query); err != nil {
		return errs.NewBadRequestError(err)
	}

	body := new(dto.CreateListRequestBody)
	if err := fc.BodyParser(body); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := h.Vali.Struct(body); err != nil {
		return errs.NewBadRequestError(err)
	}

	list, err := h.Project.CreateList(fc.Context(), projectserviceport.CreateListInput{
		Name:      body.Name,
		UserId:    user.Id,
		ProjectId: query.ProjectId,
	})

	if err != nil {
		return err
	}

	return fc.JSON(list)
}

func ProvideProject() pal.ServiceDef {
	return pal.Provide(&ProjectHandler{})
}
