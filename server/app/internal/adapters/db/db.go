package db

import (
	"context"
	"log/slog"

	"github.com/jmoiron/sqlx"
	"github.com/udovichenk0/scheduler/config"
	invitationrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/invitation"
	projectrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/project"
	projectmembershiprepoport "github.com/udovichenk0/scheduler/internal/ports/repository/projectMembership"
	taskrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/task"
	userrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/user"
	verificationrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/verification"
	"github.com/udovichenk0/scheduler/pkg/logger"
	"github.com/zhulik/pal"
)

type Sqlx struct {
	Config *config.Config
	Pool   *sqlx.DB
	Log    logger.ILogger
}

func (s *Sqlx) Init(_ context.Context) error {
	db, err := sqlx.Connect("mysql", s.Config.Db.URL)
	if err != nil {
		s.Log.Error("Failed to connect to database", slog.Any("err", err))
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
		pal.Provide[projectrepoport.Repository](&ProjectRepo{}),
		pal.Provide[taskrepoport.Repository](&TaskRepo{}),
		pal.Provide[userrepoport.Repository](&UserRepo{}),
		pal.Provide[verificationrepoport.Repository](&VerificationRepo{}),
		pal.Provide[invitationrepoport.Repository](&InvitationRepo{}),
		pal.Provide[projectmembershiprepoport.Repository](&ProjectMembershipRepo{}),
	)
}
