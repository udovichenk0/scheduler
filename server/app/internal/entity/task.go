package entity

import (
	"errors"
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
	CreatedAt   string     `json:"date_created"`
	IsTrashed   bool       `json:"is_trashed"`
	Priority    Priority   `json:"priority"`
}

func IsValidTaskTypeAndStartTime(taskType TaskType, date int64) (bool, error) {
	switch taskType {
	case Inbox:
		if date == 0 {
			return true, nil
		}
		return false, errors.New("can't create inbox task with a date specified")
	case Unplaced:
		if date > 0 {
			return true, nil
		}
		return false, errors.New("can't create unplaced task with no date")
	default:
		return true, nil
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

func IsValidateDateRange(startDate, dueDate int64) bool {
	if startDate != 0 && dueDate != 0 {
		return startDate <= dueDate
	}
	return true
}
