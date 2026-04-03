package rest

import (
	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/rest/dto"
	authserviceport "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	invitationserviceport "github.com/udovichenk0/scheduler/internal/ports/api/invitation"
	userserviceport "github.com/udovichenk0/scheduler/internal/ports/api/user"
	sseinvitation "github.com/udovichenk0/scheduler/internal/ports/sse/invitation"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	validator "github.com/udovichenk0/scheduler/pkg/validation"
)

type InvitationHandler struct {
	Invitation invitationserviceport.Api
	User       userserviceport.Api
	*validator.Validator
	Sm     sessionManager.ISessionManager
	Logger logger.ILogger
	Sse    sseinvitation.IInvitation
}

func (h *InvitationHandler) Invite(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
	body := new(dto.InviteToProjectRequestBody)
	if err := fc.BodyParser(body); err != nil {
		return errs.NewBadRequestError(err)
	}

	inviteInput := invitationserviceport.InviteInput{
		InviterId:    user.Id,
		InviteeEmail: body.Email,
		ProjectId:    body.ProjectId,
		InviterEmail: user.Email,
	}

	return h.Invitation.Invite(fc.Context(), inviteInput)
}

func (h *InvitationHandler) GetInvitations(fc *fiber.Ctx) error {
	user := h.Sm.Get(fc.UserContext(), "user").(authserviceport.AuthUser)
	invitations, err := h.Invitation.GetInvitations(fc.Context(), user.Id)
	if err != nil {
		return err
	}
	fc.JSON(invitations)
	return nil
}
