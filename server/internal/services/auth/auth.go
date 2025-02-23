package auth

import (
	"context"
	"database/sql"
	"encoding/gob"
	"errors"

	"github.com/jmoiron/sqlx"
	"github.com/udovichenk0/scheduler/internal/entity"
	authservice "github.com/udovichenk0/scheduler/internal/ports/api/auth"
	smtpservice "github.com/udovichenk0/scheduler/internal/ports/api/smtp"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	verificationservice "github.com/udovichenk0/scheduler/internal/ports/api/verification"
	"github.com/udovichenk0/scheduler/pkg"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	session_manager "github.com/udovichenk0/scheduler/pkg/session-manager"
	"golang.org/x/crypto/bcrypt"
)

func New(userService userservice.Port, smtpService smtpservice.Port, verificationService verificationservice.Port, db *sqlx.DB, sm session_manager.SessionManager, logger logger.Logger) *Service {
	gob.Register(entity.User{})
	return &Service{
		userService:         userService,
		smtpService:         smtpService,
		verificationService: verificationService,
		db:                  db,
		sm:                  sm,
		logger:              logger,
	}
}

type Service struct {
	userService         userservice.Port
	smtpService         smtpservice.Port
	verificationService verificationservice.Port
	db                  *sqlx.DB
	sm                  session_manager.SessionManager
	logger              logger.Logger
}

func (a *Service) SignIn(ctx context.Context, email, pass string) (authservice.AuthResult, error) {
	user, err := a.userService.GetUserByEmail(ctx, email)
	if err != nil {
		return authservice.AuthResult{}, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(pass))
	if err != nil {
		return authservice.AuthResult{}, errs.NewBadRequestError(errors.New("wrong password"))
	}

	session, err := a.sm.Commit("user", user)

	if err != nil {
		return authservice.AuthResult{}, errs.NewInternalError(err)
	}

	return authservice.AuthResult{User: user, Session: session}, nil
}

func (a *Service) SignUp(ctx context.Context, email, pass string) (entity.User, error) {
	user, err := a.userService.GetUserByEmail(ctx, email)
	if err != nil {
		if !errors.As(err, &errs.NoRowError{}) {
			return entity.User{}, errs.CheckSqlError(err, "User")
		}
	}

	if user.Id != "" {
		if err := a.userService.DeleteUser(ctx, user.Id); err != nil {
			return entity.User{}, err
		}
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
	if err != nil {
		return entity.User{}, err
	}

	params := userservice.CreateInput{
		UserId: pkg.NewUUID(),
		Email:  email,
		Hash:   string(hash),
	}

	uow := pkg.NewUnitOfWork(a.db, ctx)

	tx, err := uow.Begin()

	if err != nil {
		return entity.User{}, err
	}

	ctx = context.WithValue(ctx, pkg.TxKey, tx)
	user, err = a.userService.CreateUser(ctx, params)
	if err != nil {
		return entity.User{}, errs.CheckSqlError(err, "User")
	}

	code, err := a.verificationService.CreateCode(ctx, user.Id)
	if err != nil {
		return entity.User{}, err
	}

	err = uow.Commit()
	if err != nil {
		return entity.User{}, err
	}

	// template := a.smtpService.CreateVerificationCodeTemplate(code)

	err = a.smtpService.SendEmail(smtpservice.SendInput{
		To:      user.Email,
		Subject: "Your Verification Code is Ready!",
		Body:    code,
	})
	if err != nil {
		return entity.User{}, err
	}

	return user, nil
}

func (a *Service) SignOut(ctx context.Context, sessionId string) error {
	err := a.sm.Delete(sessionId)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errs.NewForbiddenError(errors.New("user is not logged in"))
		}
		return err
	}
	return nil
}
