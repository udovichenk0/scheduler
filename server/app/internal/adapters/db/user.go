package db

import (
	"context"

	sq "github.com/huandu/go-sqlbuilder"
	"github.com/udovichenk0/scheduler/internal/domain"
	"github.com/udovichenk0/scheduler/internal/ports/repository/user/model"
	dbutils "github.com/udovichenk0/scheduler/pkg/db"
)

type UserRepo struct {
	*Sqlx
}

func (r UserRepo) FindOneByEmail(ctx context.Context, email string) (domain.User, error) {
	user := model.Repository{}
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	err := db.GetContext(ctx, &user, "SELECT id, email, hash, verified, created_at FROM user WHERE email = ?", email)
	return toUser(user), err
}

func (r UserRepo) FindOneById(ctx context.Context, id string) (domain.User, error) {
	user := model.Repository{}
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	err := db.GetContext(ctx, &user, "SELECT id, email, hash, verified, created_at FROM user WHERE id = ?", id)
	return toUser(user), err
}

func (r UserRepo) CreateOne(ctx context.Context, input domain.User) error {
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, "INSERT INTO user (id, email, hash) VALUES(?,?,?)", input.Id, input.Email, input.Hash)
	return err
}

func (r UserRepo) DeleteOne(ctx context.Context, id string) error {
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, "DELETE FROM user WHERE id = ?", id)
	return err
}

func (r UserRepo) VerifyOne(ctx context.Context, userId string) error {
	sql := sq.NewUpdateBuilder().
		Update("user")
	sql.Set(sql.Assign("verified", 1))
	sql.Where(sql.EQ("id", userId))

	query, args := sql.Build()
	db := dbutils.DefaultOrTx(ctx, r.Pool)
	_, err := db.ExecContext(ctx, query, args...)

	return err
}

func toUser(model model.Repository) domain.User {
	return domain.User{
		Id:        model.Id,
		Email:     model.Email,
		Verified:  model.Verified,
		CreatedAt: model.CreatedAt,
		Hash:      model.Hash,
	}
}
