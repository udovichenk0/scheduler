package pkg

import (
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/udovichenk0/scheduler/internal/entity"
)

func IsStatusValid(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	canceled := string(entity.Canceled)
	finished := string(entity.Finished)
	inprogress := string(entity.Inprogress)
	isStatusValid := (s == canceled) || (s == finished) || (s == inprogress)

	return isStatusValid
}

func IsTypeValid(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	inbox := string(entity.Inbox)
	unplaced := string(entity.Unplaced)
	isTypeValid := (s == inbox) || (s == unplaced)

	return isTypeValid
}

func IsStartDateValid(fl validator.FieldLevel) bool {
	startDate := fl.Field().Int()
	maxStartDate := time.Now().AddDate(50, 0, 0).Unix()
	return maxStartDate >= startDate
}

func NewValidator() *validator.Validate {
	v := validator.New()
	v.RegisterValidation("status", IsStatusValid)
	v.RegisterValidation("type", IsTypeValid)
	v.RegisterValidation("startDate", IsStartDateValid)
	return v
}
