package db

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
)

type Adapter struct {
	Pool *sqlx.DB
}
type Opts struct {
	User string
	Pass string
	Name string
	Host string
	Port string
}

func New(opts Opts) Adapter {
	connOption := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", opts.User, opts.Pass, opts.Host, opts.Port, opts.Name)
	db, err := sqlx.Open("mysql", connOption)
	if err != nil {
		log.Fatalf("Error: %s", err.Error())
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("failed to ping db: %s", err.Error())
	}
	return Adapter{Pool: db}
}
