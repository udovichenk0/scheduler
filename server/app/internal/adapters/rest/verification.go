package rest

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	verificationservice "github.com/udovichenk0/scheduler/internal/ports/api/verification"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	validator "github.com/udovichenk0/scheduler/pkg/validation"
	"github.com/zhulik/pal"
)

type VerificationHandler struct {
	VerificationService verificationservice.Api
	*validator.Validator
	Sm     sessionManager.ISessionManager
	Logger logger.ILogger
}

func (h VerificationHandler) VerifyCode(fc *fiber.Ctx) error {
	s := new(dto.VerificationCodeBody)
	if err := fc.BodyParser(s); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := h.Vali.Struct(s); err != nil {
		return errs.NewBadRequestError(err)
	}
	user, err := h.VerificationService.VerifyUser(fc.Context(), s.Code, s.UserId)
	if err != nil {
		h.Logger.Error("failed to verify a user", slog.Any("err", err))
		return err
	}

	session, err := h.Sm.Commit(fc.Context(), "user", user)

	if err != nil {
		return err
	}
	h.Sm.PersistToCookie(fc, session)

	return nil
}

func (h VerificationHandler) ResendCode(fc *fiber.Ctx) error {
	s := new(dto.ResendCodeBody)
	if err := fc.BodyParser(s); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := h.Vali.Struct(s); err != nil {
		return errs.NewBadRequestError(err)
	}

	err := h.VerificationService.ChangeCode(fc.Context(), s.UserId, s.Email)

	if err != nil {
		h.Logger.Error("failed to resend code", slog.Any("err", err))
		return err
	}

	return nil
}

func ProvideVerificatoin() pal.ServiceDef {
	return pal.Provide(&VerificationHandler{})
}
