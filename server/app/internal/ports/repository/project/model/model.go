package model

type Project struct {
	Id        string `db:"id"`
	Name      string `db:"name"`
	CreatedBy string `db:"created_by"`
}

var Nil = Project{}
