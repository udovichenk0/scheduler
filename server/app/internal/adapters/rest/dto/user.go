package dto

type UserDto struct {
	Id       string `json:"id"`
	Email    string `json:"email"`
	Verified bool   `json:"verified"`
}

type GetUserRequestDto struct {
	Email string `json:"email" validate:"email,min=4,max=40"`
}

type EmailExistsResponseDto struct {
	Exists bool `json:"exists"`
}
