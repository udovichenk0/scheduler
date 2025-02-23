package main

import (
	"context"
	"log/slog"

	"github.com/bytedance/sonic"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	"github.com/udovichenk0/scheduler/config"
	"github.com/udovichenk0/scheduler/internal/adapters/db"
	"github.com/udovichenk0/scheduler/internal/adapters/rest"
	"github.com/udovichenk0/scheduler/internal/adapters/smtp"
	userPort "github.com/udovichenk0/scheduler/internal/ports/repository/user"
	"github.com/udovichenk0/scheduler/internal/services/auth"
	"github.com/udovichenk0/scheduler/internal/services/task"
	"github.com/udovichenk0/scheduler/internal/services/user"
	"github.com/udovichenk0/scheduler/internal/services/verification"
	"github.com/udovichenk0/scheduler/pkg"
	"github.com/udovichenk0/scheduler/pkg/errs"
	log "github.com/udovichenk0/scheduler/pkg/logger"
	session_manager "github.com/udovichenk0/scheduler/pkg/session-manager"
)

func main() {
	godotenv.Load()
	log := log.NewLogger()
	appConfig := config.CreateConfig()
	db := db.New(db.Opts{
		User: appConfig.Db.User,
		Pass: appConfig.Db.Pass,
		Host: appConfig.Db.Host,
		Port: appConfig.Db.Port,
		Name: appConfig.Db.Name,
	})
	smtp := smtp.New(appConfig.Smtp)

	app := fiber.New(fiber.Config{
		JSONEncoder: sonic.Marshal,
		JSONDecoder: sonic.Unmarshal,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			e := errs.HandleError(err)
			log.Error(err.Error(), slog.Int("status", e.Status), slog.String("method", c.Method()))
			return c.Status(e.Status).JSON(e)
		},
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins:     config.GetEnv("CLIENT_URL"),
		AllowMethods:     "GET,DELETE,POST,PUT,PATCH",
		AllowHeaders:     "Content-Type",
		AllowCredentials: true,
	}))

	app.Use(logger.New(logger.Config{
		Format: "${time} | ${status} | ${method} | ${path}\n",
	}))

	app.Use(recover.New())

	deps := NewDeps(db, appConfig, smtp, log)
	v := pkg.NewValidator()

	handler := rest.NewHandler(deps.GetDeps(), app, appConfig, v)

	handler.Run()

	err := app.Listen(":3000")

	if err != nil {
		log.Error("Fatal error occured: %s", err.Error())
	}
}

type Deps struct {
	db        db.Adapter
	appConfig *config.Config
	smtp      smtp.Service
	log       log.Logger
}

func NewDeps(dbAdapter db.Adapter, appConfig *config.Config, smtp smtp.Service, log log.Logger) *Deps {
	return &Deps{dbAdapter, appConfig, smtp, log}
}

func (s Deps) GetDeps() *rest.Deps {
	sm := session_manager.New(s.db.Pool)
	taskRepo := db.NewTaskRepo(s.db.Pool)
	userRepo := db.NewUserRepo(s.db.Pool)
	userRepo.Update(context.Background(), userPort.UpdateInput{Email: "test"})
	verificationRepo := db.NewVerificationRepo(s.db.Pool)
	taskService := task.New(taskRepo, s.log)
	userService := user.New(userRepo, s.log)
	smtpService := smtp.New(s.appConfig.Smtp)
	verificationService := verification.New(verificationRepo, userService, smtpService)
	authService := auth.New(userService, smtpService, verificationService, s.db.Pool, sm, s.log)

	return &rest.Deps{
		Task:         taskService,
		Auth:         authService,
		User:         userService,
		Verification: verificationService,
		Sm:           sm,
	}
}
