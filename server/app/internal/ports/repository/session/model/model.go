package model

type Session struct {
	Id        string `json:"id"`
	UserId    string `json:"user_id"`
	ExpiresAt int64  `json:"expires_at"`
}

var Nil = Session{}
