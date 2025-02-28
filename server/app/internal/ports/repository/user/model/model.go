package model

type User struct {
	Id        string `db:"id"`
	Email     string `db:"email"`
	Hash      string `db:"hash"`
	Verified  bool   `db:"verified"`
	CreatedAt string `db:"created_at"`
}

var Nil = User{}
