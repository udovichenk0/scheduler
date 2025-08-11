package db

import (
	"context"

	"github.com/udovichenk0/scheduler/internal/ports/repository/verification"
	"github.com/udovichenk0/scheduler/internal/ports/repository/verification/model"
	"github.com/udovichenk0/scheduler/pkg"
)

type VerificationRepo struct {
	*Sqlx
}

func (r VerificationRepo) GetByUserId(ctx context.Context, userId string) ([]model.Verification, error) {
	verifications := []model.Verification{}

	err := r.Pool.SelectContext(ctx, &verifications, "SELECT id, user_id, UNIX_TIMESTAMP(expires_at) as expires_at, code FROM verification WHERE user_id = ?", userId)

	if err != nil {
		return []model.Verification{}, err
	}

	return verifications, nil
}

func (r VerificationRepo) Create(ctx context.Context, params verification.CreateInput) error {
	_, err := pkg.ExecWithTx(ctx, r.Pool, "INSERT INTO verification (id, user_id, code, expires_at) VALUES (?, ?, ?, ?)", params.Id, params.UserId, params.Code, params.ExpiresAt)
	return err
}

func (r VerificationRepo) Delete(ctx context.Context, id string) error {
	_, err := r.Pool.ExecContext(ctx, "DELETE FROM verification WHERE id = ?", id)
	return err
}

func (r VerificationRepo) Update(ctx context.Context, params verification.UpdateInput) error {
	_, err := r.Pool.ExecContext(ctx, "UPDATE verification SET code = ?, expires_at = ? WHERE user_id = ?", params.Code, params.ExpiresAt, params.UserId)
	return err
}
