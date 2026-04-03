package userservice

import (
	"context"
	"errors"

	"github.com/udovichenk0/scheduler/internal/adapters/db"
	"github.com/udovichenk0/scheduler/internal/domain"
	listserviceport "github.com/udovichenk0/scheduler/internal/ports/api/list"
	projectserviceport "github.com/udovichenk0/scheduler/internal/ports/api/project"
	userserviceport "github.com/udovichenk0/scheduler/internal/ports/api/user"
	userrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/user"
	"github.com/udovichenk0/scheduler/internal/ports/repository/user/model"
	dbutils "github.com/udovichenk0/scheduler/pkg/db"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	"github.com/zhulik/pal"
)

type Service struct {
	UserRepo       userrepoport.Repository
	ListService    listserviceport.Api
	ProjectService projectserviceport.Api
	Logger         logger.ILogger
	*db.Sqlx
}

func (u *Service) GetByEmail(ctx context.Context, email string) (userserviceport.UserOutput, error) {
	user, err := u.UserRepo.FindOneByEmail(ctx, email)
	if err != nil {
		if errs.IsResourceNotFound(err) {
			return userserviceport.UserOutput{}, errs.NewResourceNotFoundError(err, "failed to get user")
		}
		return userserviceport.UserOutput{}, errs.NewInternalError(err)
	}
	return userserviceport.UserOutput{
		Id:        user.Id,
		Email:     user.Email,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	}, nil
}

func (u *Service) GetById(ctx context.Context, id string) (userserviceport.UserOutput, error) {
	user, err := u.UserRepo.FindOneById(ctx, id)
	if err != nil {
		if errs.IsResourceNotFound(err) {
			return userserviceport.UserOutput{}, errs.NewResourceNotFoundError(err, "failed to get user")
		}
		return userserviceport.UserOutput{}, errs.NewInternalError(err)
	}

	return userserviceport.UserOutput{
		Id:        user.Id,
		Email:     user.Email,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	}, nil
}

func (u *Service) Create(ctx context.Context, params userserviceport.CreateInput) (userserviceport.UserOutput, error) {
	user, err := domain.NewUser(params.Email, params.HashPassword)
	if err != nil {
		return userserviceport.UserOutput{}, err
	}

	err = dbutils.WithTransaction(ctx, u.Pool, func(ctx context.Context) error {
		err := u.UserRepo.CreateOne(ctx, user)
		if err != nil {
			return errs.NewError(err, "failed to create user")
		}
		return u.ProjectService.CreatePrivateProject(ctx, projectserviceport.CreatePrivateProjectInput{
			UserId: user.Id,
		})
	})

	if err != nil {
		return userserviceport.UserOutput{}, err
	}

	// user, err := u.UserRepo.FindOneByEmail(ctx, user.Email)
	// if err != nil {
	// 	return userserviceport.UserOutput{}, errs.NewResourceNotFoundError(err, "failed to get user")
	// }

	return userserviceport.UserOutput{
		Id:        user.Id,
		Email:     user.Email,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	}, nil
}

func (u *Service) ExistsVerified(ctx context.Context, email string) (bool, error) {
	user, err := u.GetByEmail(ctx, email)
	if err != nil {
		if errors.As(err, &errs.NoRowError{}) {
			return false, nil
		}
		return false, err
	}
	if !user.Verified {
		return false, nil
	}

	return true, nil
}

func (u *Service) Delete(ctx context.Context, userId string) error {
	err := u.UserRepo.DeleteOne(ctx, userId)

	if err != nil {
		return errs.NewError(err, "failed to delete user")
	}
	return nil
}

func (u *Service) MarkAsVerified(ctx context.Context, userId string) error {
	err := u.UserRepo.VerifyOne(ctx, userId)
	if err != nil {
		return errs.NewError(err, "failed to verify user")
	}

	return nil
}

func ToEntity(user model.Repository) domain.User {
	return domain.User{
		Id:        user.Id,
		Email:     user.Email,
		Hash:      user.Hash,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	}
}

func Provide() pal.ServiceDef {
	return pal.Provide[userserviceport.Api](&Service{})
}
