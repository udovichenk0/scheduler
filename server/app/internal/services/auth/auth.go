package auth

import (
	"context"
	"database/sql"
	"encoding/gob"
	"errors"

	"github.com/udovichenk0/scheduler/internal/adapters/db"
	"github.com/udovichenk0/scheduler/internal/entity"
	"github.com/udovichenk0/scheduler/internal/ports/api/auth"
	authservice "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	smtpservice "github.com/udovichenk0/scheduler/internal/ports/api/smtp"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	verificationservice "github.com/udovichenk0/scheduler/internal/ports/api/verification"
	"github.com/udovichenk0/scheduler/pkg"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	sessionManager "github.com/udovichenk0/scheduler/pkg/sessionmanager"
	"github.com/zhulik/pal"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	UserService         userservice.Api
	SmtpService         smtpservice.Api
	VerificationService verificationservice.Api
	*db.Sqlx
	Sm     sessionManager.ISessionManager
	Logger logger.ILogger
}

func (s *Service) Init(_ context.Context) error {
	gob.Register(entity.User{})
	return nil
}

func (s *Service) SignIn(ctx context.Context, email, pass string) (authservice.AuthResult, error) {
	user, err := s.UserService.GetUserByEmail(ctx, email)
	if err != nil {
		return authservice.AuthResult{}, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(pass))
	if err != nil {
		return authservice.AuthResult{}, errs.NewError(err, "wrong password")
	}

	session, err := s.Sm.Commit("user", user)
	if err != nil {
		return authservice.AuthResult{}, errs.NewInternalError(err)
	}

	return authservice.AuthResult{User: user, Session: session}, nil
}

func (s *Service) SignUp(ctx context.Context, email, pass string) (entity.User, error) {
	user, err := s.UserService.GetUserByEmail(ctx, email)
	if err != nil {
		if !errors.As(err, &errs.NoRowError{}) {
			return entity.User{}, errs.NewInternalError(err)
		}
	}

	if user.Id != "" {
		if err := s.UserService.DeleteUser(ctx, user.Id); err != nil {
			return entity.User{}, err
		}
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
	if err != nil {
		return entity.User{}, errs.NewInternalError(err)
	}

	params := userservice.CreateInput{
		UserId: pkg.NewUUID(),
		Email:  email,
		Hash:   string(hash),
	}

	uow := pkg.NewUnitOfWork(s.Pool, ctx)
	var code string
	err = uow.StartUOW(func(ctx context.Context) error {
		user, err = s.UserService.CreateUser(ctx, params)
		if err != nil {
			return err
		}
		code, err = s.VerificationService.CreateCode(ctx, user.Id)
		if err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return entity.User{}, err
	}

	err = s.SmtpService.SendEmail(smtpservice.SendInput{
		To:      user.Email,
		Subject: "Your Verification Code is Ready!",
		Body:    code,
	})
	if err != nil {
		return entity.User{}, err
	}

	return user, nil
}

func (s *Service) SignOut(ctx context.Context, sessionId string) error {
	err := s.Sm.Delete(sessionId)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errs.NewForbiddenError(errors.New("user is not logged in"))
		}
		return err
	}
	return nil
}

func Provide() pal.ServiceDef {
	return pal.Provide[auth.Api](&Service{})
}
