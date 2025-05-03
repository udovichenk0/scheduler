package model

import (
	"database/sql"
)

type Task struct {
	Id          string        `db:"id"`
	Title       string        `db:"title"`
	Description string        `db:"description"`
	Type        string        `db:"type"`
	Status      string        `db:"status"`
	StartDate   sql.NullInt64 `db:"start_date"`
	DueDate     sql.NullInt64 `db:"due_date"`
	UserId      string        `db:"user_id"`
	CreatedAt   string        `db:"date_created"`
	IsTrashed   bool          `db:"is_trashed"`
}

var Nil = Task{}
