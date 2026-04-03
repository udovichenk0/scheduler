package model

import (
	"database/sql"
	"time"
)

type Task struct {
	Id          string       `db:"id"`
	Title       string       `db:"title"`
	Description string       `db:"description"`
	Type        string       `db:"type"`
	Status      string       `db:"status"`
	StartDate   sql.NullTime `db:"start_date"`
	DueDate     sql.NullTime `db:"due_date"`
	UserId      string       `db:"user_id"`
	CreatedAt   time.Time    `db:"date_created"`
	IsTrashed   bool         `db:"is_trashed"`
	Priority    string       `db:"priority"`
	ProjectId   string       `db:"project_id"`
	ListId      string       `db:"list_id"`
	IsPrivate   bool         `db:"is_private"`
}

var Nil = Task{}
