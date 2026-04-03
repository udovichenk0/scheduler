package model

import "database/sql"

type Invitation struct {
	Id         string       `db:"id"`
	ProjectId  string       `db:"project_id"`
	InviterId  string       `db:"inviter_id"`
	InviteeId  string       `db:"invitee_id"`
	Status     uint8        `db:"status"`
	InvitedAt  string       `db:"invited_at"`
	AcceptedAt sql.NullTime `db:"accepted_at"`
	DeclinedAt sql.NullTime `db:"declined_at"`
}

var Nil = Invitation{}
