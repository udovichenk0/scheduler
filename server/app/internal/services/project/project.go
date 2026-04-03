package projectservice

import (
	"context"
	"database/sql"
	"errors"
	"log/slog"

	"github.com/udovichenk0/scheduler/internal/adapters/db"
	"github.com/udovichenk0/scheduler/internal/domain"
	listserviceport "github.com/udovichenk0/scheduler/internal/ports/api/list"
	projectserviceport "github.com/udovichenk0/scheduler/internal/ports/api/project"
	projectrepoport "github.com/udovichenk0/scheduler/internal/ports/repository/project"
	projectmembershiprepoport "github.com/udovichenk0/scheduler/internal/ports/repository/projectMembership"
	dbutils "github.com/udovichenk0/scheduler/pkg/db"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/udovichenk0/scheduler/pkg/logger"
	"github.com/zhulik/pal"
)

type Service struct {
	ProjectRepo       projectrepoport.Repository
	ProjectMembership projectmembershiprepoport.Repository
	List              listserviceport.Api
	Logger            logger.ILogger
	*db.Sqlx
}

func (s *Service) GetProjects(ctx context.Context, userId string) ([]projectserviceport.Project, error) {
	projects, err := s.ProjectRepo.FindManyFull(ctx, userId)
	if err != nil {
		s.Logger.Error("GetProjects.FindManyFull", slog.Any("err", err))
		return nil, errs.NewError(err, "failed to get projects")
	}

	return toDtos(projects), nil
}

func (s *Service) CreateProjectWithDefaultList(ctx context.Context, params projectserviceport.CreateProjectInput) (projectserviceport.Project, error) {
	project, err := domain.NewProject(domain.CreateProjectInput{
		CreatedBy:   params.UserId,
		ProjectName: params.Name,
		IsPrivate:   false,
	})
	if err != nil {
		return projectserviceport.Project{}, errs.NewBadRequestError(err)
	}

	err = dbutils.WithTransaction(ctx, s.Pool, func(ctx context.Context) error {
		err = s.ProjectRepo.CreateOne(ctx, project)
		if err != nil {
			return errs.NewError(err, "failed to create a project")
		}

		err = s.ProjectRepo.CreateList(ctx, project.Lists[0])
		if err != nil {
			return err
		}

		err = s.ProjectRepo.CreateMembership(ctx, domain.ProjectMembership{
			ProjectId: project.Id,
			UserId:    project.CreatedBy,
		})

		if err != nil {
			s.Logger.Error("failed to create project membership", slog.Any("err", err))
			return errs.NewError(err, "failed to created project membership")
		}
		return nil
	})

	if err != nil {
		return projectserviceport.Project{}, err
	}

	return toDto(project), nil
}

func (s *Service) CreatePrivateProject(ctx context.Context, input projectserviceport.CreatePrivateProjectInput) error {
	dbutils.WithTransaction(ctx, s.Pool, func(ctx context.Context) error {
		project, err := domain.NewProject(domain.CreateProjectInput{
			CreatedBy:   input.UserId,
			ProjectName: "Private Project",
			IsPrivate:   true,
		})
		if err != nil {
			return errs.NewBadRequestError(err)
		}

		err = s.ProjectRepo.CreateOne(ctx, project)
		if err != nil {
			return errs.NewError(err, "failed to create a project")
		}
		list, err := domain.NewList(domain.CreateListInput{
			Name:      "Private List",
			ProjectId: project.Id,
			CreatedBy: project.CreatedBy,
			Private:   true,
		})
		if err != nil {
			return errs.NewBadRequestError(err)
		}

		err = s.ProjectRepo.CreateList(ctx, list)
		if err != nil {
			s.Logger.Error("failed to create a list", slog.Any("err", err), slog.Any("list", list))
			return errs.NewError(err, "failed to create a list")
		}
		return nil
	})
	return nil
}

func (s *Service) GetProjectById(ctx context.Context, projectId string) (projectserviceport.Project, error) {
	project, err := s.ProjectRepo.FindByID(ctx, projectId)
	if err != nil {
		// if errors.Is(err, sql.ErrNoRows) {
		// 	return domain.Project{}, nil
		// }
		s.Logger.Error("Failed to get a project", slog.Any("err", err))
		return projectserviceport.Project{}, errs.NewError(err, "failed to get a project")
	}

	return toDto(project), nil
}

func (s *Service) GetPrivateProjectByUserId(ctx context.Context, userId string) (projectserviceport.ProjectWithList, error) {
	project, err := s.ProjectRepo.FindPrivateOneByUserId(ctx, userId)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			s.Logger.Error("No user's private project", slog.Any("err", err))
			return projectserviceport.ProjectWithList{}, errs.NewInternalError(err)
		}
		s.Logger.Error("Failed to get private project", slog.Any("err", err))
		return projectserviceport.ProjectWithList{}, errs.NewError(err, "Failed to get private project")
	}
	return projectserviceport.ProjectWithList{
		Id:        project.Id,
		Name:      project.Name,
		CreatedBy: project.CreatedBy,
		IsPrivate: project.Private,
		List:      toDtoList(project.Lists[0]),
	}, err
}

func (s *Service) IsMemberOfTheProject(ctx context.Context, projectId, userId string) (bool, error) {
	_, err := s.ProjectRepo.FindMembership(ctx, domain.ProjectMembership{
		ProjectId: projectId,
		UserId:    userId,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return false, nil
		}
		return false, errs.NewError(err, "Failed to get project membership")
	}
	return true, nil
}

func (s *Service) CreateList(ctx context.Context, input projectserviceport.CreateListInput) (projectserviceport.ProjectList, error) {
	list, err := domain.NewList(domain.CreateListInput{
		Name:      input.Name,
		ProjectId: input.ProjectId,
		CreatedBy: input.UserId,
		Private:   false,
	})
	if err != nil {
		return projectserviceport.ProjectList{}, errs.NewInternalError(err)
	}

	if err := s.ProjectRepo.CreateList(ctx, list); err != nil {
		s.Logger.Error("failed to create list", slog.Any("err", err))
		return projectserviceport.ProjectList{}, errs.NewError(err, "failed to create list")
	}

	return toDtoList(list), nil
}

func toDto(project domain.Project) projectserviceport.Project {
	p := projectserviceport.Project{
		Id:        project.Id,
		Name:      project.Name,
		CreatedBy: project.CreatedBy,
		IsPrivate: project.Private,
		Lists:     []projectserviceport.ProjectList{},
	}

	for _, l := range project.Lists {
		p.Lists = append(p.Lists, toDtoList(l))
	}
	return p
}

func toDtos(projects []domain.Project) []projectserviceport.Project {
	var dtos []projectserviceport.Project

	for _, project := range projects {
		dtos = append(dtos, toDto(project))
	}
	return dtos
}

func toDtoList(list domain.List) projectserviceport.ProjectList {
	return projectserviceport.ProjectList{
		Id:        list.Id,
		Name:      list.Name,
		ProjectId: list.ProjectId,
		CreatedAt: list.CreatedAt,
		IsPrivate: list.IsPrivate,
		CreatedBy: list.CreatedBy,
	}
}

func Provide() pal.ServiceDef {
	return pal.Provide[projectserviceport.Api](&Service{})
}
