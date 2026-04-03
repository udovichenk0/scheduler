package model

import "time"

type Verification struct {
	Id        string    `db:"id"`
	Code      string    `db:"code"`
	UserId    string    `db:"user_id"`
	ExpiresAt time.Time `db:"expires_at"`
}
