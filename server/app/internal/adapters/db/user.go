package db

import (
	"context"

	sq "github.com/huandu/go-sqlbuilder"
	userRepo "github.com/udovichenk0/scheduler/internal/ports/repository/user"
	"github.com/udovichenk0/scheduler/internal/ports/repository/user/model"
	"github.com/udovichenk0/scheduler/pkg"
)

type UserRepo struct {
	*Sqlx
}

func (r UserRepo) Get(ctx context.Context, email string) (model.Repository, error) {
	user := model.Repository{}
	err := r.Pool.GetContext(ctx, &user, "SELECT id, email, hash, verified, created_at FROM user WHERE email = ?", email)
	if err != nil {
		return model.Nil, err
	}
	return user, nil
}

func (r UserRepo) GetById(ctx context.Context, id string) (model.Repository, error) {
	user := model.Repository{}
	err := r.Pool.GetContext(ctx, &user, "SELECT id, email, hash, verified, created_at FROM user WHERE id = ?", id)
	if err != nil {
		return model.Nil, err
	}
	return user, nil
}

func (r UserRepo) Create(ctx context.Context, id string, input userRepo.CreateInput) error {
	_, err := pkg.ExecWithTx(ctx, r.Pool, "INSERT INTO user (id, email, hash) VALUES(?,?,?)", id, input.Email, input.PassHash)
	if err != nil {
		return err
	}
	return nil
}

func (r UserRepo) Delete(ctx context.Context, id string) error {
	_, err := r.Pool.ExecContext(ctx, "DELETE FROM user WHERE id = ?", id)

	return err
}

func (r UserRepo) Update(ctx context.Context, input userRepo.UpdateInput) error {
	sql := sq.NewUpdateBuilder()
	sql.Update("user")

	if input.Email != "" {
		sql.Set(sql.Assign("email", input.Email))
	}

	if input.Verified {
		sql.Set(sql.Assign("verified", input.Verified))
	}

	sql.Where(sql.EQ("id", input.Id))

	query, args := sql.Build()

	_, err := r.Pool.ExecContext(ctx, query, args...)

	return err
}
