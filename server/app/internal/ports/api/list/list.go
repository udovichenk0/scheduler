package listserviceport

import (
	"time"
)

type CreateInput struct {
	Name      string
	UserId    string
	ProjectId string
	IsPrivate bool
}

type CreatePrivateInput struct {
	UserId    string
	ProjectId string
}

type GetListsInput struct {
	UserId    string
	ProjectId string
}

type GetPrivateListInput struct {
	UserId string
}

type GetListByIdInput struct {
	UserId string
	ListId string
}

// type GetListByIdOutput struct {
// 	Id        string    `json:"id"`
// 	Name      string    `json:"name"`
// 	CreatedBy string    `json:"createdBy"`
// 	ProjectId string    `json:"projectId"`
// 	CreatedAt time.Time `json:"createdAt"`
// 	IsPrivate bool      `json:"isPrivate"`
// }

type List struct {
	Id        string    `json:"id"`
	Name      string    `json:"name"`
	CreatedBy string    `json:"createdBy"`
	ProjectId string    `json:"projectId"`
	CreatedAt time.Time `json:"createdAt"`
	IsPrivate bool      `json:"isPrivate"`
}

type Api interface {
	// CreateList(ctx context.Context, params CreateInput) error
	// CreateAndGetList(ctx context.Context, params CreateInput) (List, error)
	// CreatePrivateList(ctx context.Context, params CreatePrivateInput) (List, error)
	// GetLists(ctx context.Context, params GetListsInput) ([]List, error)
	// GetPrivateList(ctx context.Context, params GetPrivateListInput) (List, error)
	// GetListById(ctx context.Context, params GetListByIdInput) (List, error)
}
