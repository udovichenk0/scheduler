package authservice

import (
	"context"
	"database/sql"
	"encoding/gob"
	"errors"
	"log/slog"
	"time"

	"github.com/udovichenk0/scheduler/internal/adapters/db"
	authserviceport "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	smtpserviceport "github.com/udovichenk0/scheduler/internal/ports/api/smtp"
	userserviceport "github.com/udovichenk0/scheduler/internal/ports/api/user"
	verificationserviceport "github.com/udovichenk0/scheduler/internal/ports/api/verification"
	userrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/user"
	dbutils "github.com/udovichenk0/scheduler/pkg/db"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	"github.com/zhulik/pal"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	UserService         userserviceport.Api
	UserRepo            userrepoport.Repository
	SmtpService         smtpserviceport.Api
	VerificationService verificationserviceport.Api
	Sm                  sessionManager.ISessionManager
	Logger              logger.ILogger
	*db.Sqlx
}

func (*Service) Init(_ context.Context) error {
	gob.Register(authserviceport.AuthUser{})
	return nil
}

func (s *Service) SignIn(ctx context.Context, email, pass string) (authserviceport.AuthResult, error) {
	user, err := s.UserRepo.FindOneByEmail(ctx, email)
	if err := user.CanLogin(); err != nil {
		return authserviceport.AuthResult{}, err
	}

	if err := user.VerifyPassword(pass); err != nil {
		return authserviceport.AuthResult{}, err
	}
	authuser := authserviceport.AuthUser{
		Id:        user.Id,
		Email:     user.Email,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	}
	session, err := s.Sm.Commit(ctx, "user", authuser)
	if err != nil {
		s.Logger.Error("session creation failed", "user_id", user.Id, "err", err)
		return authserviceport.AuthResult{}, errs.NewInternalError(err)
	}

	return authserviceport.AuthResult{User: authuser, Session: session}, nil
}

func (s *Service) SignUp(ctx context.Context, email, password string) (authserviceport.AuthUser, error) {
	if email == "" || password == "" {
		return authserviceport.AuthUser{}, ErrInvalidInput
	}

	user, err := s.UserService.GetByEmail(ctx, email)
	if err == nil && user.Id == "" {
		return authserviceport.AuthUser{}, ErrEmailAlreadyTaken
	}
	if err != nil && !errors.Is(err, errs.NoRowError{}) {
		return authserviceport.AuthUser{}, errs.NewInternalError(err)
	}

	var code string
	var output authserviceport.AuthUser
	dbutils.WithTransaction(ctx, s.Pool, func(ctx context.Context) error {
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return errs.NewInternalError(err)
		}
		user, err := s.UserService.Create(ctx, userserviceport.CreateInput{
			Email:        email,
			HashPassword: string(hash),
		})
		if err != nil {
			return err
		}
		output = authserviceport.AuthUser(user)
		code, err = s.VerificationService.CreateCode(ctx, user.Id)
		if err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return authserviceport.AuthUser{}, err
	}

	go func() {
		_, cancel := context.WithTimeout(context.Background(), time.Second*15)
		defer cancel()
		err = s.SmtpService.SendEmail(smtpserviceport.SendInput{
			To:      email,
			Subject: "Your Verification Code is Ready!",
			Body:    code,
		})

		if err != nil {
			s.Logger.Error("failed to send verification email", slog.Any("err", err), slog.String("email", email))
		}
	}()

	return output, nil
}

func (s *Service) SignOut(ctx context.Context, sessionId string) error {
	err := s.Sm.Delete(ctx, sessionId)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errs.NewForbiddenError(errors.New("user is not logged in"))
		}
		return err
	}
	return nil
}

func Provide() pal.ServiceDef {
	return pal.Provide[authserviceport.Api](&Service{})
}
