package app

import (
	"context"
	"log/slog"

	"github.com/bytedance/sonic"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/udovichenk0/scheduler/config"
	"github.com/udovichenk0/scheduler/internal/adapters/rest"
	"github.com/udovichenk0/scheduler/pkg/errs"
	log "github.com/udovichenk0/scheduler/pkg/logger"
	"github.com/zhulik/pal"
)

type Server struct {
	Log  log.ILogger
	Rest *rest.Handler
	App  *fiber.App
}

func (s *Server) Init(_ context.Context) error {
	app := fiber.New(fiber.Config{
		JSONEncoder: sonic.Marshal,
		JSONDecoder: sonic.Unmarshal,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			e := errs.HandleError(err)
			s.Log.Error(err.Error(), slog.Int("status", e.Status), slog.String("method", c.Method()))
			return c.Status(e.Status).JSON(e)
		},
	})
	s.App = app
	app.Use(cors.New(cors.Config{
		AllowOrigins:     config.GetEnv("CLIENT_URL", "", true),
		AllowMethods:     "GET,DELETE,POST,PUT,PATCH",
		AllowHeaders:     "Content-Type",
		AllowCredentials: true,
	}))

	app.Use(logger.New(logger.Config{
		Format: "${time} | ${status} | ${method} | ${path}\n",
	}))

	app.Use(recover.New())

	s.Rest.InitHandlers(app)
	return nil
}

func (s *Server) Run(ctx context.Context) error {
	go func() {
		<-ctx.Done()
		s.App.Shutdown()
	}()

	if err := s.App.Listen(":3000"); err != nil {
		s.Log.Error("Fatal error occured: %s", err.Error())
	}
	return nil
}

func Provide() pal.ServiceDef {
	return pal.Provide(&Server{})
}
