package db

import (
	"context"
	"fmt"

	sq "github.com/huandu/go-sqlbuilder"
	"github.com/udovichenk0/scheduler/internal/ports/repository/task"
	"github.com/udovichenk0/scheduler/internal/ports/repository/task/model"
	"github.com/udovichenk0/scheduler/pkg"
)

type TaskRepo struct {
	*Sqlx
}

func (r *TaskRepo) GetByUserId(ctx context.Context, userId string) ([]model.Task, error) {
	tasks := []model.Task{}
	err := r.Pool.SelectContext(ctx, &tasks, "SELECT id, title, description, type, status, user_id, project_id, is_trashed, date_created, UNIX_TIMESTAMP(start_date) AS start_date, UNIX_TIMESTAMP(due_date) AS due_date, priority FROM task WHERE user_id = ? AND project_id IS NULL", userId)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (r *TaskRepo) GetByTaskId(ctx context.Context, taskId string) (model.Task, error) {
	task := model.Nil

	err := r.Pool.GetContext(ctx, &task, "SELECT id, title, description, type, status, user_id, project_id, is_trashed, date_created, UNIX_TIMESTAMP(start_date) AS start_date, UNIX_TIMESTAMP(due_date) AS due_date, priority FROM task WHERE id = ?", taskId)

	if err != nil {
		return model.Nil, err
	}

	return task, nil
}

func (r *TaskRepo) GetByProjectId(ctx context.Context, params task.GetByProjectIdInput) ([]model.Task, error) {
	tasks := []model.Task{}
	err := r.Pool.SelectContext(ctx, &tasks, "SELECT id, title, description, type, status, user_id, project_id, is_trashed, date_created, UNIX_TIMESTAMP(start_date) AS start_date, UNIX_TIMESTAMP(due_date) AS due_date, priority FROM task WHERE project_id = ? AND is_trashed = FALSE", params.ProjectId)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (r *TaskRepo) Create(ctx context.Context, task task.CreateInput) error {
	ib := sq.NewInsertBuilder().InsertInto("task")
	ib.Cols("id", "title", "description", "type", "status", "start_date", "due_date", "user_id", "priority", "project_id")
	ib.Values(
		task.TaskId,
		task.Title,
		task.Description,
		task.Type,
		task.Status,
		pkg.NewNullString(task.StartDate),
		pkg.NewNullString(task.DueDate),
		task.UserId,
		task.Priority,
		pkg.NewNullString(task.ProjectId),
	)
	sql, args := ib.Build()

	_, err := r.Pool.ExecContext(ctx, sql, args...)
	return err
}

func (r *TaskRepo) DeleteTrashedTask(ctx context.Context, params task.DeleteInput) error {
	_, err := r.Pool.ExecContext(ctx, "DELETE FROM task WHERE id = ? AND user_id = ?", params.TaskId, params.UserId)
	return err
}

func (r *TaskRepo) DeleteTrashedTasks(ctx context.Context, userId string) error {
	_, err := r.Pool.ExecContext(ctx, "DELETE FROM task WHERE user_id = ? AND is_trashed = true", userId)
	return err
}

func (r *TaskRepo) CreateMany(ctx context.Context, tasks []task.CreateInput, userId string) error {
	query := "INSERT INTO task (id, title, description, type, status, start_date, user_id) VALUES "
	data := []interface{}{}

	for _, task := range tasks {
		query += "(?, ?, ?, ?, ?, FROM_UNIXTIME(?), ?),"

		data = append(data, task.TaskId, task.Title, task.Description, task.Type, task.Status, pkg.NewNullString(task.StartDate), userId)
	}

	r.Pool.ExecContext(ctx, query[:len(query)-1], data...)

	return nil
}

func (r *TaskRepo) Update(ctx context.Context, input task.UpdateInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("description", input.Description),
		sql.Assign("title", input.Title),
		sql.Assign("type", input.Type),
		sql.Assign("status", input.Status),
		sql.Assign("start_date", pkg.NewNullString(input.StartDate)),
		sql.Assign("due_date", pkg.NewNullString(input.DueDate)),
		sql.Assign("priority", input.Priority),
	)

	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	fmt.Println(query, args)
	_, err := r.Pool.ExecContext(ctx, query, args...)

	return err
}

func (r *TaskRepo) UpdateDate(ctx context.Context, input task.UpdateDateInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("start_date", pkg.NewNullString(input.StartDate)),
		sql.Assign("due_date", pkg.NewNullString(input.DueDate)),
		sql.Assign("type", input.Type),
	)

	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	_, err := r.Pool.ExecContext(ctx, query, args...)
	return err
}

func (r *TaskRepo) UpdateStatus(ctx context.Context, input task.UpdateStatusInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("status", input.Status),
	)
	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	_, err := r.Pool.ExecContext(ctx, query, args...)
	return err
}

func (r *TaskRepo) UpdatePriority(ctx context.Context, input task.UpdatePriorityInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("priority", input.Priority),
	)
	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	_, err := r.Pool.ExecContext(ctx, query, args...)
	return err
}

func (r *TaskRepo) TrashTask(ctx context.Context, input task.UpdateTrashInput) error {
	sql := sq.NewUpdateBuilder().Update("task")

	sql.Set(
		sql.Assign("is_trashed", true),
	)
	sql.Where(sql.EQ("id", input.TaskId))
	sql.Where(sql.EQ("user_id", input.UserId))

	query, args := sql.Build()
	_, err := r.Pool.ExecContext(ctx, query, args...)
	return err
}
