package dto

type TokenExchange struct {
	Code  string `validate:"code"`
	State string `validate:"state"`
}

type Credentials struct {
	Email    string `json:"email" validate:"email,required,min=4,max=40"`
	Password string `json:"password" validate:"required,min=8,max=50"`
}

type SignoutResponseDto struct {
	Success bool `json:"success"`
}
