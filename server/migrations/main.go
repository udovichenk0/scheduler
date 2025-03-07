package main

import (
	"database/sql"
	"embed"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/pressly/goose/v3"
	"github.com/udovichenk0/scheduler/config"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

func main() {
	source := config.GetEnv("DATABASE_URL")
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
		log.Println(err.Error())
	}
}
