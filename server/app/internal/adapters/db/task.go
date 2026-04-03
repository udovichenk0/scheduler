package db

import (
	"context"

	sq "github.com/huandu/go-sqlbuilder"
	"github.com/udovichenk0/scheduler/internal/domain"
	taskrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/task"
	"github.com/udovichenk0/scheduler/internal/ports/repository/task/model"
	dbutils "github.com/udovichenk0/scheduler/pkg/db"
)

type TaskRepo struct {
	*Sqlx
}

func (r *TaskRepo) FindOneById(ctx context.Context, taskId string) (domain.Task, error) {
	task := model.Task{}

	db := dbutils.DefaultOrTx(ctx, r.Pool)
	err := db.GetContext(ctx, &task, "SELECT id, title, description, type, status, user_id, list_id, is_trashed, date_created, start_date, due_date, priority FROM task WHERE id = ?", taskId)
	return toTask(task), err
}

func (r *TaskRepo) FindOneByListId(ctx context.Context, params taskrepoport.GetByListIdInput) ([]domain.Task, error) {
	tasks := []model.Task{}
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	err := db.SelectContext(ctx, &tasks, "SELECT id, title, description, type, status, user_id, list_id, is_trashed, date_created, start_date, due_date, priority FROM task WHERE list_id = ? AND is_trashed = FALSE", params.ListId)
	return toTasks(tasks), err
}

func (r *TaskRepo) CreateOne(ctx context.Context, task domain.Task) error {
	ib := sq.NewInsertBuilder().InsertInto("task")
	ib.Cols(
		"id",
		"title",
		"description",
		"type",
		"status",
		"start_date",
		"due_date",
		"user_id",
		"priority",
		"list_id",
	)
	ib.Values(
		task.Id,
		task.Title,
		task.Description,
		task.Type,
		task.Status,
		task.StartDate,
		task.DueDate,
		task.UserId,
		task.Priority,
		newNullString(task.ListId),
	)
	sql, args := ib.Build()

	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, sql, args...)
	return err
}

func (r *TaskRepo) DeleteOne(ctx context.Context, params taskrepoport.DeleteInput) error {
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, "DELETE FROM task WHERE id = ? AND user_id = ?", params.TaskId, params.UserId)
	return err
}

func (r *TaskRepo) DeleteMany(ctx context.Context, userId string) error {
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, "DELETE FROM task WHERE user_id = ? AND is_trashed = true", userId)
	return err
}

func (r *TaskRepo) UpdateOne(ctx context.Context, input domain.Task) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("description", input.Description),
		sql.Assign("title", input.Title),
		sql.Assign("type", input.Type),
		sql.Assign("status", input.Status),
		sql.Assign("start_date", input.StartDate),
		sql.Assign("due_date", input.DueDate),
		sql.Assign("priority", input.Priority),
		sql.Assign("list_id", newNullString(input.ListId)),
	)

	sql.Where(sql.EQ("id", input.Id))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, query, args...)

	return err
}

func (r *TaskRepo) UpdateDate(ctx context.Context, input taskrepoport.UpdateDateInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("start_date", input.StartDate),
		sql.Assign("due_date", input.DueDate),
		sql.Assign("type", input.Type),
	)

	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, query, args...)
	return err
}

func (r *TaskRepo) UpdateStatus(ctx context.Context, input taskrepoport.UpdateStatusInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("status", input.Status),
	)
	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, query, args...)
	return err
}

func (r *TaskRepo) UpdatePriority(ctx context.Context, input taskrepoport.UpdatePriorityInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("priority", input.Priority),
	)
	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, query, args...)
	return err
}

func (r *TaskRepo) TrashOne(ctx context.Context, input taskrepoport.UpdateTrashInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("is_trashed", true),
	)
	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, query, args...)
	return err
}

func toTask(model model.Task) domain.Task {
	return domain.Task{
		Id:          model.Id,
		Title:       model.Title,
		Description: model.Description,
		Type:        domain.TaskType(model.Type),
		Status:      domain.TaskStatus(model.Status),
		StartDate:   dbutils.NullTimeToPtr(model.StartDate),
		DueDate:     dbutils.NullTimeToPtr(model.DueDate),
		UserId:      model.UserId,
		ListId:      model.ListId,
		CreatedAt:   model.CreatedAt,
		IsTrashed:   model.IsTrashed,
		Priority:    domain.TaskPriority(model.Priority),
	}
}

func toTasks(models []model.Task) (tasks []domain.Task) {
	for _, task := range models {
		tasks = append(tasks, toTask(task))
	}
	return tasks
}
