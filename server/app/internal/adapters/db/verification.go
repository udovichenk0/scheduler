package db

import (
	"context"

	verificationrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/verification"
	"github.com/udovichenk0/scheduler/internal/ports/repository/verification/model"
	dbutils "github.com/udovichenk0/scheduler/pkg/db"
)

type VerificationRepo struct {
	*Sqlx
}

func (r VerificationRepo) GetByUserId(ctx context.Context, userId string) ([]model.Verification, error) {
	verifications := []model.Verification{}
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	err := db.SelectContext(ctx, &verifications, "SELECT id, user_id, UNIX_TIMESTAMP(expires_at) as expires_at, code FROM verification WHERE user_id = ?", userId)

	if err != nil {
		return []model.Verification{}, err
	}

	return verifications, nil
}

func (r VerificationRepo) Create(ctx context.Context, params verificationrepoport.CreateInput) error {
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, "INSERT INTO verification (id, user_id, code, expires_at) VALUES (?, ?, ?, ?)", params.Id, params.UserId, params.Code, params.ExpiresAt)
	return err
}

func (r VerificationRepo) Delete(ctx context.Context, id string) error {
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, "DELETE FROM verification WHERE id = ?", id)
	return err
}

func (r VerificationRepo) Update(ctx context.Context, params verificationrepoport.UpdateInput) error {
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, "UPDATE verification SET code = ?, expires_at = ? WHERE user_id = ?", params.Code, params.ExpiresAt, params.UserId)
	return err
}
