package rest

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/config"
	authservice "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	projectservice "github.com/udovichenk0/scheduler/internal/ports/api/project"
	taskservice "github.com/udovichenk0/scheduler/internal/ports/api/task"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	verificationservice "github.com/udovichenk0/scheduler/internal/ports/api/verification"
	"github.com/udovichenk0/scheduler/internal/ports/repository/task"
	"github.com/udovichenk0/scheduler/internal/ports/repository/user"
	"github.com/udovichenk0/scheduler/pkg/logger"
	session_manager "github.com/udovichenk0/scheduler/pkg/session-manager"
)

type Repositories struct {
	User user.Port
	Task task.Port
}
type Deps struct {
	Task         taskservice.Port
	Auth         authservice.Port
	Project      projectservice.Port
	User         userservice.Port
	Verification verificationservice.Port
	Sm           session_manager.SessionManager
	Logger       logger.Logger
}

type Handler struct {
	deps   *Deps
	app    *fiber.App
	config *config.Config
	v      *validator.Validate
}

func NewHandler(
	services *Deps,
	app *fiber.App,
	config *config.Config,
	v *validator.Validate,
) *Handler {
	return &Handler{services, app, config, v}
}

func (h Handler) Run() {
	authHandler := NewAuthHandler(h.deps.Auth, h.deps.User, h.v, h.deps.Sm, h.deps.Logger)
	taskHandler := NewTaskHandler(h.deps.Task, h.deps.User, h.v, h.deps.Sm, h.deps.Logger)
	projectHandler := NewProjectHandler(h.deps.User, h.deps.Project, h.v, h.deps.Sm, h.deps.Logger)
	userHandler := NewUserHandler(h.deps.User, h.v, h.deps.Logger)
	sessionHandler := NewSessionHandler(h.deps.Sm)
	verificationHandler := NewVerificationHandler(h.deps.Verification, h.v, h.deps.Sm, h.deps.Logger)

	apiGroup := h.app.Group("/api")

	apiGroup.Get("/email/exists", userHandler.VerifiedUserExists)
	auth := apiGroup.Group("/auth")
	auth.Post("/signup", authHandler.Singup)
	auth.Post("/signin", authHandler.Singin)
	auth.Post("/signout", authHandler.SignOut)
	auth.Post("/verify", verificationHandler.VerifyCode)
	auth.Post("/resend", verificationHandler.ResendCode)
	auth.Get("/session", sessionHandler.CheckSession)

	tasks := apiGroup.Group("tasks")
	tasks.Get("/", h.deps.Sm.Protected(taskHandler.Get))
	tasks.Get("/:projectId", h.deps.Sm.Protected(taskHandler.GetByProjectId))
	tasks.Post("/", h.deps.Sm.Protected(taskHandler.Create))
	tasks.Post("/:taskId/trash", h.deps.Sm.Protected(taskHandler.Trash))
	tasks.Put("/:taskId", h.deps.Sm.Protected(taskHandler.Update))
	tasks.Patch("/:taskId/date", h.deps.Sm.Protected(taskHandler.UpdateDate))
	tasks.Patch("/:taskId/priority", h.deps.Sm.Protected(taskHandler.UpdatePriority))
	tasks.Patch("/:taskId/status", h.deps.Sm.Protected(taskHandler.UpdateStatus))
	tasks.Delete("/:taskId", h.deps.Sm.Protected(taskHandler.DeleteTrashedTask))
	tasks.Delete("/", h.deps.Sm.Protected(taskHandler.DeleteTrashedTasks))

	project := apiGroup.Group("project")
	project.Get("/", h.deps.Sm.Protected(projectHandler.GetByUserId))
	project.Post("/", h.deps.Sm.Protected(projectHandler.Create))
}
