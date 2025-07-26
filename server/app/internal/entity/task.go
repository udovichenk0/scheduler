package entity

import (
	"errors"
	"fmt"
)

type TaskType string
type TaskStatus string
type Priority string

const (
	Inbox    TaskType = "inbox"
	Unplaced TaskType = "unplaced"
)

const (
	Finished   TaskStatus = "finished"
	Canceled   TaskStatus = "canceled"
	Inprogress TaskStatus = "inprogress"
)

const (
	None   Priority = "none"
	Low    Priority = "low"
	Normal Priority = "normal"
	High   Priority = "high"
	Urgent Priority = "urgent"
)

type Task struct {
	Id          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Type        TaskType   `json:"type"`
	Status      TaskStatus `json:"status"`
	StartDate   int64      `json:"start_date"`
	DueDate     int64      `json:"due_date"`
	UserId      string     `json:"user_id"`
	ProjectId   string     `json:"project_id"`
	CreatedAt   string     `json:"date_created"`
	IsTrashed   bool       `json:"is_trashed"`
	Priority    Priority   `json:"priority"`
}

func ValidateTypeAndDate(taskType TaskType, start, end int64) error {
	switch taskType {
	case Inbox:
		if start == 0 && end == 0 {
			return nil
		}
		return errors.New("can't create inbox task with a date specified")
	case Unplaced:
		if start > 0 || end > 0 {
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
func ChangeTypeBasedOnDate(date int64, taskType TaskType) TaskType {
	if taskType == Inbox && date != 0 {
		return Unplaced
	} else if taskType == Unplaced && date == 0 {
		return Inbox
	}
	return taskType
}

func ValidateDateRange(startDate, dueDate int64) error {
	if startDate != 0 && dueDate != 0 {
		if startDate > dueDate {
			return fmt.Errorf("startDate: %d can't be greater than dueDate: %d", startDate, dueDate)
		}
	}
	return nil
}
