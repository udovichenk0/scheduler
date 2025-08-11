package model

type Repository struct {
	Id        string `db:"id"`
	Email     string `db:"email"`
	Hash      string `db:"hash"`
	Verified  bool   `db:"verified"`
	CreatedAt string `db:"created_at"`
}

var Nil = Repository{}
