package db

import (
	"context"

	sq "github.com/huandu/go-sqlbuilder"
	projectmembershiprepoport "github.com/udovichenk0/scheduler/internal/ports/repository/projectMembership"
	"github.com/udovichenk0/scheduler/internal/ports/repository/projectMembership/model"
	dbutils "github.com/udovichenk0/scheduler/pkg/db"
)

type ProjectMembershipRepo struct {
	*Sqlx
}

func (r *ProjectMembershipRepo) Get(ctx context.Context, input projectmembershiprepoport.GetInput) (model.ProjectMembership, error) {
	var projectMembership model.ProjectMembership
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	err := db.GetContext(ctx, &projectMembership, "SELECT project_id, user_id FROM project_membership WHERE user_id = ? AND project_id = ?", input.UserId, input.ProjectId)
	return projectMembership, err
}

func (r *ProjectMembershipRepo) CreateOne(ctx context.Context, input projectmembershiprepoport.CreateOneInput) error {
	ib := sq.NewInsertBuilder().
		InsertInto("project_membership").
		Cols("project_id", "user_id").
		Values(input.ProjectId, input.UserId)
	sql, args := ib.Build()

	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, sql, args...)
	return err
}
