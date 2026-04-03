package domain

import (
	"errors"
	"net/mail"
	"time"

	"github.com/udovichenk0/scheduler/internal/ports/repository/user/model"
	"github.com/udovichenk0/scheduler/pkg"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id        string
	Email     string
	Verified  bool
	CreatedAt string
	Hash      string
}

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrAccountNotVerified = errors.New("please verify your email first")
	ErrAccountLocked      = errors.New("account is locked")
)

func NewUser(emailaddress, hashPassword string) (User, error) {
	if _, err := mail.ParseAddress(emailaddress); err != nil {
		return User{}, ErrInvalidCredentials
	}

	return User{
		Id:        pkg.NewUUID(),
		Email:     emailaddress,
		Verified:  false,
		CreatedAt: time.Now().UTC().String(),
		Hash:      hashPassword,
	}, nil
}

func (u *User) VerifyPassword(plain string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Hash), []byte(plain))
}

func (u *User) CanLogin() error {
	if !u.Verified {
		return ErrAccountNotVerified
	}

	return nil
}

func ToDomainUser(entity model.Repository) User {
	return User{
		Id:        entity.Id,
		Email:     entity.Email,
		Verified:  entity.Verified,
		CreatedAt: entity.CreatedAt,
		Hash:      entity.Hash,
	}
}
