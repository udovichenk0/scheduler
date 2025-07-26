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
		Err error
		Msg string
	}

	UnauthorizedError struct{}

	InternalError struct {
		err error
		msg string
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
	BusinessRuleViolationError struct {
		Err error
		Msg string
	}
	GeneralError struct {
		Err error
		Msg string
	}
)

type Error struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	Type    string `json:"error"`
	err     error
}

func NewError(err error, msg string) GeneralError {
	return GeneralError{err, msg}
}

func (err GeneralError) Error() string {
	return err.Msg
}

func NewResourceNotFoundError(err error, entity string) NoRowError {
	return NoRowError{err, entity}
}
func (err NoRowError) Error() string {
	return err.Msg
}

func NewForbiddenError(err error) ForbiddenError {
	return ForbiddenError{err}
}
func (err ForbiddenError) Error() string {
	return fmt.Sprintf("Forbidden: %s", err.err.Error())
}

func NewInternalError(err error) InternalError {
	return InternalError{err, "Internal Error"}
}
func (err InternalError) Error() string {
	return err.msg
}

func NewInternalErrorWithMsg(err error, msg string) InternalError {
	return InternalError{err, msg}
}

func NewUnauthorizedError() UnauthorizedError {
	return UnauthorizedError{}
}

func (err UnauthorizedError) Error() string {
	return "Unauthorized"
}

func NewBusinessRuleViolationError(err error, msg string) BusinessRuleViolationError {
	return BusinessRuleViolationError{err, msg}
}
func (err BusinessRuleViolationError) Error() string {
	return err.Msg
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
	var general GeneralError
	var validation ValidationErrors
	var unauthorized UnauthorizedError
	var forbidden ForbiddenError
	var businessRuleViolationError BusinessRuleViolationError
	var internal InternalError
	switch {
	case errors.As(err, &noRow):
		return Error{fiber.StatusOK, err.Error(), NotFound, noRow.Err}
	case errors.As(err, &unauthorized):
		return Error{fiber.StatusUnauthorized, err.Error(), Unauthorized, unauthorized}
	case errors.As(err, &badRequest):
		return Error{fiber.StatusBadRequest, err.Error(), BadRequest, badRequest.err}
	case errors.As(err, &general):
		return Error{fiber.StatusBadRequest, err.Error(), BadRequest, general.Err}
	case errors.As(err, &businessRuleViolationError):
		return Error{fiber.StatusBadRequest, err.Error(), BadRequest, businessRuleViolationError.Err}
	case errors.As(err, &validation):
		return Error{fiber.StatusBadRequest, err.Error(), Validation, validation}
	case errors.As(err, &forbidden):
		return Error{fiber.StatusForbidden, err.Error(), Forbidden, forbidden.err}
	case errors.As(err, &internal):
		return Error{fiber.StatusInternalServerError, err.Error(), Internal, internal.err}
	default:
		return Error{fiber.StatusInternalServerError, err.Error(), Internal, errors.New("unhandled error")}
	}
}

func IsResourceNotFound(err error) bool {
	return errors.Is(err, sql.ErrNoRows)
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
