package project

import (
	"context"

	"github.com/google/uuid"
	"github.com/udovichenk0/scheduler/internal/entity"
	projectService "github.com/udovichenk0/scheduler/internal/ports/api/project"
	projectRepo "github.com/udovichenk0/scheduler/internal/ports/repository/project"
	"github.com/udovichenk0/scheduler/internal/ports/repository/project/model"
	"github.com/udovichenk0/scheduler/pkg/errs"
)

type Service struct {
	projectRepo projectRepo.Port
}

func New(projectRepo projectRepo.Port) *Service {
	return &Service{projectRepo: projectRepo}
}

func (s *Service) GetProjects(ctx context.Context, userId string) ([]entity.Project, error) {
	projects, err := s.projectRepo.GetByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}
	var domainProjects []entity.Project
	for _, project := range projects {
		domainProjects = append(domainProjects, ToEntity(project))
	}
	return domainProjects, nil
}

func (s *Service) CreateProject(ctx context.Context, params projectService.CreateProject) (entity.Project, error) {
	uuid, err := uuid.NewRandom()
	if err != nil {
		return entity.Project{}, errs.NewInternalError(err)
	}

	createProjectParams := projectRepo.CreateInput{
		UserId:    params.UserId,
		Name:      params.Name,
		ProjectId: uuid.String(),
	}
	err = s.projectRepo.Create(ctx, createProjectParams)
	if err != nil {
		return entity.Project{}, err
	}

	project, err := s.projectRepo.GetById(ctx, uuid.String())

	if err != nil {
		return entity.Project{}, errs.CheckSqlError(err, "Project")
	}

	return ToEntity(project), nil
}

func ToEntity(project model.Project) entity.Project {
	return entity.Project{
		Id:        project.Id,
		Name:      project.Name,
		CreatedBy: project.CreatedBy,
	}
}
