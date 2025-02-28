package main

import (
	"database/sql"
	"embed"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/pressly/goose/v3"
	"github.com/udovichenk0/scheduler/config"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS //

func main() {
	c := config.New().Db
	source := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", c.User, c.Pass, c.Host, c.Port, c.Name)
	db, err := sql.Open("mysql", source)
	if err != nil {
		log.Fatal(err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	goose.SetDialect("mysql")
	goose.SetBaseFS(embedMigrations)

	if err := goose.Up(db, "migrations"); err != nil {
		log.Fatal(err)
	}
}
