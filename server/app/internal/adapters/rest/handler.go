package rest

import (
	"github.com/gofiber/fiber/v2"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	"github.com/zhulik/pal"
)

type Handler struct {
	AuthHandler         *AuthHandler
	UserHandler         *UserHandler
	TaskHandler         *TaskHandler
	SessionHandler      *SessionHandler
	ProjectHandler      *ProjectHandler
	VerificationHandler *VerificationHandler
	Sm                  sessionManager.ISessionManager
}

func (h *Handler) InitHandlers(app *fiber.App) {
	apiGroup := app.Group("/api")
	apiGroup.Get("/email/exists", h.UserHandler.VerifiedUserExists)
	auth := apiGroup.Group("/auth")
	auth.Post("/signup", h.AuthHandler.Singup)
	auth.Post("/signin", h.AuthHandler.Singin)
	auth.Post("/signout", h.AuthHandler.SignOut)
	auth.Post("/verify", h.VerificationHandler.VerifyCode)
	auth.Post("/resend", h.VerificationHandler.ResendCode)
	auth.Get("/session", h.SessionHandler.CheckSession)

	tasks := apiGroup.Group("tasks")
	tasks.Get("/", h.Sm.Protected(h.TaskHandler.Get))
	tasks.Get("/:projectId", h.Sm.Protected(h.TaskHandler.GetByProjectId))
	tasks.Post("/", h.Sm.Protected(h.TaskHandler.Create))
	tasks.Post("/:taskId/trash", h.Sm.Protected(h.TaskHandler.Trash))
	tasks.Put("/:taskId", h.Sm.Protected(h.TaskHandler.Update))
	tasks.Patch("/:taskId/date", h.Sm.Protected(h.TaskHandler.UpdateDate))
	tasks.Patch("/:taskId/priority", h.Sm.Protected(h.TaskHandler.UpdatePriority))
	tasks.Patch("/:taskId/status", h.Sm.Protected(h.TaskHandler.UpdateStatus))
	tasks.Delete("/:taskId", h.Sm.Protected(h.TaskHandler.DeleteTrashedTask))
	tasks.Delete("/", h.Sm.Protected(h.TaskHandler.DeleteTrashedTasks))

	project := apiGroup.Group("project")
	project.Get("/", h.Sm.Protected(h.ProjectHandler.GetByUserId))
	project.Post("/", h.Sm.Protected(h.ProjectHandler.Create))
}

func Provide() pal.ServiceDef {
	return pal.ProvideList(
		pal.Provide(&AuthHandler{}),
		pal.Provide(&ProjectHandler{}),
		pal.Provide(&SessionHandler{}),
		pal.Provide(&TaskHandler{}),
		pal.Provide(&UserHandler{}),
		pal.Provide(&VerificationHandler{}),
		pal.Provide(&Handler{}),
	)

}
