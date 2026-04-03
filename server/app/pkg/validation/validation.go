package validator

import (
	"context"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/udovichenk0/scheduler/internal/domain"
	"github.com/zhulik/pal"
)

type Validator struct {
	Vali *validator.Validate
}

func IsStatusValid(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	canceled := string(domain.ToDo)
	finished := string(domain.Finished)
	inprogress := string(domain.Inprogress)
	isStatusValid := (s == canceled) || (s == finished) || (s == inprogress)

	return isStatusValid
}

func IsPriorityValid(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	none := string(domain.None)
	low := string(domain.Low)
	normal := string(domain.Normal)
	high := string(domain.High)
	urgent := string(domain.Urgent)
	return (s == none) || (s == low) || (s == normal) || (s == high) || (s == urgent)
}

func IsTypeValid(fl validator.FieldLevel) bool {
	s := fl.Field().String()
	inbox := string(domain.Inbox)
	unplaced := string(domain.Unplaced)
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
	v.RegisterValidation("priority", IsPriorityValid)
	return v
}

func (vali *Validator) Init(_ context.Context) error {
	v := validator.New()
	v.RegisterValidation("status", IsStatusValid)
	v.RegisterValidation("type", IsTypeValid)
	v.RegisterValidation("startDate", IsStartDateValid)
	v.RegisterValidation("priority", IsPriorityValid)

	vali.Vali = v
	return nil
}

func Provide() pal.ServiceDef {
	return pal.Provide(&Validator{})
}
