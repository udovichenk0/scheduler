package model

type Verification struct {
	Id        string `db:"id"`
	Code      string `db:"code"`
	UserId    string `db:"user_id"`
	ExpiresAt int64  `db:"expires_at"`
}
