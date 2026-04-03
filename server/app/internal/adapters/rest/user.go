package rest

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	validator "github.com/udovichenk0/scheduler/pkg/validation"
	"github.com/zhulik/pal"
)

type UserHandler struct {
	UserService userservice.Api
	*validator.Validator
	Logger logger.ILogger
}

func (h *UserHandler) GetUser(fc *fiber.Ctx) error {
	params := new(dto.GetUserRequestDto)

	if err := fc.QueryParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := h.Vali.Struct(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	user, err := h.UserService.GetByEmail(fc.Context(), params.Email)

	if err != nil {
		h.Logger.Error("failed to get user by email", slog.Any("err", err))
		return err
	}

	fc.JSON(dto.UserDto{
		Id:       user.Id,
		Email:    user.Email,
		Verified: user.Verified,
	})
	return nil
}

func (h *UserHandler) VerifiedUserExists(fc *fiber.Ctx) error {
	params := new(dto.GetUserRequestDto)
	if err := fc.QueryParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := h.Vali.Struct(params); err != nil {
		return errs.NewBadRequestError(err)
	}
	isExist, err := h.UserService.ExistsVerified(fc.Context(), params.Email)
	if err != nil {
		h.Logger.Error("failed to verify user", slog.Any("err", err))
		return err
	}

	res := dto.EmailExistsResponseDto{Exists: isExist}
	fc.JSON(res)

	return nil
}

func ProvideUser() pal.ServiceDef {
	return pal.Provide(&UserHandler{})
}
