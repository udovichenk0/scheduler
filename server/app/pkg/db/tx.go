package dbutils

import (
	"context"

	"github.com/jmoiron/sqlx"
)

type Querier interface {
	sqlx.ExtContext
	SelectContext(ctx context.Context, dest any, query string, args ...any) error
	GetContext(ctx context.Context, dest any, query string, args ...any) error
}

func DefaultOrTx(ctx context.Context, db *sqlx.DB) Querier {
	tx, ok := GetTx(ctx)
	if ok {
		return tx
	}
	return db
}

// func ExecWithTx(ctx context.Context, db *sqlx.DB, query string, args ...any) (sql.Result, error) {
// 	return DefaultDbOrTx(ctx, db).ExecContext(ctx, query, args...)
// }

// func SelectWithTx(ctx context.Context, dest any, db *sqlx.DB, query string, args ...any) error {
// 	return DefaultDbOrTx(ctx, db).SelectContext(ctx, dest, query, args...)
// }

// func GetWithTx(ctx context.Context, dest any, db *sqlx.DB, query string, args ...any) error {
// 	return DefaultDbOrTx(ctx, db).GetContext(ctx, dest, query, args...)
// }

func GetTx(ctx context.Context) (*sqlx.Tx, bool) {
	if ctx == nil {
		return nil, false
	}
	tx, ok := ctx.Value(TxKey).(*sqlx.Tx)
	if !ok || tx == nil {
		return nil, false
	}
	return tx, true
}
