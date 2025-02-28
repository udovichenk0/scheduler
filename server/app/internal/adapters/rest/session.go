package rest

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/entity"
	"github.com/udovichenk0/scheduler/pkg/errs"
	session_manager "github.com/udovichenk0/scheduler/pkg/session-manager"
)

type SessionHandler struct {
	sm session_manager.SessionManager
}

func NewSessionHandler(sm session_manager.SessionManager) *SessionHandler {
	return &SessionHandler{sm: sm}
}

func (s SessionHandler) CheckSession(fc *fiber.Ctx) error {
	sessionId := fc.Cookies("sessionId")
	if sessionId == "" {
		return nil
	}
	session, err := s.sm.Find(sessionId)

	if err != nil {
		return errs.NewInternalError(err)
	}

	m, err := s.sm.Decode(session.Data)

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
