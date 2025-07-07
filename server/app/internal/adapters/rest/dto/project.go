package dto

type CreateProjectRequestBody struct {
	Name string `json:"name" validate:"required,min=1"`
}
