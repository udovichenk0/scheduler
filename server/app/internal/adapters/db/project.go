package db

import (
	"context"

	sq "github.com/huandu/go-sqlbuilder"
	"github.com/udovichenk0/scheduler/internal/domain"
	"github.com/udovichenk0/scheduler/internal/ports/repository/project/model"
	dbutils "github.com/udovichenk0/scheduler/pkg/db"
)

type ProjectRepo struct {
	*Sqlx
}

func (r *ProjectRepo) FindManyFull(ctx context.Context, userId string) ([]domain.Project, error) {
	var projects []model.Project
	db := dbutils.DefaultOrTx(ctx, r.Pool)

	err := db.SelectContext(ctx, &projects, `
		SELECT id, name, created_by
		FROM project
		WHERE created_by = ? AND is_private = ?
	`, userId, false)
	if err != nil {
		return nil, err
	}
	if len(projects) == 0 {
		return nil, nil
	}
	projectsIds := make([]string, len(projects))
	for i, p := range projects {
		projectsIds[i] = p.Id
	}
	sb := sq.NewSelectBuilder().Select("id", "name", "project_id", "created_at", "created_by", "is_private").From("list")
	sb.Where(sb.In("project_id", sq.Flatten(projectsIds)...))
	sql, args := sb.Build()

	var lists []model.ProjectList
	err = db.SelectContext(ctx, &lists, sql, args...)
	if err != nil {
		return nil, err
	}
	lookup := make(map[string]domain.Project, len(projects))
	for _, p := range projects {
		lookup[p.Id] = projectToDomain(p)
	}

	for _, lst := range lists {
		if proj, ok := lookup[lst.ProjectId]; ok {
			proj.Lists = append(proj.Lists, listToDomain(lst))
			lookup[lst.ProjectId] = proj
		}
	}

	result := make([]domain.Project, 0, len(projects))
	for _, p := range projects {
		result = append(result, lookup[p.Id])
	}

	return result, nil
}

func (r *ProjectRepo) FindPrivateOneByUserId(ctx context.Context, userId string) (domain.Project, error) {
	db := dbutils.DefaultOrTx(ctx, r.Pool)

	sb := sq.NewSelectBuilder()
	sb.Select("id", "name", "created_by", "is_private").
		From("project").
		Where(
			sb.EQ("created_by", userId),
			sb.EQ("is_private", true),
		)

	query, args := sb.Build()
	var project model.Project
	err := db.GetContext(ctx, &project, query, args...)
	if err != nil {
		return domain.Project{}, err
	}

	sb = sq.NewSelectBuilder()
	sb.Select("id", "name", "created_by", "is_private", "project_id").
		From("list").
		Where(sb.EQ("created_by", userId))
	query, args = sb.Build()
	var lists []model.ProjectList
	err = db.SelectContext(ctx, &lists, query, args...)
	if err != nil {
		return domain.Project{}, err
	}
	domain := projectToDomain(project)
	domain.Lists = listsToDomain(lists)
	return domain, nil
}

func (r *ProjectRepo) FindByID(ctx context.Context, projectId string) (domain.Project, error) {
	db := dbutils.DefaultOrTx(ctx, r.Pool)

	sb := sq.NewSelectBuilder()
	sb.Select("id", "name", "created_by", "is_private").
		From("project").
		Where(sb.EQ("id", projectId))
	query, args := sb.Build()

	var project model.Project
	err := db.GetContext(ctx, &project, query, args...)
	if err != nil {
		return domain.Project{}, err
	}

	return projectToDomain(project), nil
}

func (r *ProjectRepo) CreateOne(ctx context.Context, data domain.Project) error {
	ib := sq.NewInsertBuilder().InsertInto("project")
	ib.Cols("id", "name", "created_by", "is_private")
	ib.Values(
		data.Id,
		data.Name,
		data.CreatedBy,
		data.Private,
	)
	sql, args := ib.Build()

	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, sql, args...)
	return err
}

func (r *ProjectRepo) CreateList(ctx context.Context, list domain.List) error {
	ib := sq.NewInsertBuilder().
		InsertInto("list").
		Cols("id", "name", "created_by", "project_id", "is_private").
		Values(
			list.Id,
			list.Name,
			list.CreatedBy,
			list.ProjectId,
			list.IsPrivate,
		)
	sql, args := ib.Build()

	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, sql, args...)
	return err
}

func (r *ProjectRepo) FindMembership(ctx context.Context, membership domain.ProjectMembership) (domain.ProjectMembership, error) {
	db := dbutils.DefaultOrTx(ctx, r.Pool)

	var projectMembership domain.ProjectMembership
	err := db.GetContext(ctx, &projectMembership, `
		SELECT project_id, user_id
		FROM project_membership
		WHERE user_id = ? AND project_id = ?`,
		membership.UserId, membership.ProjectId)

	return projectMembership, err
}

func (r *ProjectRepo) CreateMembership(ctx context.Context, membership domain.ProjectMembership) error {
	db := dbutils.DefaultOrTx(ctx, r.Pool)

	ib := sq.NewInsertBuilder()
	ib.InsertInto("project_membership").
		Cols("project_id", "user_id").
		Values(membership.ProjectId, membership.UserId)
	query, args := ib.Build()
	_, err := db.ExecContext(ctx, query, args...)
	return err
}

func projectToDomain(model model.Project) domain.Project {
	return domain.Project{
		Id:        model.Id,
		Name:      model.Name,
		CreatedBy: model.CreatedBy,
	}
}

func listToDomain(model model.ProjectList) domain.List {
	return domain.List{
		Id:        model.Id,
		Name:      model.Name,
		CreatedBy: model.CreatedBy,
		ProjectId: model.ProjectId,
		CreatedAt: model.CreatedAt,
		IsPrivate: model.IsPrivate,
	}
}

func listsToDomain(models []model.ProjectList) []domain.List {
	var lists []domain.List

	for _, list := range models {
		lists = append(lists, listToDomain(list))
	}
	return lists
}
