package invitationrepoport

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/domain"
)

type GetOneForInviteeInput struct {
	ProjectId string
	InviteeId string
}

type Repository interface {
	FindOne(ctx context.Context, invitationId string) (domain.Invitation, error)
	FindOneForInvitee(ctx context.Context, input GetOneForInviteeInput) (domain.Invitation, error)
	FindMany(ctx context.Context, userId string) ([]domain.Invitation, error)
	CreateOne(ctx context.Context, input domain.Invitation) error
	// UpdateOne()
}
