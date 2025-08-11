package db

import (
	"context"
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/udovichenk0/scheduler/config"
	"github.com/udovichenk0/scheduler/internal/ports/repository/project"
	"github.com/udovichenk0/scheduler/internal/ports/repository/task"
	"github.com/udovichenk0/scheduler/internal/ports/repository/user"
	"github.com/udovichenk0/scheduler/internal/ports/repository/verification"
	"github.com/zhulik/pal"
)

type Sqlx struct {
	Config *config.Config
	Pool   *sqlx.DB
}

func (s *Sqlx) Init(_ context.Context) error {
	db, err := sqlx.Open("mysql", s.Config.Db.URL)
	if err != nil {
		log.Fatalf("Error: %s", err.Error())
	}

	err = db.Ping()
	if err != nil {
		log.Printf("failed to ping db: %s", err.Error())
		return err
	}
	s.Pool = db

	return nil
}

func Provide() pal.ServiceDef {
	return pal.ProvideList(
		pal.Provide(&Sqlx{}).ToShutdown(func(ctx context.Context, s *Sqlx, pal *pal.Pal) error {
			return s.Pool.Close()
		}),
		pal.Provide[project.Repository](&ProjectRepo{}),
		pal.Provide[task.Repository](&TaskRepo{}),
		pal.Provide[user.Repository](&UserRepo{}),
		pal.Provide[verification.Repository](&VerificationRepo{}),
	)
}
