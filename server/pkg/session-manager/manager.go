package session_manager

import (
	"bytes"
	"context"
	"encoding/gob"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	"github.com/udovichenk0/scheduler/pkg/errs"
)

type contextKey string

var ctxKey contextKey = "context_key"

type SessionManager struct {
	db     *sqlx.DB
	ctxKey contextKey
}

func New(db *sqlx.DB) SessionManager {
	m := SessionManager{db, ctxKey}
	go m.startCleanup()
	return m
}

func (m *SessionManager) startCleanup() {
	ticker := time.NewTicker(time.Minute * 10)
	defer ticker.Stop()
	done := make(chan bool)

	for {
		select {
		case <-done:
			return
		case <-ticker.C:
			err := m.deleteExpiry()
			if err != nil {
				log.Println("Failed to delete expiry sessions")
			}
		}
	}
}

func (s *SessionManager) Protected(fn fiber.Handler) fiber.Handler {
	return func(fc *fiber.Ctx) error {
		sessionId := fc.Cookies("sessionId")

		ctx, err := s.Load(fc.Context(), sessionId)

		if err != nil {
			return err
		}

		fc.SetUserContext(ctx)

		err = fn(fc)

		if err != nil {
			return err
		}

		return nil
	}
}

func (s *SessionManager) Load(ctx context.Context, sessionId string) (context.Context, error) {
	if sessionId == "" {
		return ctx, errs.NewUnauthorizedError()
	}

	session, err := s.Find(sessionId)

	if err != nil {
		return ctx, errs.NewInternalError(err)
	}

	m, err := s.Decode(session.Data)

	if err != nil {
		return ctx, errs.NewUnauthorizedError()
	}

	return context.WithValue(ctx, s.ctxKey, m), nil
}

func (s *SessionManager) deleteExpiry() error {
	_, err := s.db.Exec("DELETE FROM session WHERE expires_at < NOW()")
	return err
}

func (s *SessionManager) Delete(sessionId string) error {
	_, err := s.db.Exec("DELETE FROM session WHERE id = ?", sessionId)
	return err
}

func (s *SessionManager) Find(sessionId string) (Session, error) {
	session := Session{}
	err := s.db.Get(&session, "SELECT id, data, UNIX_TIMESTAMP(expires_at) as expires_at FROM session WHERE id = ? AND expires_at > NOW()", sessionId)
	if err != nil {
		return session, err
	}
	return session, nil
}

func (s *SessionManager) Commit(key string, val interface{}) (Session, error) {
	var b bytes.Buffer
	m := map[string]interface{}{
		key: val,
	}
	err := gob.NewEncoder(&b).Encode(m)

	if err != nil {
		return Session{}, err
	}

	session := NewSession(b.Bytes())

	_, err = s.db.Exec("INSERT INTO session (id, data, expires_at) VALUES(?,?,FROM_UNIXTIME(?))", session.Id, session.Data, session.ExpiresAt)

	if err != nil {
		return Session{}, err
	}

	return session, nil
}

func (s *SessionManager) Get(ctx context.Context, key string) any {
	data, ok := ctx.Value(s.ctxKey).(map[string]interface{})

	if !ok {
		panic("no session data in context")
	}

	return data[key]
}

func (s *SessionManager) PersistToCookie(ctx *fiber.Ctx, session Session) {
	ctx.Cookie(&fiber.Cookie{
		Name:     "sessionId",
		Value:    session.Id,
		Expires:  time.UnixMilli(session.ExpiresAt * 1000),
		HTTPOnly: true,
	})
}

func (s *SessionManager) ClearSessionFromCookie(ctx *fiber.Ctx) {
	ctx.Cookie(&fiber.Cookie{
		Name:     "sessionId",
		Value:    "",
		Expires:  time.UnixMilli(0),
		HTTPOnly: true,
	})
}

func (s *SessionManager) Decode(data []byte) (map[string]interface{}, error) {
	output := map[string]interface{}{}
	readBuf := bytes.NewBuffer(data)

	err := gob.NewDecoder(readBuf).Decode(&output)
	if err != nil {
		return nil, err
	}

	return output, nil
}
