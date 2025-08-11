package project

import (
	"context"

	"github.com/google/uuid"
	"github.com/udovichenk0/scheduler/internal/entity"
	"github.com/udovichenk0/scheduler/internal/ports/api/project"
	projectService "github.com/udovichenk0/scheduler/internal/ports/api/project"
	projectRepo "github.com/udovichenk0/scheduler/internal/ports/repository/project"
	"github.com/udovichenk0/scheduler/internal/ports/repository/project/model"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/zhulik/pal"
)

type Service struct {
	ProjectRepo projectRepo.Repository
}

func (s *Service) GetProjects(ctx context.Context, userId string) ([]entity.Project, error) {
	projects, err := s.ProjectRepo.GetByUserId(ctx, userId)
	if err != nil {
		return nil, errs.NewInternalError(err)
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
	err = s.ProjectRepo.Create(ctx, createProjectParams)
	if err != nil {
		return entity.Project{}, errs.NewError(err, "failed to create a project")
	}

	project, err := s.ProjectRepo.GetById(ctx, uuid.String())
	if err != nil {
		return entity.Project{}, errs.NewInternalError(err)
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

func Provide() pal.ServiceDef {
	return pal.Provide[project.Api](&Service{})
}
