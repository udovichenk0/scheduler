package rest

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/udovichenk0/scheduler/internal/adapters/sse"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	"github.com/zhulik/pal"
)

type Handler struct {
	AuthHandler         *AuthHandler
	UserHandler         *UserHandler
	TaskHandler         *TaskHandler
	ListHandler         *ListHandler
	SessionHandler      *SessionHandler
	ProjectHandler      *ProjectHandler
	VerificationHandler *VerificationHandler
	InvitationHandler   *InvitationHandler
	SseHandler          *sse.SseHandler
	Sm                  sessionManager.ISessionManager
}

func (h *Handler) InitHandlers(app *fiber.App) {
	apiGroup := app.Group("/api")
	apiGroup.Get("/sse", adaptor.HTTPHandlerFunc(h.SseHandler.Invitation.HandleConnect))
	apiGroup.Get("/email/exists", h.UserHandler.VerifiedUserExists)
	auth := apiGroup.Group("/auth")
	auth.Post("/signup", h.AuthHandler.Singup)
	auth.Post("/signin", h.AuthHandler.Singin)
	auth.Post("/signout", h.AuthHandler.SignOut)
	auth.Post("/verify", h.VerificationHandler.VerifyCode)
	auth.Post("/resend", h.VerificationHandler.ResendCode)
	auth.Get("/session", h.SessionHandler.CheckSession)

	project := apiGroup.Group("project")
	project.Get("/", h.Sm.Protected(h.ProjectHandler.GetByUserId))
	project.Get("/private", h.Sm.Protected(h.ProjectHandler.GetPrivateProject))
	project.Post("/", h.Sm.Protected(h.ProjectHandler.Create))
	project.Post("/:projectId/list", h.Sm.Protected(h.ProjectHandler.CreateList))

	lists := apiGroup.Group("lists")
	// lists.Get("/", h.Sm.Protected(h.ListHandler.Get))
	// lists.Get("/:listId", h.Sm.Protected(h.ListHandler.GetListById))
	// lists.Get("/private", h.Sm.Protected(h.ListHandler.GetPrivateList))
	lists.Get("/:listId/tasks", h.Sm.Protected(h.TaskHandler.GetTasksByListId))

	tasks := apiGroup.Group("tasks")
	tasks.Post("/", h.Sm.Protected(h.TaskHandler.Create))
	tasks.Post("/:taskId/trash", h.Sm.Protected(h.TaskHandler.Trash))
	tasks.Put("/:taskId", h.Sm.Protected(h.TaskHandler.Update))
	// tasks.Patch("/:taskId/date", h.Sm.Protected(h.TaskHandler.UpdateDate))
	// tasks.Patch("/:taskId/priority", h.Sm.Protected(h.TaskHandler.UpdatePriority))
	// tasks.Patch("/:taskId/status", h.Sm.Protected(h.TaskHandler.UpdateStatus))
	tasks.Delete("/:taskId", h.Sm.Protected(h.TaskHandler.DeleteTrashedTask))
	tasks.Delete("/", h.Sm.Protected(h.TaskHandler.DeleteTrashedTasks))

	invitation := apiGroup.Group("invitation")
	invitation.Get("/", h.Sm.Protected(h.InvitationHandler.GetInvitations))
	invitation.Post("/", h.Sm.Protected(h.InvitationHandler.Invite))
}

func Provide() pal.ServiceDef {
	return pal.ProvideList(
		pal.Provide(&AuthHandler{}),
		pal.Provide(&ProjectHandler{}),
		pal.Provide(&SessionHandler{}),
		pal.Provide(&TaskHandler{}),
		pal.Provide(&ListHandler{}),
		pal.Provide(&UserHandler{}),
		pal.Provide(&VerificationHandler{}),
		pal.Provide(&InvitationHandler{}),
		pal.Provide(&Handler{}),
	)
}
