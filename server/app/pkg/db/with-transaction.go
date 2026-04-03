package dbutils

import (
	"context"
	"errors"
	"log"

	"github.com/jmoiron/sqlx"
)

func WithTransaction(ctx context.Context, db *sqlx.DB, fn func(context.Context) error) error {
	hasExternalTx := ctx.Value(TxKey) != nil
	if db == nil {
		return errors.New("sqlx adapter is nil")
	}
	var txx *sqlx.Tx
	if !hasExternalTx {
		tx, err := db.BeginTxx(ctx, nil)
		if err != nil {
			return err
		}
		txx = tx
		ctx = context.WithValue(ctx, TxKey, tx)
	}

	err := fn(ctx)
	log.Println(err)
	if !hasExternalTx {
		if err != nil {
			return txx.Rollback()
		}

		return txx.Commit()
	}
	return nil
}
