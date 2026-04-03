package taskservice

import (
	"github.com/udovichenk0/scheduler/internal/domain"
	taskserviceport "github.com/udovichenk0/scheduler/internal/ports/api/task"
)

func taskToDto(entity domain.Task) taskserviceport.Task {
	return taskserviceport.Task{
		Id:          entity.Id,
		Title:       entity.Title,
		Description: entity.Description,
		Type:        taskserviceport.TaskType(entity.Type),
		Status:      taskserviceport.TaskStatus(entity.Status),
		StartDate:   entity.StartDate,
		DueDate:     entity.DueDate,
		UserId:      entity.UserId,
		ListId:      entity.ListId,
		CreatedAt:   entity.CreatedAt,
		IsTrashed:   entity.IsTrashed,
		Priority:    taskserviceport.Priority(entity.Priority),
	}
}

func tasksToDto(entities []domain.Task) []taskserviceport.Task {
	domainTasks := []taskserviceport.Task{}
	for _, task := range entities {
		domainTasks = append(domainTasks, taskToDto(task))
	}
	return domainTasks
}
