package projectserviceport

import (
	"context"
	"time"
)

type Api interface {
	GetProjectById(context.Context, string) (Project, error)
	GetProjects(ctx context.Context, userId string) ([]Project, error)
	GetPrivateProjectByUserId(ctx context.Context, userId string) (ProjectWithList, error)
	CreateProjectWithDefaultList(ctx context.Context, params CreateProjectInput) (Project, error)
	IsMemberOfTheProject(ctx context.Context, projectId, userId string) (bool, error)
	CreatePrivateProject(ctx context.Context, params CreatePrivateProjectInput) error
	CreateList(ctx context.Context, input CreateListInput) (ProjectList, error)
}

type ProjectList struct {
	Id        string    `json:"id"`
	Name      string    `json:"name"`
	ProjectId string    `json:"projectId"`
	CreatedAt time.Time `json:"createdAt"`
	CreatedBy string    `json:"createdBy"`
	IsPrivate bool      `json:"isPrivate"`
}

type Project struct {
	Id        string        `json:"id"`
	Name      string        `json:"name"`
	CreatedBy string        `json:"createdBy"`
	IsPrivate bool          `json:"isPrivate"`
	Lists     []ProjectList `json:"lists"`
}

type ProjectWithList struct {
	Id        string      `json:"id"`
	Name      string      `json:"name"`
	CreatedBy string      `json:"createdBy"`
	IsPrivate bool        `json:"isPrivate"`
	List      ProjectList `json:"list"`
}

type CreateProjectInput struct {
	UserId string
	Name   string
}
type CreateListInput struct {
	Name      string
	UserId    string
	ProjectId string
}
type CreatePrivateProjectInput struct {
	UserId string
}
