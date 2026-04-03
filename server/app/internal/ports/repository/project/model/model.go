package model

import "time"

type ProjectList struct {
	Id        string    `db:"id"`
	Name      string    `db:"name"`
	ProjectId string    `db:"project_id"`
	CreatedAt time.Time `db:"created_at"`
	CreatedBy string    `db:"created_by"`
	IsPrivate bool      `db:"is_private"`
}

type Project struct {
	Id        string `db:"id"`
	Name      string `db:"name"`
	CreatedBy string `db:"created_by"`
	IsPrivate string `db:"is_private"`
	Lists     []ProjectList
}

type ProjectMembership struct {
	ProjectId string `db:"project_id"`
	UserId    string `db:"user_id"`
}

// type GetManyProjectList struct {
// 	Id        string `db:"id"`
// 	Name      string `db:"name"`
// 	ProjectId string `db:"project_id"`
// }

var Nil = Project{}
