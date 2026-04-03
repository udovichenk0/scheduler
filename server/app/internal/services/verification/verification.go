package verificationservice

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/domain"
	smtpserviceport "github.com/udovichenk0/scheduler/internal/ports/api/smtp"
	userserviceport "github.com/udovichenk0/scheduler/internal/ports/api/user"
	verificationserviceport "github.com/udovichenk0/scheduler/internal/ports/api/verification"
	verificationrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/verification"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/zhulik/pal"
)

type Service struct {
	VerificationRepo verificationrepoport.Repository
	UserService      userserviceport.Api
	SmtpService      smtpserviceport.Api
}

func New(verificationRepo verificationrepoport.Repository, userService userserviceport.Api, smtpService smtpserviceport.Api) *Service {
	return &Service{verificationRepo, userService, smtpService}
}

func (v *Service) VerifyUser(ctx context.Context, code, userId string) (verificationserviceport.VerifyUserOutput, error) {
	verifications, err := v.VerificationRepo.GetByUserId(ctx, userId)
	if err != nil {
		return verificationserviceport.VerifyUserOutput{}, errs.NewInternalError(err)
	}

	verification := domain.GetLatestVerification(verifications)

	if verification.IsExpired() {
		v.VerificationRepo.Delete(ctx, verification.Id)
		return verificationserviceport.VerifyUserOutput{}, errs.NewError(err, "verification code is expired")
	}
	if !verification.IsCodeValid(code) {
		return verificationserviceport.VerifyUserOutput{}, errs.NewError(err, "verification code is invalid")
	}

	if err := v.VerificationRepo.Delete(ctx, verification.Id); err != nil {
		return verificationserviceport.VerifyUserOutput{}, errs.NewInternalError(err)
	}
	if err := v.UserService.MarkAsVerified(ctx, userId); err != nil {
		return verificationserviceport.VerifyUserOutput{}, err
	}

	user, err := v.UserService.GetById(ctx, userId)
	if err != nil {
		return verificationserviceport.VerifyUserOutput{}, err
	}

	return verificationserviceport.VerifyUserOutput{
		Id:        user.Id,
		Email:     user.Email,
		Verified:  user.Verified,
		CreatedAt: "",
	}, nil
}

func (v *Service) CreateCode(ctx context.Context, userId string) (string, error) {
	verification := domain.NewVerification(userId)
	err := v.VerificationRepo.Create(ctx, verificationrepoport.CreateInput{
		Id:        verification.Id,
		UserId:    userId,
		Code:      verification.Code,
		ExpiresAt: verification.ExpiresAt,
	})

	if err != nil {
		return "", errs.NewInternalError(err)
	}

	return verification.Code, nil
}

func (v *Service) ChangeCode(ctx context.Context, userId string, email string) error {
	params := verificationrepoport.UpdateInput{
		UserId:    userId,
		Code:      domain.GenerateVerificationCode(),
		ExpiresAt: domain.GetVerificationExpiration(),
	}

	err := v.SmtpService.SendEmail(smtpserviceport.SendInput{
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
	return pal.Provide[verificationserviceport.Api](&Service{})
}
