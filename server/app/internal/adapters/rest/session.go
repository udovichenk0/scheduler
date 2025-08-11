package rest

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/entity"
	"github.com/udovichenk0/scheduler/pkg/errs"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	"github.com/zhulik/pal"
)

type SessionHandler struct {
	Sm sessionManager.ISessionManager
}

func (h *SessionHandler) CheckSession(fc *fiber.Ctx) error {
	sessionId := fc.Cookies("sessionId")
	if sessionId == "" {
		return nil
	}

	session, err := h.Sm.Find(sessionId)
	if err != nil {
		return errs.NewInternalError(err)
	}

	m, err := h.Sm.Decode(session.Data)

	if err != nil {
		return errs.NewInternalError(err)
	}

	user, ok := m["user"].(entity.User)

	if !ok {
		return errs.NewInternalError(errors.New("no user data in context"))
	}

	fc.JSON(user)
	return nil
}

func ProvideSession() pal.ServiceDef {
	return pal.Provide(&SessionHandler{})
}
