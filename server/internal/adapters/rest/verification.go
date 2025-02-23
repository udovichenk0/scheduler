package rest

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	verificationservice "github.com/udovichenk0/scheduler/internal/ports/api/verification"
	"github.com/udovichenk0/scheduler/pkg/errs"
	session_manager "github.com/udovichenk0/scheduler/pkg/session-manager"
)

type VerificationHandler struct {
	verificationService verificationservice.Port
	v                   *validator.Validate
	sm                  session_manager.SessionManager
}

func NewVerificationHandler(verificationService verificationservice.Port, v *validator.Validate, sm session_manager.SessionManager) *VerificationHandler {
	return &VerificationHandler{verificationService: verificationService, v: v, sm: sm}
}

func (v VerificationHandler) VerifyCode(fc *fiber.Ctx) error {
	s := new(dto.VerificationCodeBody)
	if err := fc.BodyParser(s); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := v.v.Struct(s); err != nil {
		return errs.NewBadRequestError(err)
	}
	user, err := v.verificationService.VerifyUser(fc.Context(), s.Code, s.UserId)
	if err != nil {
		return err
	}

	session, err := v.sm.Commit("user", user)

	if err != nil {
		return err
	}
	v.sm.PersistToCookie(fc, session)

	return nil
}

func (v VerificationHandler) ResendCode(fc *fiber.Ctx) error {
	s := new(dto.ResendCodeBody)
	if err := fc.BodyParser(s); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := v.v.Struct(s); err != nil {
		return errs.NewBadRequestError(err)
	}

	err := v.verificationService.ChangeCode(fc.Context(), s.UserId, s.Email)

	if err != nil {
		return err
	}

	return nil
}
