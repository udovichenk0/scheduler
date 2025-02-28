package dto

type VerificationCodeBody struct {
	Code   string `json:"code" validate:"required,len=6"`
	UserId string `json:"userId" validate:"required"`
}

type ResendCodeBody struct {
	UserId string `json:"userId" validate:"required"`
	Email  string `json:"email" validate:"email,required,min=4,max=40"`
}
