package authservice

import "errors"

var (
	ErrEmailAlreadyTaken = errors.New("Email already taken")
	ErrInvalidInput      = errors.New("Invalid credentials")
)
