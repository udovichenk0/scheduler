package rest

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	"github.com/udovichenk0/scheduler/internal/entity"
	authservice "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	validator "github.com/udovichenk0/scheduler/pkg/validation"
	"github.com/zhulik/pal"
)

type AuthHandler struct {
	AuthService authservice.Api
	UserService userservice.Api
	*validator.Validator
	Sm     sessionManager.ISessionManager
	Logger logger.ILogger
}

func (h *AuthHandler) Singup(fc *fiber.Ctx) error {
	creds := new(dto.Credentials)

	if err := fc.BodyParser(creds); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := h.Vali.Struct(creds); err != nil {
		return errs.NewBadRequestError(err)
	}

	user, err := h.AuthService.SignUp(fc.Context(), creds.Email, creds.Password)
	if err != nil {
		h.Logger.Error("failed to signup a user", slog.Any("err", err))
		return err
	}
	fc.JSON(dto.UserDto{
		Id:       user.Id,
		Email:    user.Email,
		Verified: user.Verified,
	})
	return nil
}

func (h *AuthHandler) Singin(fc *fiber.Ctx) error {
	creds := new(dto.Credentials)

	if err := fc.BodyParser(creds); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := h.Vali.Struct(creds); err != nil {
		return errs.NewBadRequestError(err)
	}

	result, err := h.AuthService.SignIn(fc.Context(), creds.Email, creds.Password)
	if err != nil {
		h.Logger.Error("failed to signin a user", slog.Any("err", err))
		return err
	}

	h.Sm.PersistToCookie(fc, result.Session)

	fc.JSON(dto.UserDto{
		Id:       result.User.Id,
		Email:    result.User.Email,
		Verified: result.User.Verified,
	})
	return nil
}

func (h *AuthHandler) SignOut(fc *fiber.Ctx) error {
	sessionId := fc.Cookies("sessionId")
	err := h.AuthService.SignOut(fc.Context(), sessionId)
	if err != nil {
		h.Logger.Error("failed to signout a user", slog.Any("err", err))
		return err
	}
	h.Sm.ClearSessionFromCookie(fc)
	return nil
}

func (h *AuthHandler) CheckSession(fc *fiber.Ctx) error {
	sessionId := fc.Cookies("sessionId")

	ctx, err := h.Sm.Load(fc.Context(), sessionId)
	if err != nil {
		return err
	}

	user := h.Sm.Get(ctx, "user").(entity.User)

	fc.JSON(user)
	return nil
}

func ProvideAuth() pal.ServiceDef {
	return pal.Provide(&AuthHandler{})
}
