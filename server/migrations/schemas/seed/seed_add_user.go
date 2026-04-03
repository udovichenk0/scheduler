package seed

import (
	"context"
	"database/sql"
	"errors"
	"sync"

	"github.com/gofiber/fiber/v2/log"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

const (
	seedUserEmail1 = "test-email@gmail.com"
	seedUserEmail2 = "test-email2@gmail.com"
)

const default_pass = "qwertyqwerty"

type User struct {
	email    string
	password string
}

func Seed(ctx context.Context, db *sql.DB) {
	users := []User{
		{email: seedUserEmail1, password: default_pass},
		{email: seedUserEmail2, password: default_pass},
	}
	wg := new(sync.WaitGroup)
	for _, user := range users {
		wg.Go(func() {
			tx, err := db.BeginTx(ctx, nil)
			if err != nil {
				log.Errorf("failed to create transaction: %w", err)
				_ = tx.Rollback()
			}
			userId, err := seedUser(ctx, tx, user)
			if err != nil {
				log.Errorf("Failed to create user. Email: %s, Password: %s, Err: %w", user.email, user.password, err)
				_ = tx.Rollback()
			}

			projectId, err := createPrivateProject(ctx, tx, userId)
			if err != nil {
				log.Errorf("Failed to create project. Err: %w", err)
				_ = tx.Rollback()
			}

			err = createPrivateList(ctx, tx, userId, projectId)
			if err != nil {
				log.Errorf("Failed to create list. Err: %w", err)
				_ = tx.Rollback()
			}
			tx.Commit()
		})
	}
	wg.Wait()
}

type CreateUserInput struct {
	Email    string
	Password string
}

var ErrUserExists = errors.New("User exists")
var ErrProjectExists = errors.New("Project exists")

func seedUser(ctx context.Context, tx *sql.Tx, params User) (string, error) {
	userId, exists, err := getUserByEmail(ctx, tx, params.email)
	if err != nil {
		return "", err
	}
	if exists {
		return userId, ErrUserExists
	}

	id := uuid.New().String()
	hash, err := bcrypt.GenerateFromPassword([]byte(params.password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	_, err = tx.ExecContext(ctx, "INSERT INTO user (id, email, hash, verified) VALUES(?,?,?,?)", id, params.email, hash, true)
	if err != nil {
		return "", err
	}

	return id, nil
}

func createPrivateList(ctx context.Context, tx *sql.Tx, userId, projectId string) error {
	var count int
	err := tx.QueryRowContext(
		ctx,
		"SELECT COUNT(*) FROM list WHERE created_by = ? AND is_private = ?",
		userId,
		true,
	).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	listId := uuid.New().String()
	_, err = tx.ExecContext(
		ctx,
		"INSERT INTO list (id, name, is_private, created_by, project_id) VALUES(?,?,?,?,?)",
		listId,
		"Private List",
		true,
		userId,
		projectId,
	)
	return err
}

func createPrivateProject(ctx context.Context, tx *sql.Tx, userId string) (string, error) {
	var count int
	err := tx.QueryRowContext(
		ctx,
		"SELECT COUNT(*) FROM project WHERE created_by = ? AND is_private = ?",
		userId,
		true,
	).Scan(&count)
	if err != nil {
		return "", err
	}
	if count > 0 {
		log.Errorf("Private project already exists UserId: %s", userId)
		return "", ErrProjectExists
	}
	projectId := uuid.New().String()
	_, err = tx.ExecContext(
		ctx,
		"INSERT INTO project (id, name, is_private, created_by) VALUES(?,?,?,?)",
		projectId,
		"Private Project",
		true,
		userId,
	)
	if err != nil {
		return "", err
	}
	return projectId, nil
}

func getUserByEmail(ctx context.Context, tx *sql.Tx, email string) (string, bool, error) {
	var userId string
	err := tx.QueryRowContext(ctx, "SELECT id FROM user WHERE email = ?", email).Scan(&userId)
	if err == sql.ErrNoRows {
		return "", false, nil
	}
	if err != nil {
		return "", false, err
	}

	return userId, true, nil
}
