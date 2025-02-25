package db

import (
	"context"

	sq "github.com/huandu/go-sqlbuilder"
	"github.com/jmoiron/sqlx"
	"github.com/udovichenk0/scheduler/internal/ports/repository/task"
	"github.com/udovichenk0/scheduler/internal/ports/repository/task/model"
	"github.com/udovichenk0/scheduler/pkg"
)

type TaskRepository struct {
	db *sqlx.DB
}

func NewTaskRepo(db *sqlx.DB) *TaskRepository {
	return &TaskRepository{db}
}

func (tr *TaskRepository) GetByUserId(ctx context.Context, userId string) ([]model.Task, error) {
	tasks := []model.Task{}
	err := tr.db.SelectContext(ctx, &tasks, "SELECT id, title, description, type, status, user_id, is_trashed, date_created, UNIX_TIMESTAMP(start_date) AS start_date FROM task WHERE user_id = ?", userId)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (tr *TaskRepository) GetByTaskId(ctx context.Context, taskId string) (model.Task, error) {
	task := model.Nil

	err := tr.db.GetContext(ctx, &task, "SELECT id, title, description, type, status, user_id, is_trashed, date_created, UNIX_TIMESTAMP(start_date) AS start_date FROM task WHERE id = ?", taskId)

	if err != nil {
		return model.Nil, err
	}

	return task, nil
}

func (tr *TaskRepository) Create(ctx context.Context, task task.CreateInput) error {
	_, err := tr.db.ExecContext(
		ctx,
		"INSERT INTO task (id, title, description, type, status, start_date, user_id) VALUES (?,?,?,?,?,FROM_UNIXTIME(?),?)",
		task.TaskId,
		task.Title,
		task.Description,
		task.Type,
		task.Status,
		pkg.NewNullInt(task.StartDate),
		task.UserId,
	)
	return err
}

func (tr *TaskRepository) DeleteTrashedTask(ctx context.Context, params task.DeleteInput) error {
	_, err := tr.db.ExecContext(ctx, "DELETE FROM task WHERE id = ? AND user_id = ?", params.TaskId, params.UserId)
	return err
}

func (tr *TaskRepository) DeleteTrashedTasks(ctx context.Context, userId string) error {
	_, err := tr.db.ExecContext(ctx, "DELETE FROM task WHERE user_id = ? AND is_trashed = true", userId)
	return err
}

func (tr *TaskRepository) CreateMany(ctx context.Context, tasks []task.CreateInput, userId string) error {
	query := "INSERT INTO task (id, title, description, type, status, start_date, user_id) VALUES "
	data := []interface{}{}

	for _, task := range tasks {
		query += "(?, ?, ?, ?, ?, FROM_UNIXTIME(?), ?),"

		data = append(data, task.TaskId, task.Title, task.Description, task.Type, task.Status, pkg.NewNullInt(task.StartDate), userId)
	}

	tr.db.ExecContext(ctx, query[:len(query)-1], data...)

	return nil
}

func (tr *TaskRepository) Update(ctx context.Context, input task.UpdateInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	if input.Title != "" {
		sql.Set(sql.Assign("title", input.Title))
	}

	if input.Description != "" {
		sql.Set(sql.Assign("description", input.Description))
	}

	if input.Type != "" {
		sql.Set(sql.Assign("type", input.Type))
	}

	if input.Status != "" {
		sql.Set(sql.Assign("status", input.Status))
	}

	if input.StartDate != 0 {
		sql.Set(sql.Assign("FROM_UNIXTIME(start_date)", input.StartDate))
	}

	if input.IsTrashed {
		sql.Set(sql.Assign("is_trashed", input.IsTrashed))
	}

	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()

	_, err := tr.db.ExecContext(ctx, query, args...)

	return err
}
