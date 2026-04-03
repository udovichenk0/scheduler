package sessionmanager

import (
	"bytes"
	"context"
	"encoding/gob"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/udovichenk0/scheduler/internal/adapters/db"
	"github.com/udovichenk0/scheduler/pkg/errs"
	"github.com/zhulik/pal"
)

type contextKey string

var ctxKey contextKey = "context_key"

type ISessionManager interface {
	Protected(fiber.Handler) fiber.Handler
	ClearSessionFromCookie(ctx *fiber.Ctx)
	PersistToCookie(ctx *fiber.Ctx, session Session)
	Load(ctx context.Context, sessionId string) (context.Context, error)
	Find(ctx context.Context, sessionId string) (Session, error)
	Commit(ctx context.Context, key string, val any) (Session, error)
	Get(ctx context.Context, key string) any
	Decode(data []byte) (map[string]any, error)
	Delete(ctx context.Context, sessionId string) error
}

type SessionManager struct {
	*db.Sqlx
}

func (m SessionManager) Init(_ context.Context) error {
	go m.startCleanup()
	return nil
}

func (m SessionManager) startCleanup() {
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

func (m SessionManager) Protected(fn fiber.Handler) fiber.Handler {
	return func(fc *fiber.Ctx) error {
		sessionId := fc.Cookies("sessionId")

		ctx, err := m.Load(fc.Context(), sessionId)

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

func (m SessionManager) Load(ctx context.Context, sessionId string) (context.Context, error) {
	if sessionId == "" {
		return ctx, errs.NewUnauthorizedError()
	}

	session, err := m.Find(ctx, sessionId)

	if err != nil {
		return ctx, errs.NewInternalError(err)
	}

	data, err := m.Decode(session.Data)

	if err != nil {
		return ctx, errs.NewUnauthorizedError()
	}

	return context.WithValue(ctx, ctxKey, data), nil
}

func (m SessionManager) deleteExpiry() error {
	_, err := m.Pool.Exec("DELETE FROM session WHERE expires_at < NOW()")
	return err
}

func (m SessionManager) Delete(ctx context.Context, sessionId string) error {
	_, err := m.Pool.ExecContext(ctx, "DELETE FROM session WHERE id = ?", sessionId)
	return err
}

func (m SessionManager) Find(ctx context.Context, sessionId string) (Session, error) {
	session := Session{}
	err := m.Pool.GetContext(ctx, &session, "SELECT id, data, UNIX_TIMESTAMP(expires_at) as expires_at FROM session WHERE id = ? AND expires_at > NOW()", sessionId)
	if err != nil {
		return session, err
	}
	return session, nil
}

func (m SessionManager) Commit(ctx context.Context, key string, val any) (Session, error) {
	var b bytes.Buffer
	data := map[string]any{
		key: val,
	}
	err := gob.NewEncoder(&b).Encode(data)

	if err != nil {
		return Session{}, err
	}

	session := NewSession(b.Bytes())

	_, err = m.Pool.ExecContext(ctx, "INSERT INTO session (id, data, expires_at) VALUES(?,?,FROM_UNIXTIME(?))", session.Id, session.Data, session.ExpiresAt)

	if err != nil {
		return Session{}, err
	}

	return session, nil
}

func (SessionManager) Get(ctx context.Context, key string) any {
	data, ok := ctx.Value(ctxKey).(map[string]any)

	if !ok {
		panic("no session data in context")
	}

	return data[key]
}

func (*SessionManager) PersistToCookie(ctx *fiber.Ctx, session Session) {
	ctx.Cookie(&fiber.Cookie{
		Name:     "sessionId",
		Value:    session.Id,
		Expires:  time.UnixMilli(session.ExpiresAt * 1000),
		HTTPOnly: true,
	})
}

func (SessionManager) ClearSessionFromCookie(ctx *fiber.Ctx) {
	ctx.Cookie(&fiber.Cookie{
		Name:     "sessionId",
		Value:    "",
		Expires:  time.UnixMilli(0),
		HTTPOnly: true,
	})
}

func (SessionManager) Decode(data []byte) (map[string]any, error) {
	output := map[string]any{}
	readBuf := bytes.NewBuffer(data)

	err := gob.NewDecoder(readBuf).Decode(&output)
	if err != nil {
		return nil, err
	}

	return output, nil
}

func Provide() pal.ServiceDef {
	return pal.Provide[ISessionManager](&SessionManager{})
}
