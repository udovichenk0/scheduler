package rest

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	"github.com/udovichenk0/scheduler/internal/entity"
	projectservice "github.com/udovichenk0/scheduler/internal/ports/api/project"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	"github.com/udovichenk0/scheduler/pkg/errs"
	sessionmanager "github.com/udovichenk0/scheduler/pkg/session-manager"
)

type ProjectHandler struct {
	user    userservice.Port
	project projectservice.Port
	v       *validator.Validate
	sm      sessionmanager.SessionManager
}

func NewProjectHandler(user userservice.Port, project projectservice.Port, v *validator.Validate, sm sessionmanager.SessionManager) *ProjectHandler {
	return &ProjectHandler{user: user, project: project, v: v, sm: sm}
}

func (ph *ProjectHandler) GetByUserId(fc *fiber.Ctx) error {
	user := ph.sm.Get(fc.UserContext(), "user").(entity.User)
	projects, err := ph.project.GetProjects(fc.Context(), user.Id)
	if err != nil {
		return err
	}
	return fc.JSON(projects)
}

func (ph *ProjectHandler) Create(fc *fiber.Ctx) error {
	user := ph.sm.Get(fc.UserContext(), "user").(entity.User)
	body := new(dto.CreateProjectRequestBody)
	if err := fc.BodyParser(body); err != nil {
		return errs.NewBadRequestError(err)
	}
	createProjectParams := projectservice.CreateProject{
		UserId: user.Id,
		Name:   body.Name,
	}
	project, err := ph.project.CreateProject(fc.Context(), createProjectParams)
	if err != nil {
		return err
	}

	return fc.JSON(project)
}
