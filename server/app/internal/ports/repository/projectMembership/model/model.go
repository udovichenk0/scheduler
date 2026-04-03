package model

type ProjectMembership struct {
	ProjectId string `db:"project_id"`
	UserId    string `db:"user_id"`
}
