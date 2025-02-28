package pkg

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"
	"github.com/udovichenk0/scheduler/pkg/errs"
)

type UnitOfWork struct {
	db  *sqlx.DB
	ctx context.Context
	tx  *sql.Tx
}

func NewUnitOfWork(db *sqlx.DB, ctx context.Context) *UnitOfWork {
	return &UnitOfWork{db: db, ctx: ctx}
}

func (uow *UnitOfWork) Begin() (*sql.Tx, error) {
	tx, err := uow.db.BeginTx(uow.ctx, nil)
	if err != nil {
		return &sql.Tx{}, errs.NewInternalError(err)
	}
	uow.tx = tx
	return tx, nil
}
func (uow *UnitOfWork) Rollback() error {
	if uow.tx == nil {
		return errs.NewInternalError(errors.New("transaction was not provided"))
	}

	err := uow.tx.Rollback()
	uow.tx = nil

	if err != nil {
		return errs.NewInternalError(err)
	}
	return nil
}
func (uow *UnitOfWork) Commit() error {
	if uow.tx == nil {
		return errs.NewInternalError(errors.New("transaction was not provided"))
	}
	err := uow.tx.Commit()
	uow.tx = nil
	if err != nil {
		return errs.NewInternalError(err)
	}
	return nil
}

func (uow *UnitOfWork) StartUOW(fn func(ctx context.Context) error) error {
	_, err := uow.Begin()
	if err != nil {
		return err
	}

	ctx := context.WithValue(uow.ctx, TxKey, uow.tx)

	err = fn(ctx)

	if err != nil {
		rollbackerr := uow.Rollback()

		if rollbackerr != nil {
			return rollbackerr
		}
		return err
	}
	err = uow.Commit()
	if err != nil {
		return err
	}

	return nil
}
