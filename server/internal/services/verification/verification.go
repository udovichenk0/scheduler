package verification

import (
	"context"
	"errors"

	"github.com/udovichenk0/scheduler/internal/entity"
	smtpservice "github.com/udovichenk0/scheduler/internal/ports/api/smtp"
	userApi "github.com/udovichenk0/scheduler/internal/ports/api/user"
	verificationRepo "github.com/udovichenk0/scheduler/internal/ports/repository/verification"
	"github.com/udovichenk0/scheduler/pkg"
	"github.com/udovichenk0/scheduler/pkg/errs"
)

type Service struct {
	verificationRepo verificationRepo.Port
	userService      userApi.Port
	smtpService      smtpservice.Port
}

func New(verificationRepo verificationRepo.Port, userService userApi.Port, smtpService smtpservice.Port) *Service {
	return &Service{verificationRepo, userService, smtpService}
}

func (v *Service) VerifyUser(ctx context.Context, code, userId string) (entity.User, error) {
	verifications, err := v.verificationRepo.GetByUserId(ctx, userId)
	if err != nil {
		return entity.User{}, errs.CheckSqlError(err, "Verification")
	}

	verification := entity.GetLatestVerification(verifications)

	if entity.IsExpired(verification.ExpiresAt) {
		v.verificationRepo.Delete(ctx, verification.Id)
		return entity.User{}, errs.NewExpiredError("verification code is expired")
	}
	if !entity.IsCodeValid(verification.Code, code) {
		return entity.User{}, errs.NewBadRequestError(errors.New("verification code is invalid"))
	}

	if err := v.verificationRepo.Delete(ctx, verification.Id); err != nil {
		return entity.User{}, errs.CheckSqlError(err, "Verification")
	}
	if err := v.userService.Verify(ctx, userId); err != nil {
		return entity.User{}, errs.CheckSqlError(err, "User")
	}

	user, err := v.userService.GetUserById(ctx, userId)

	if err != nil {
		return entity.User{}, err
	}

	return user, nil
}

func (v *Service) CreateCode(ctx context.Context, userId string) (string, error) {
	code := entity.GenerateVerificationCode()
	err := v.verificationRepo.Create(ctx, verificationRepo.CreateInput{
		Id:        pkg.NewUUID(),
		UserId:    userId,
		Code:      code,
		ExpiresAt: pkg.UnixToDateTime(entity.GetVerificationExpiration()),
	})

	if err != nil {
		return "", err
	}

	return code, nil
}

func (v *Service) ChangeCode(ctx context.Context, userId string, email string) error {
	params := verificationRepo.UpdateInput{
		UserId:    userId,
		Code:      entity.GenerateVerificationCode(),
		ExpiresAt: pkg.UnixToDateTime(entity.GetVerificationExpiration()),
	}

	err := v.smtpService.SendEmail(smtpservice.SendInput{
		To:      email,
		Subject: "Your Verification Code is Ready!",
		Body:    params.Code,
	})
	if err != nil {
		return err
	}

	err = v.verificationRepo.Update(ctx, params)
	if err != nil {
		return errs.CheckSqlError(err, "Verification")
	}

	return nil
}
