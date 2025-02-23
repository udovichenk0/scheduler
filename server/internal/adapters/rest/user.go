package rest

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	"github.com/udovichenk0/scheduler/pkg/errs"
)

type UserHandler struct {
	userService userservice.Port
	v           *validator.Validate
}

func NewUserHandler(userService userservice.Port, v *validator.Validate) *UserHandler {
	return &UserHandler{
		userService: userService,
		v:           v,
	}
}

func (u UserHandler) GetUser(fc *fiber.Ctx) error {
	params := new(dto.GetUserRequestDto)

	if err := fc.QueryParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := u.v.Struct(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	user, err := u.userService.GetUserByEmail(fc.Context(), params.Email)

	if err != nil {
		return errs.CheckSqlError(err, "User")
	}

	fc.JSON(dto.UserDto{
		Id:       user.Id,
		Email:    user.Email,
		Verified: user.Verified,
	})
	return nil
}

func (u UserHandler) VerifiedUserExists(fc *fiber.Ctx) error {
	params := new(dto.GetUserRequestDto)
	if err := fc.QueryParser(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	if err := u.v.Struct(params); err != nil {
		return errs.NewBadRequestError(err)
	}

	isExist, err := u.userService.IsVerifiedUserExist(fc.Context(), params.Email)
	if err != nil {
		return err
	}

	res := dto.EmailExistsResponseDto{Exists: isExist}
	fc.JSON(res)

	return nil
}
