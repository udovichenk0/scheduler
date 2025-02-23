package db

import (
	"context"

	"github.com/jmoiron/sqlx"
	"github.com/udovichenk0/scheduler/internal/ports/repository/verification"
	"github.com/udovichenk0/scheduler/internal/ports/repository/verification/model"
	"github.com/udovichenk0/scheduler/pkg"
)

type VerificationRepo struct {
	db *sqlx.DB
}

func NewVerificationRepo(db *sqlx.DB) *VerificationRepo {
	return &VerificationRepo{db}
}

func (v VerificationRepo) GetByUserId(ctx context.Context, userId string) ([]model.Verification, error) {
	verifications := []model.Verification{}

	err := v.db.SelectContext(ctx, &verifications, "SELECT id, user_id, UNIX_TIMESTAMP(expires_at) as expires_at, code FROM verification WHERE user_id = ?", userId)

	if err != nil {
		return []model.Verification{}, err
	}

	return verifications, nil
}

func (v VerificationRepo) Create(ctx context.Context, params verification.CreateInput) error {
	_, err := pkg.ExecWithTx(ctx, v.db, "INSERT INTO verification (id, user_id, code, expires_at) VALUES (?, ?, ?, FROM_UNIXTIME(?))", params.Id, params.UserId, params.Code, params.ExpiresAt)
	return err
}

func (v VerificationRepo) Delete(ctx context.Context, id string) error {
	_, err := v.db.ExecContext(ctx, "DELETE FROM verification WHERE id = ?", id)
	return err
}

func (v VerificationRepo) Update(ctx context.Context, params verification.UpdateInput) error {
	_, err := v.db.ExecContext(ctx, "UPDATE verification SET code = ?, expires_at = FROM_UNIXTIME(?) WHERE user_id = ?", params.Code, params.ExpiresAt, params.UserId)
	return err
}
