package db

import (
	"context"
	"fmt"

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
	err := tr.db.SelectContext(ctx, &tasks, "SELECT id, title, description, type, status, user_id, is_trashed, date_created, UNIX_TIMESTAMP(start_date) AS start_date, UNIX_TIMESTAMP(due_date) AS due_date FROM task WHERE user_id = ?", userId)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (tr *TaskRepository) GetByTaskId(ctx context.Context, taskId string) (model.Task, error) {
	task := model.Nil

	err := tr.db.GetContext(ctx, &task, "SELECT id, title, description, type, status, user_id, is_trashed, date_created, UNIX_TIMESTAMP(start_date) AS start_date, UNIX_TIMESTAMP(start_date) AS start_date FROM task WHERE id = ?", taskId)

	if err != nil {
		return model.Nil, err
	}

	return task, nil
}

func (tr *TaskRepository) Create(ctx context.Context, task task.CreateInput) error {
	_, err := tr.db.ExecContext(
		ctx,
		"INSERT INTO task (id, title, description, type, status, start_date, due_date, user_id) VALUES (?,?,?,?,?,?,?,?)",
		task.TaskId,
		task.Title,
		task.Description,
		task.Type,
		task.Status,
		pkg.NewNullString(task.StartDate),
		pkg.NewNullString(task.DueDate),
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

		data = append(data, task.TaskId, task.Title, task.Description, task.Type, task.Status, pkg.NewNullString(task.StartDate), userId)
	}

	tr.db.ExecContext(ctx, query[:len(query)-1], data...)

	return nil
}

func (tr *TaskRepository) Update(ctx context.Context, input task.UpdateInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("description", input.Description),
		sql.Assign("title", input.Title),
		sql.Assign("type", input.Type),
		sql.Assign("status", input.Status),
		sql.Assign("start_date", pkg.NewNullString(input.StartDate)),
		sql.Assign("due_date", pkg.NewNullString(input.DueDate)),
	)

	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	fmt.Println(query, args)
	_, err := tr.db.ExecContext(ctx, query, args...)

	return err
}

func (tr *TaskRepository) UpdateDate(ctx context.Context, input task.UpdateDateInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("start_date", pkg.NewNullString(input.StartDate)),
		sql.Assign("due_date", pkg.NewNullString(input.DueDate)),
		sql.Assign("type", input.Type),
	)

	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	_, err := tr.db.ExecContext(ctx, query, args...)
	return err
}

func (tr *TaskRepository) UpdateStatus(ctx context.Context, input task.UpdateStatusInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("status", input.Status),
	)
	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	_, err := tr.db.ExecContext(ctx, query, args...)
	return err
}

func (tr *TaskRepository) TrashTask(ctx context.Context, input task.UpdateTrashInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("is_trashed", true),
	)
	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	_, err := tr.db.ExecContext(ctx, query, args...)
	return err
}
