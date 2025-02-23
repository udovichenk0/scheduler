package user

import (
	"context"
	"errors"

	"github.com/udovichenk0/scheduler/internal/entity"
	userservice "github.com/udovichenk0/scheduler/internal/ports/api/user"
	userRepo "github.com/udovichenk0/scheduler/internal/ports/repository/user"
	"github.com/udovichenk0/scheduler/internal/ports/repository/user/model"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
)

type Service struct {
	userRepo userRepo.Port
	logger   logger.Logger
}

func New(userRepo userRepo.Port, logger logger.Logger) *Service {
	return &Service{userRepo: userRepo, logger: logger}
}

func (u *Service) GetUserByEmail(ctx context.Context, email string) (entity.User, error) {
	user, err := u.userRepo.Get(ctx, email)
	if err != nil {
		return entity.User{}, errs.CheckSqlError(err, "User")
	}
	return ToEntity(user), nil
}

func (us *Service) GetUserById(ctx context.Context, id string) (entity.User, error) {
	user, err := us.userRepo.GetById(ctx, id)
	if err != nil {
		return entity.User{}, errs.CheckSqlError(err, "User")
	}

	return ToEntity(user), nil
}

func (u *Service) CreateUser(ctx context.Context, params userservice.CreateInput) (entity.User, error) {
	createInput := userRepo.CreateInput{
		Email:    params.Email,
		PassHash: params.Hash,
	}
	err := u.userRepo.Create(ctx, params.UserId, createInput)
	if err != nil {
		return entity.User{}, errs.CheckSqlError(err, "User")
	}

	user, err := u.userRepo.Get(ctx, params.Email)
	if err != nil {
		return entity.User{}, errs.CheckSqlError(err, "User")
	}

	return ToEntity(user), nil
}

func (us *Service) IsVerifiedUserExist(ctx context.Context, email string) (bool, error) {
	user, err := us.GetUserByEmail(ctx, email)
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

func (us *Service) DeleteUser(ctx context.Context, userId string) error {
	err := us.userRepo.Delete(ctx, userId)

	if err != nil {
		return errs.CheckSqlError(err, "User")
	}
	return nil
}

func (s *Service) Verify(ctx context.Context, id string) error {
	err := s.userRepo.Update(ctx, userRepo.UpdateInput{Verified: true, Id: id})
	if err != nil {
		return errs.NewInternalError(err)
	}

	return nil
}

func ToEntity(user model.User) entity.User {
	return entity.User{
		Id:        user.Id,
		Email:     user.Email,
		Hash:      user.Hash,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt,
	}
}
