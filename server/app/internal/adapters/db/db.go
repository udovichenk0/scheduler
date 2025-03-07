package db

import (
	"log"

	"github.com/jmoiron/sqlx"
)

type Adapter struct {
	Pool *sqlx.DB
}
type Opts struct {
	URL string
}

func New(opts Opts) Adapter {
	db, err := sqlx.Open("mysql", opts.URL)
	if err != nil {
		log.Fatalf("Error: %s", err.Error())
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("failed to ping db: %s", err.Error())
	}
	return Adapter{Pool: db}
}
