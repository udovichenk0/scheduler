package invitationservice

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/adapters/sse"
	invitationserviceport "github.com/udovichenk0/scheduler/internal/ports/api/invitation"
	projectserviceport "github.com/udovichenk0/scheduler/internal/ports/api/project"
	userserviceport "github.com/udovichenk0/scheduler/internal/ports/api/user"
	invitationrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/invitation"
	projectrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/project"
	projectmembershiprepoport "github.com/udovichenk0/scheduler/internal/ports/repository/projectMembership"
	"github.com/udovichenk0/scheduler/pkg/logger"

	"github.com/zhulik/pal"
)

type Service struct {
	User              userserviceport.Api
	Invitation        invitationrepoport.Repository
	Project           projectserviceport.Api
	ProjectRepo       projectrepoport.Repository
	Logger            logger.ILogger
	ProjectMembership projectmembershiprepoport.Repository
	NotificationSse   *sse.Invitation
}

func (s *Service) GetInvitations(ctx context.Context, userId string) ([]invitationserviceport.Invitation, error) {
	// invitations, err := s.Invitation(ctx, userId)
	// if err != nil {
	// 	return nil, errs.NewError(err, "Failed to get invitations")
	// }
	// return toDtos(invitations), nil
	return nil, nil
}

type InvitationEventData struct {
	Id           string `json:"id"`
	InviterEmail string `json:"inviterEmail"`
	ProjectName  string `json:"projectName"`
}

func (s *Service) Invite(ctx context.Context, input invitationserviceport.InviteInput) error {
	return nil
	// if input.InviteeEmail == input.InviterEmail {
	// 	return errs.NewBadRequestError(errors.New("You cannot invite yourself"))
	// }
	// project, err := s.Project.GetProjectById(ctx, input.ProjectId)
	// if err != nil {
	// 	return err
	// }
	// isMember, err := s.Project.IsMemberOfTheProject(ctx, input.ProjectId, input.InviterId)
	// if err != nil {
	// 	return err
	// }
	// if !isMember {
	// 	s.Logger.Error("Don't have permission to invite to the project",
	// 		slog.String("projectId", input.ProjectId),
	// 		slog.String("inviterEmail", input.InviterEmail),
	// 		slog.String("inviteeEmail", input.InviteeEmail),
	// 	)
	// 	return errs.NewForbiddenError(errors.New("Can't invite to the project"))
	// }

	// user, err := s.User.GetByEmail(ctx, input.InviteeEmail)
	// if err != nil {
	// 	return err
	// }

	// existingInvitation, err := s.Invitation.GetOneForInvitee(ctx, invitationrepoport.GetOneForInviteeInput{ProjectId: input.ProjectId, InviteeId: user.Id})

	// if err != nil && !errors.Is(err, sql.ErrNoRows) {
	// 	s.Logger.Error("Failed to check if user is already invited", slog.Any("err", err))
	// 	return errs.NewError(err, "Failed to check invitation status")
	// }

	// if err := domain.ToInvitation(existingInvitation).CanInvite(input.InviterId); err != nil {
	// 	return errs.NewError(err, "Can't invite to the project")
	// }

	// project, err := s.Project.GetProjectById(ctx, input.ProjectId)
	// if err != nil {
	// 	return errs.NewError(err, "Failed to get a project")
	// }
	// if project.CreatedBy != input.InviterId {
	// 	s.Logger.Error("Failed to invite to a project", slog.String("createdBy", project.CreatedBy), slog.String("invitedBy", input.InviterId))
	// 	return errs.NewForbiddenError(fmt.Errorf("Can't invite to a project"))
	// }

	// projectMembership, err := s.ProjectMembership.Get(ctx, projectmembershiprepoport.GetInput{ProjectId: input.ProjectId, UserId: user.Id})
	// if err != nil && !errors.Is(err, sql.ErrNoRows) {
	// 	s.Logger.Error("Failed to get a projectMembership", slog.Any("err", err))
	// 	return errs.NewError(err, "Cannot get a project membership")
	// }

	// if projectMembership.ProjectId != "" {
	// 	s.Logger.Error("This user is already part of the project", slog.Any("projectMembership", projectMembership))
	// 	return errs.NewForbiddenError(fmt.Errorf("This user is already part of the project"))
	// }
	// invitationId := pkg.NewUUID()
	// err = s.Invitation.Create(ctx, invitationrepoport.CreateInput{
	// 	Id:        invitationId,
	// 	InviterId: input.InviterId,
	// 	InviteeId: user.Id,
	// 	ProjectId: input.ProjectId,
	// })

	// if err != nil {
	// 	s.Logger.Error("Failed to invited to the project", slog.Any("err", err))
	// 	return errs.NewError(err, "Failed to invite to the project")
	// }

	// invitation, err := s.Invitation.GetOne(ctx, invitationId)
	// if err != nil {
	// 	s.Logger.Error("Failed to get a invitation", slog.Any("err", err))
	// 	return errs.NewError(err, "Failed to get a invitation")
	// }

	// return s.NotificationSse.Notify(user.Id, "invite", InvitationEventData{
	// 	Id:           invitation.Id,
	// 	InviterEmail: input.InviterEmail,
	// 	ProjectName:  project.Name,
	// })
}

// func toEntity(invitation model.Invitation) domain.Invitation {
// 	return domain.Invitation{
// 		Id:         invitation.Id,
// 		ProjectId:  invitation.ProjectId,
// 		InviterId:  invitation.InviterId,
// 		Status:     invitation.Status,
// 		InvitedAt:  invitation.InvitedAt,
// 		AcceptedAt: invitation.AcceptedAt.String,
// 		DeclinedAt: invitation.DeclinedAt.String,
// 	}
// }

// func toEntities(invitations []model.Invitation) []domain.Invitation {
// 	entityInvitations := []domain.Invitation{}
// 	for _, invitation := range invitations {
// 		entityInvitations = append(entityInvitations, toEntity(invitation))
// 	}
// 	return entityInvitations
// }

func Provide() pal.ServiceDef {
	return pal.Provide[invitationserviceport.Api](&Service{})
}
