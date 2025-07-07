package db

import (
	"context"

	sq "github.com/huandu/go-sqlbuilder"
	"github.com/jmoiron/sqlx"
	"github.com/udovichenk0/scheduler/internal/ports/repository/project"
	"github.com/udovichenk0/scheduler/internal/ports/repository/project/model"
)

type ProjectRepository struct {
	db *sqlx.DB
}

func NewProjectRepo(db *sqlx.DB) *ProjectRepository {
	return &ProjectRepository{db}
}

func (pr *ProjectRepository) GetByUserId(ctx context.Context, userId string) ([]model.Project, error) {
	var projects []model.Project
	err := pr.db.SelectContext(ctx, &projects, "SELECT id, name, created_by FROM project WHERE created_by = ?", userId)
	if err != nil {
		return nil, err
	}
	return projects, nil
}

func (pr *ProjectRepository) GetById(ctx context.Context, projectId string) (model.Project, error) {
	var project model.Project
	err := pr.db.GetContext(ctx, &project, "SELECT id, name, created_by FROM project WHERE id = ?", projectId)
	if err != nil {
		return model.Nil, err
	}
	return project, nil
}

func (pr *ProjectRepository) Create(ctx context.Context, data project.CreateInput) error {
	ib := sq.NewInsertBuilder().InsertInto("project")
	ib.Cols("id", "name", "created_by")
	ib.Values(
		data.ProjectId,
		data.Name,
		data.UserId,
	)
	sql, args := ib.Build()
	_, err := pr.db.ExecContext(ctx, sql, args...)
	return err
}
