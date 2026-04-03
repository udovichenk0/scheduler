package domain

import (
	"errors"
	"time"

	"github.com/udovichenk0/scheduler/pkg"
)

var (
	ErrProjectNameRequired = errors.New("project name is required")
	ErrListNameRequired    = errors.New("list name is required")
)

type ProjectMembership struct {
	ProjectId string
	UserId    string
}

type List struct {
	Id        string
	Name      string
	CreatedBy string
	ProjectId string
	CreatedAt time.Time
	IsPrivate bool
}
type Project struct {
	Id                string
	Name              string
	CreatedBy         string
	Private           bool
	Lists             []List
	ProjectMembership []ProjectMembership
}
type CreateProjectInput struct {
	CreatedBy   string
	ProjectName string
	IsPrivate   bool
}

type CreateListInput struct {
	Name      string
	ProjectId string
	CreatedBy string
	Private   bool
}

func NewLists(input CreateListInput) ([]List, error) {
	list, err := NewList(input)
	if err != nil {
		return nil, err
	}
	return []List{list}, nil
}

func NewList(input CreateListInput) (List, error) {
	if input.Name == "" {
		return List{}, ErrListNameRequired
	}
	return List{
		Id:        pkg.NewUUID(),
		Name:      input.Name,
		ProjectId: input.ProjectId,
		IsPrivate: input.Private,
		CreatedBy: input.CreatedBy,
		CreatedAt: time.Now().UTC(),
	}, nil
}

func newProjectMembership(projectID, userID string) []ProjectMembership {
	return []ProjectMembership{
		{
			ProjectId: projectID,
			UserId:    userID,
		},
	}
}

const DEFAULT_LIST_NAME = "List"

func NewProject(input CreateProjectInput) (Project, error) {
	if input.ProjectName == "" {
		return Project{}, ErrProjectNameRequired
	}
	projectId := pkg.NewUUID()
	lists, err := NewLists(CreateListInput{
		Name:      DEFAULT_LIST_NAME,
		ProjectId: projectId,
		CreatedBy: input.CreatedBy,
		Private:   input.IsPrivate,
	})
	if err != nil {
		return Project{}, err
	}

	return Project{
		Id:                projectId,
		Name:              input.ProjectName,
		CreatedBy:         input.CreatedBy,
		Private:           input.IsPrivate,
		Lists:             lists,
		ProjectMembership: newProjectMembership(projectId, input.CreatedBy),
	}, nil
}
