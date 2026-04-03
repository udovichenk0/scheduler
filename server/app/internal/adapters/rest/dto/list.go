package dto

type CreateListRequestBody struct {
	Name string `json:"name" validate:"required,min=1"`
}
type CreateListRequestQuery struct {
	ProjectId string `json:"project_id" validate:"required"`
}

type GetListsRequestQuery struct {
	ProjectId string `query:"project_id"`
}

type GetListByIdQuery struct {
	ListId string `query:"listId"`
}
