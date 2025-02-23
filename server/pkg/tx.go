package pkg

import (
	"context"
	"database/sql"

	"github.com/jmoiron/sqlx"
)

func ExecWithTx(ctx context.Context, db *sqlx.DB, query string, args ...any) (sql.Result, error) {
	tx, ok := GetTx(ctx)
	if ok {
		return tx.ExecContext(ctx, query, args...)
	}
	return db.ExecContext(ctx, query, args...)
}

func QueryWithTx(ctx context.Context, dest interface{}, db *sqlx.DB, query string, args ...any) error {
	tx, ok := GetTx(ctx)
	if ok {
		return tx.SelectContext(ctx, dest, query, args...)
	}
	return db.SelectContext(ctx, dest, query, args...)
}

func QueryRowWithTx(ctx context.Context, dest interface{}, db *sqlx.DB, query string, args ...any) error {
	tx, ok := GetTx(ctx)
	if ok {
		return tx.GetContext(ctx, dest, query, args...)
	}
	return db.GetContext(ctx, dest, query, args...)
}

func GetTx(ctx context.Context) (*sqlx.Tx, bool) {
	tx, ok := ctx.Value(TxKey).(*sqlx.Tx)

	if ok {
		return tx, true
	}

	return &sqlx.Tx{}, false
}
