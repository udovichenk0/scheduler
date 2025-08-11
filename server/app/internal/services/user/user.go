package user

import (
	"context"
	"errors"

	"github.com/udovichenk0/scheduler/internal/entity"
	"github.com/udovichenk0/scheduler/internal/ports/api/user"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	userRepo "github.com/udovichenk0/scheduler/internal/ports/repository/user"
	"github.com/udovichenk0/scheduler/internal/ports/repository/user/model"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	"github.com/zhulik/pal"
)

type Service struct {
	UserRepo userRepo.Repository
	Logger   logger.ILogger
}

func (u *Service) GetUserByEmail(ctx context.Context, email string) (entity.User, error) {
	user, err := u.UserRepo.Get(ctx, email)
	if err != nil {
		if errs.IsResourceNotFound(err) {
			return entity.User{}, errs.NewResourceNotFoundError(err, "failed to get user")
		}
		return entity.User{}, errs.NewInternalError(err)
	}
	return ToEntity(user), nil
}

func (u *Service) GetUserById(ctx context.Context, id string) (entity.User, error) {
	user, err := u.UserRepo.GetById(ctx, id)
	if err != nil {
		if errs.IsResourceNotFound(err) {
			return entity.User{}, errs.NewResourceNotFoundError(err, "failed to get user")
		}
		return entity.User{}, errs.NewInternalError(err)
	}

	return ToEntity(user), nil
}

func (u *Service) CreateUser(ctx context.Context, params userservice.CreateInput) (entity.User, error) {
	createInput := userRepo.CreateInput{
		Email:    params.Email,
		PassHash: params.Hash,
	}
	err := u.UserRepo.Create(ctx, params.UserId, createInput)
	if err != nil {
		return entity.User{}, errs.NewError(err, "failed to create user")
	}

	user, err := u.UserRepo.Get(ctx, params.Email)
	if err != nil {
		return entity.User{}, errs.NewResourceNotFoundError(err, "failed to get user")
	}

	return ToEntity(user), nil
}

func (u *Service) IsVerifiedUserExist(ctx context.Context, email string) (bool, error) {
	user, err := u.GetUserByEmail(ctx, email)
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

func (u *Service) DeleteUser(ctx context.Context, userId string) error {
	err := u.UserRepo.Delete(ctx, userId)

	if err != nil {
		return errs.NewError(err, "failed to delete user")
	}
	return nil
}

func (u *Service) Verify(ctx context.Context, id string) error {
	err := u.UserRepo.Update(ctx, userRepo.UpdateInput{Verified: true, Id: id})
	if err != nil {
		return errs.NewError(err, "failed to verify user")
	}

	return nil
}

func ToEntity(user model.Repository) entity.User {
	return entity.User{
		Id:        user.Id,
		Email:     user.Email,
		Hash:      user.Hash,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	}
}

func Provide() pal.ServiceDef {
	return pal.Provide[user.Api](&Service{})
}
