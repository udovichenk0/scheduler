package dto

type InviteToProjectRequestBody struct {
	Email     string `json:"email" validate:"email,required,min=4,max=40"`
	ProjectId string `json:"projectId" validate:"required"`
}
