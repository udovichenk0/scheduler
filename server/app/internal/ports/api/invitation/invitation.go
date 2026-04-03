package invitationserviceport

import (
	"context"
	"time"
)

type InviteInput struct {
	ProjectId    string
	InviteeEmail string
	InviterId    string
	InviterEmail string
}

type Api interface {
	Invite(ctx context.Context, input InviteInput) error
	GetInvitations(ctx context.Context, userId string) ([]Invitation, error)
	// Accept(ctx context.Context)
	// Decline(ctx context.Context)
}

type Invitation struct {
	Id         string     `json:"id"`
	ProjectId  string     `json:"project_id"`
	InviterId  string     `json:"inviter_id"`
	Status     uint8      `json:"status"`
	InvitedAt  string     `json:"created_at"`
	AcceptedAt *time.Time `json:"accepted_at"`
	DeclinedAt *time.Time `json:"declined_at"`
}
