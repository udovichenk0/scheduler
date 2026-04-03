package domain

import (
	"errors"
	"fmt"
	"time"

	"github.com/udovichenk0/scheduler/pkg"
)

type TaskType string
type TaskStatus string
type TaskPriority string

const (
	Inbox    TaskType = "inbox"
	Unplaced TaskType = "unplaced"
)

const (
	Finished   TaskStatus = "finished"
	ToDo       TaskStatus = "todo"
	Inprogress TaskStatus = "inprogress"
)

const (
	None   TaskPriority = "none"
	Low    TaskPriority = "low"
	Normal TaskPriority = "normal"
	High   TaskPriority = "high"
	Urgent TaskPriority = "urgent"
)

type Task struct {
	Id          string
	Title       string
	Description string
	Type        TaskType
	Status      TaskStatus
	StartDate   *time.Time
	DueDate     *time.Time
	UserId      string
	ListId      string
	CreatedAt   time.Time
	IsTrashed   bool
	Priority    TaskPriority
}

type CreateTaskInput struct {
	Title       string
	Description string
	Type        string
	Status      string
	StartDate   *time.Time
	DueDate     *time.Time
	UserId      string
	ListId      string
	Priority    string
}

type UpdateTaskInput struct {
	Title       *string
	Description *string
	Type        *string
	Status      *string
	StartDate   **time.Time
	DueDate     **time.Time
	ListId      *string
	Priority    *string
}

var (
	ErrTitleRequired       = errors.New("task title is required")
	ErrInvalidDateRange    = errors.New("due date must be after start date")
	ErrInvalidTaskType     = errors.New("invalid task type")
	ErrInvalidTaskStatus   = errors.New("invalid task status")
	ErrInvalidTaskPriority = errors.New("invalid task priority")
)

func NewTask(input CreateTaskInput) (Task, error) {
	if input.Title == "" {
		return Task{}, ErrTitleRequired
	}

	if err := ValidateDateRange(input.StartDate, input.DueDate); err != nil {
		return Task{}, err
	}

	if !IsValidType(input.Type) {
		return Task{}, ErrInvalidTaskType
	}

	if !IsValidStatus(input.Status) {
		return Task{}, ErrInvalidTaskStatus
	}

	if !IsValidPriority(input.Priority) {
		return Task{}, ErrInvalidTaskPriority
	}

	return Task{
		Id:          pkg.NewUUID(),
		Title:       input.Title,
		Description: input.Description,
		Type:        TaskType(input.Type),
		Status:      TaskStatus(input.Status),
		StartDate:   input.StartDate,
		DueDate:     input.DueDate,
		UserId:      input.UserId,
		ListId:      input.ListId,
		CreatedAt:   time.Now().UTC(),
		IsTrashed:   false,
		Priority:    TaskPriority(input.Priority),
	}, nil
}

func (t Task) ApplyChanges(input UpdateTaskInput) error {
	if input.Title != nil {
		if *input.Title == "" {
			return ErrTitleRequired
		}
		t.Title = *input.Title
	}

	if input.Description != nil {
		t.Description = *input.Description
	}

	if input.Type != nil {
		if !IsValidType(*input.Type) {
			return ErrInvalidTaskType
		}
		t.Type = TaskType(*input.Type)
	}

	if input.Status != nil {
		if !IsValidStatus(*input.Status) {
			return ErrInvalidTaskStatus
		}
		t.Status = TaskStatus(*input.Status)
	}

	if input.Priority != nil {
		if !IsValidPriority(*input.Priority) {
			return ErrInvalidTaskPriority
		}
		t.Priority = TaskPriority(*input.Priority)
	}

	if input.StartDate != nil {
		t.StartDate = *input.StartDate
	}

	if input.DueDate != nil {
		t.DueDate = *input.DueDate
	}

	if err := ValidateDateRange(t.StartDate, t.DueDate); err != nil {
		return err
	}

	// if input.AssigneeID != nil {
	// 	t.AssigneeID = *input.AssigneeID
	// }

	// t.UpdatedAt = time.Now()
	// t.Version++

	return nil
}

func ValidateTypeAndDate(taskType TaskType, start, end *time.Time) error {
	hasStartDate := start.IsZero()
	hasDueDate := end.IsZero()
	switch taskType {
	case Inbox:
		if hasStartDate && hasDueDate {
			return nil
		}
		return errors.New("can't create inbox task with a date specified")
	case Unplaced:
		if !hasStartDate || !hasDueDate {
			return nil
		}
		return errors.New("can't create unplaced task with no date")
	default:
		return nil
	}
}

/*
*

	inbox date -> unplaced
	inbox nodate -> inbox
	unplaced date -> unplaced
	unplaced nodate -> inbox

*
*/
func ChangeTypeBasedOnDate(date time.Time, taskType TaskType) TaskType {
	if taskType.IsInbox() && !date.IsZero() {
		return Unplaced
	} else if taskType.IsUnplaced() && date.IsZero() {
		return Inbox
	}
	return taskType
}

func ValidateDateRange(startDate, dueDate *time.Time) error {
	if startDate == nil || dueDate == nil {
		return nil
	}
	if !startDate.IsZero() && !dueDate.IsZero() {
		if startDate.After(*dueDate) {
			return fmt.Errorf("%w: startDate: %s can't be greater than dueDate: %s", ErrInvalidDateRange, startDate.String(), dueDate.String())
		}
	}
	return nil
}

func (t TaskType) IsInbox() bool {
	return t == Inbox
}

func (t TaskType) IsUnplaced() bool {
	return t == Unplaced
}

func IsValidType(rawtype string) bool {
	switch rawtype {
	case string(Inbox), string(Unplaced):
		return true
	default:
		return false
	}
}

func IsValidStatus(rawstatus string) bool {
	switch rawstatus {
	case string(Finished),
		string(ToDo),
		string(Inprogress):
		return true
	default:
		return false
	}
}

func IsValidPriority(rawpriority string) bool {
	switch rawpriority {
	case string(None),
		string(Low),
		string(Normal),
		string(High),
		string(Urgent):
		return true
	default:
		return false
	}
}
