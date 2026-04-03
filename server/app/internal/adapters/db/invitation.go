package db

import (
	"context"

	sq "github.com/huandu/go-sqlbuilder"
	"github.com/udovichenk0/scheduler/internal/domain"
	invitationrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/invitation"
	"github.com/udovichenk0/scheduler/internal/ports/repository/invitation/model"
	dbutils "github.com/udovichenk0/scheduler/pkg/db"
)

type InvitationRepo struct {
	*Sqlx
}

func (r *InvitationRepo) FindOne(ctx context.Context, invitationId string) (domain.Invitation, error) {
	invitation := model.Invitation{}
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	err := db.GetContext(ctx, &invitation, "SELECT id, project_id, inviter_id, invitee_id, status, invited_at, accepted_at, declined_at FROM invitation WHERE id = ?", invitationId)
	return toInvitation(invitation), err
}

func (r *InvitationRepo) FindOneForInvitee(ctx context.Context, input invitationrepoport.GetOneForInviteeInput) (domain.Invitation, error) {
	invitation := model.Invitation{}
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	err := db.GetContext(ctx, &invitation, "SELECT id, project_id, inviter_id, invitee_id, status, invited_at, accepted_at, declined_at FROM invitation WHERE project_id = ? AND invitee_id = ?", input.ProjectId, input.InviteeId)
	return toInvitation(invitation), err
}

func (r *InvitationRepo) FindMany(ctx context.Context, userId string) ([]domain.Invitation, error) {
	invitations := []model.Invitation{}
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	err := db.SelectContext(ctx, &invitations, "SELECT id, project_id, inviter_id, invitee_id, status, invited_at, accepted_at, declined_at FROM invitation WHERE user_id = ?", userId)
	return toInvitations(invitations), err
}

func (r *InvitationRepo) CreateOne(ctx context.Context, input domain.Invitation) error {
	ib := sq.NewInsertBuilder()
	ib.InsertInto("invitation").
		Cols("id", "project_id", "inviter_id", "invitee_id").
		Values(input.Id, input.ProjectId, input.InviterId, input.InviteeId)

	sql, args := ib.Build()
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, sql, args...)
	return err
}

func (r *InvitationRepo) Update() {}

func toInvitation(model model.Invitation) domain.Invitation {
	return domain.Invitation{
		Id:         model.Id,
		ProjectId:  model.ProjectId,
		InviterId:  model.InviterId,
		InviteeId:  model.InviteeId,
		Status:     model.Status,
		InvitedAt:  model.InvitedAt,
		AcceptedAt: dbutils.NullTimeToPtr(model.AcceptedAt),
		DeclinedAt: dbutils.NullTimeToPtr(model.DeclinedAt),
	}
}

func toInvitations(models []model.Invitation) (invitations []domain.Invitation) {
	for _, model := range models {
		invitations = append(invitations, toInvitation(model))
	}
	return invitations
}
