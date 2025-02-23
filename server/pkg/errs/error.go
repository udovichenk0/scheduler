package errs

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

const (
	NotFound     = "not_found"
	Validation   = "validation"
	Internal     = "internal"
	BadRequest   = "bad_request"
	Unauthorized = "unauthorized"
	Expired      = "expired"
	Forbidden    = "forbidden"
)

type (
	QueryError struct{}

	NoRowError struct {
		entity string
	}

	UnauthorizedError struct{}

	InternalError struct {
		err error
	}
	ForbiddenError struct {
		err error
	}

	BadRequestError struct {
		err error
	}

	ValidationError struct {
		Field string
		Value interface{}
		Msg   string
	}
	ValidationErrors struct {
		errs []ValidationError
	}
	ExpiredError struct {
		msg string
	}
)

type Error struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Err     string `json:"error"`
}

func NewNoRowError(entity string) NoRowError {
	return NoRowError{entity}
}
func (err NoRowError) Error() string {
	return fmt.Sprintf("%s does not exist", err.entity)
}

func NewForbiddenError(err error) ForbiddenError {
	return ForbiddenError{err}
}
func (err ForbiddenError) Error() string {
	return fmt.Sprintf("Forbidden: %s", err.err.Error())
}

func NewInternalError(err error) InternalError {
	return InternalError{err}
}
func (err InternalError) Error() string {
	return fmt.Sprintf("Internal Error: %s", err.err.Error())
}

func NewUnauthorizedError() UnauthorizedError {
	return UnauthorizedError{}
}

func (err UnauthorizedError) Error() string {
	return "Unauthorized"
}

func NewExpiredError(msg string) ExpiredError {
	return ExpiredError{msg}
}

func (err ExpiredError) Error() string {
	return err.msg
}

func NewBadRequestError(err error) BadRequestError {
	switch v := err.(type) {
	case *json.UnmarshalTypeError:
		return BadRequestError{
			fmt.Errorf("wrong '%s' type, expected %s, got %s", v.Field, v.Type, v.Value),
		}
	default:
		return BadRequestError{err}
	}
}

func (err BadRequestError) Error() string {
	return err.err.Error()
}

func NewValidationError(field string, value interface{}, msg string) ValidationError {
	return ValidationError{field, value, msg}
}

func (errs ValidationErrors) Error() string {
	var msgs []string

	for _, err := range errs.errs {
		msgs = append(msgs, err.Msg)
	}
	return strings.Join(msgs, "; ")
}

func IsDuplicateError(err error) bool {
	return strings.Contains(err.Error(), "Duplicate entry")
}

func HandleError(err error) Error {
	var noRow NoRowError
	var badRequest BadRequestError
	var validation ValidationErrors
	var unauthorized UnauthorizedError
	var expired ExpiredError
	var forbidden ForbiddenError
	switch {
	case errors.As(err, &noRow):
		return Error{fiber.StatusOK, err.Error(), NotFound}
	case errors.As(err, &unauthorized):
		return Error{fiber.StatusUnauthorized, err.Error(), Unauthorized}
	case errors.As(err, &badRequest):
		return Error{fiber.StatusBadRequest, err.Error(), BadRequest}
	case errors.As(err, &validation):
		return Error{fiber.StatusBadRequest, err.Error(), Validation}
	case errors.As(err, &expired):
		return Error{fiber.StatusBadRequest, err.Error(), Expired}
	case errors.As(err, &forbidden):
		return Error{fiber.StatusForbidden, err.Error(), Forbidden}
	default:
		return Error{fiber.StatusInternalServerError, "Internal Error", Internal}
	}
}

func CheckSqlError(err error, entity string) error {
	if errors.Is(err, sql.ErrNoRows) {
		return NewNoRowError(entity)
	}
	return NewInternalError(err)
}

func CheckValidationError(errs error) ValidationErrors {
	validationErrors := ValidationErrors{}
	for _, err := range errs.(validator.ValidationErrors) {
		var elem ValidationError
		elem.Field = err.Field() // Export struct field name
		elem.Value = err.Value() // Export field value
		elem.Msg = strings.Split(err.Error(), "Error:")[1]
		validationErrors.errs = append(validationErrors.errs, elem)
	}
	return validationErrors
}
