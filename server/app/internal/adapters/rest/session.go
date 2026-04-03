package rest

import (
	"errors"
	"log/slog"

	"github.com/gofiber/fiber/v2"
	authserviceport "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	"github.com/zhulik/pal"
)

type SessionHandler struct {
	Sm     sessionManager.ISessionManager
	Logger logger.ILogger
}

func (h *SessionHandler) CheckSession(fc *fiber.Ctx) error {
	sessionId := fc.Cookies("sessionId")
	if sessionId == "" {
		return nil
	}

	session, err := h.Sm.Find(fc.Context(), sessionId)
	if err != nil {
		h.Logger.Error("failed to find session", err.Error())
		return errs.NewInternalError(err)
	}

	m, err := h.Sm.Decode(session.Data)

	if err != nil {
		h.Logger.Error("failed to decode session data", slog.Any("err", err))
		return errs.NewInternalError(err)
	}

	user, ok := m["user"].(authserviceport.AuthUser)
	if !ok {
		return errs.NewInternalError(errors.New("no user data in context"))
	}

	fc.JSON(user)
	return nil
}

func ProvideSession() pal.ServiceDef {
	return pal.Provide(&SessionHandler{})
}
