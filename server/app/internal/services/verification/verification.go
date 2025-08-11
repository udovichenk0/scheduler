package verification

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/entity"
	smtpservice "github.com/udovichenk0/scheduler/internal/ports/api/smtp"
	userApi "github.com/udovichenk0/scheduler/internal/ports/api/user"
	"github.com/udovichenk0/scheduler/internal/ports/api/verification"
	verificationRepo "github.com/udovichenk0/scheduler/internal/ports/repository/verification"
	"github.com/udovichenk0/scheduler/pkg"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/zhulik/pal"
)

type Service struct {
	VerificationRepo verificationRepo.Repository
	UserService      userApi.Api
	SmtpService      smtpservice.Api
}

func New(verificationRepo verificationRepo.Repository, userService userApi.Api, smtpService smtpservice.Api) *Service {
	return &Service{verificationRepo, userService, smtpService}
}

func (v *Service) VerifyUser(ctx context.Context, code, userId string) (entity.User, error) {
	verifications, err := v.VerificationRepo.GetByUserId(ctx, userId)
	if err != nil {
		return entity.User{}, errs.NewInternalError(err)
	}

	verification := entity.GetLatestVerification(verifications)

	if entity.IsExpired(verification.ExpiresAt) {
		v.VerificationRepo.Delete(ctx, verification.Id)
		return entity.User{}, errs.NewError(err, "verification code is expired")
	}
	if !entity.IsCodeValid(verification.Code, code) {
		return entity.User{}, errs.NewError(err, "verification code is invalid")
	}

	if err := v.VerificationRepo.Delete(ctx, verification.Id); err != nil {
		return entity.User{}, errs.NewInternalError(err)
	}
	if err := v.UserService.Verify(ctx, userId); err != nil {
		return entity.User{}, err
	}

	user, err := v.UserService.GetUserById(ctx, userId)
	if err != nil {
		return entity.User{}, err
	}

	return user, nil
}

func (v *Service) CreateCode(ctx context.Context, userId string) (string, error) {
	code := entity.GenerateVerificationCode()
	err := v.VerificationRepo.Create(ctx, verificationRepo.CreateInput{
		Id:        pkg.NewUUID(),
		UserId:    userId,
		Code:      code,
		ExpiresAt: pkg.UnixToDateTime(entity.GetVerificationExpiration()),
	})

	if err != nil {
		return "", errs.NewInternalError(err)
	}

	return code, nil
}

func (v *Service) ChangeCode(ctx context.Context, userId string, email string) error {
	params := verificationRepo.UpdateInput{
		UserId:    userId,
		Code:      entity.GenerateVerificationCode(),
		ExpiresAt: pkg.UnixToDateTime(entity.GetVerificationExpiration()),
	}

	err := v.SmtpService.SendEmail(smtpservice.SendInput{
		To:      email,
		Subject: "Your Verification Code is Ready!",
		Body:    params.Code,
	})

	if err != nil {
		return errs.NewInternalError(err)
	}

	err = v.VerificationRepo.Update(ctx, params)
	if err != nil {
		return errs.NewError(err, "failed to resend code")
	}

	return nil
}

func Provide() pal.ServiceDef {
	return pal.Provide[verification.Api](&Service{})
}
