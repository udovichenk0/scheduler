package session_manager

import (
	"time"

	"github.com/udovichenk0/scheduler/pkg"
)

type Session struct {
	Id        string `db:"id"`
	Data      []byte `db:"data"`
	ExpiresAt int64  `db:"expires_at"`
}

func NewSession(data []byte) Session {
	return Session{
		Id:        generateSessionId(),
		Data:      data,
		ExpiresAt: getSessionExpirationTime(),
	}
}

func (s Session) IsExpired() bool {
	return time.Now().After(time.Unix(s.ExpiresAt, 0))
}

func generateSessionId() string {
	return pkg.NewUUID()
}

func getSessionExpirationTime() int64 {
	return time.Now().Add(time.Hour * 24 * 30).Unix()
}
