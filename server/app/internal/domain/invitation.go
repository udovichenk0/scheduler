package domain

import (
	"errors"
	"time"

	"github.com/udovichenk0/scheduler/pkg/errs"
)

var (
	ErrAlreadyAccepted   = errors.New("This user is already part of the project")
	ErrPendingInvitation = errors.New("An invitation for this user is already pending")
)

type Invitation struct {
	Id         string
	ProjectId  string
	InviterId  string
	InviteeId  string
	Status     uint8
	InvitedAt  string
	AcceptedAt *time.Time
	DeclinedAt *time.Time
}

func (i *Invitation) IsPending() bool {
	return i.Status == 0
}

func (i *Invitation) IsAccepted() bool {
	return i.Status == 1
}

func (i *Invitation) IsDeclined() bool {
	return i.Status == 2
}

func (i *Invitation) CanInvite(inviterId string) error {
	if i.Id != "" {
		if i.IsAccepted() {
			return errs.NewBadRequestError(errors.New("This user is already part of the project"))
		}
		if i.IsPending() && i.InviterId == inviterId {
			return errors.New("An invitation for this user is already pending")
		}
	}
	return nil
}
