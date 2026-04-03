package rest

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	authserviceport "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	listservice "github.com/udovichenk0/scheduler/internal/ports/api/list"
	projectserviceport "github.com/udovichenk0/scheduler/internal/ports/api/project"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	sessionmanager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	validator "github.com/udovichenk0/scheduler/pkg/validation"
	"github.com/zhulik/pal"
)

type ListHandler struct {
	List       listservice.Api
	ProjectApi projectserviceport.Api
	Sm         sessionmanager.ISessionManager
	*validator.Validator
	Logger logger.ILogger
}

// func (h *ListHandler) Get(fc *fiber.Ctx) error {
// 	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
// 	query := new(dto.GetListsRequestQuery)
// 	if err := fc.QueryParser(query); err != nil {
// 		return errs.NewBadRequestError(err)
// 	}

// 	lists, err := h.List.GetLists(fc.Context(), listservice.GetListsInput{
// 		UserId:    user.Id,
// 		ProjectId: query.ProjectId,
// 	})
// 	if err != nil {
// 		h.Logger.Error("failed to get lists", slog.Any("err", err))
// 		return err
// 	}
// 	return fc.JSON(lists)
// }

// func (h *ListHandler) GetListById(fc *fiber.Ctx) error {
// 	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
// 	var query dto.GetListByIdQuery
// 	if err := fc.QueryParser(&query); err != nil {
// 		return errs.NewBadRequestError(err)
// 	}

// 	list, err := h.List.GetListById(fc.Context(), listservice.GetListByIdInput{
// 		UserId: user.Id,
// 		ListId: query.ListId,
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return fc.JSON(list)
// }

// func (h *ListHandler) GetPrivateList(fc *fiber.Ctx) error {
// 	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
// 	list, err := h.List.GetPrivateList(fc.Context(), listservice.GetPrivateListInput{UserId: user.Id})
// 	if err != nil {
// 		return err
// 	}

// 	return fc.JSON(list)
// }

func (h *ListHandler) Create(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
	query := new(dto.CreateListRequestQuery)
	if err := fc.QueryParser(query); err != nil {
		return errs.NewBadRequestError(err)
	}

	body := new(dto.CreateListRequestBody)
	if err := fc.BodyParser(body); err != nil {
		return errs.NewBadRequestError(err)
	}
	if err := h.Vali.Struct(body); err != nil {
		return errs.NewBadRequestError(err)
	}

	list, err := h.ProjectApi.CreateList(fc.Context(), projectserviceport.CreateListInput{
		Name:      body.Name,
		UserId:    user.Id,
		ProjectId: query.ProjectId,
	})

	if err != nil {
		h.Logger.Error("failed to create list", slog.Any("err", err))
		return err
	}

	return fc.JSON(list)
}

func ProvideList() pal.ServiceDef {
	return pal.Provide(&ListHandler{})
}
