package rest

import (
	"log/slog"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	"github.com/udovichenk0/scheduler/internal/entity"
	authservice "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	session_manager "github.com/udovichenk0/scheduler/pkg/session-manager"
)

type AuthHandler struct {
	authService authservice.Port
	userService userservice.Port
	v           *validator.Validate
	sm          session_manager.SessionManager
	logger      logger.Logger
}

func NewAuthHandler(
	authService authservice.Port,
	userService userservice.Port,
	v *validator.Validate,
	sm session_manager.SessionManager,
	logger logger.Logger,
) *AuthHandler {
	return &AuthHandler{authService, userService, v, sm, logger}
}

func (ah AuthHandler) Singup(fc *fiber.Ctx) error {
	creds := new(dto.Credentials)

	if err := fc.BodyParser(creds); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := ah.v.Struct(creds); err != nil {
		return errs.NewBadRequestError(err)
	}

	user, err := ah.authService.SignUp(fc.Context(), creds.Email, creds.Password)
	if err != nil {
		ah.logger.Error("failed to signup a user", slog.Any("err", err))
		return err
	}
	fc.JSON(dto.UserDto{
		Id:       user.Id,
		Email:    user.Email,
		Verified: user.Verified,
	})
	return nil
}

func (ah AuthHandler) Singin(fc *fiber.Ctx) error {
	creds := new(dto.Credentials)

	if err := fc.BodyParser(creds); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := ah.v.Struct(creds); err != nil {
		return errs.NewBadRequestError(err)
	}

	result, err := ah.authService.SignIn(fc.Context(), creds.Email, creds.Password)
	if err != nil {
		ah.logger.Error("failed to signin a user", slog.Any("err", err))
		return err
	}

	ah.sm.PersistToCookie(fc, result.Session)

	fc.JSON(dto.UserDto{
		Id:       result.User.Id,
		Email:    result.User.Email,
		Verified: result.User.Verified,
	})
	return nil
}

func (ah AuthHandler) SignOut(fc *fiber.Ctx) error {
	sessionId := fc.Cookies("sessionId")
	err := ah.authService.SignOut(fc.Context(), sessionId)
	if err != nil {
		ah.logger.Error("failed to signout a user", slog.Any("err", err))
		return err
	}
	ah.sm.ClearSessionFromCookie(fc)
	return nil
}

func (ah AuthHandler) CheckSession(fc *fiber.Ctx) error {
	sessionId := fc.Cookies("sessionId")

	ctx, err := ah.sm.Load(fc.Context(), sessionId)
	if err != nil {
		return err
	}

	user := ah.sm.Get(ctx, "user").(entity.User)

	fc.JSON(user)
	return nil
}
