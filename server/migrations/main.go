package main

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/pressly/goose/v3"
	"github.com/udovichenk0/scheduler/config"
	"github.com/udovichenk0/scheduler/migrations/schemas/seed"
)

//go:embed schemas
var embedMigrations embed.FS

func main() {
	conf := config.New()
	driverName := string(goose.DialectMySQL)
	db, err := sql.Open(driverName, conf.Db.URL)
	if err != nil {
		log.Fatal(err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	goose.SetDialect(driverName)
	goose.SetBaseFS(embedMigrations)
	if err := goose.Up(db, "schemas/migrations"); err != nil {
		log.Fatalln(err.Error())
	}
	if conf.Env != "PROD" {
		ctx := context.Background()
		log.Println("seeding database with initial users")
		start := time.Now()
		seed.Seed(ctx, db)
		end := time.Now()

		fmt.Println("duration: %l", end.Sub(start).Milliseconds())
	}
}

// var userCount int
// err := db.QueryRow("SELECT COUNT(*) FROM user WHERE email IN ('test-email@gmail.com', 'test-email2@gmail.com')").Scan(&userCount)
// if err != nil {
// 	log.Fatalf("failed to check existing users: %s", err)
// } else if userCount == 0 {
// 	log.Println("seeding database with initial users")
// 	fsys, err := fs.Sub(embedMigrations, "schemas/seed")
// 	if err != nil {
// 		log.Fatalln(err)
// 		return
// 	}
// 	provider, err := goose.NewProvider(goose.DialectMySQL, db, fsys, goose.WithDisableVersioning(true))
// 	if err != nil {
// 		log.Fatalf("failed to create provider: %s", err)
// 	}
// 	if _, err := provider.Up(context.Background()); err != nil {
// 		log.Fatalf("failed to run seed migrations: %s", err)
// 	}
// } else {
// 	log.Printf("seed users already exist (%d found), skipping seed", userCount)
// }
