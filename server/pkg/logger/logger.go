package logger

import (
	"io"
	"log/slog"
	"os"

	"github.com/rs/zerolog"
	slogzerolog "github.com/samber/slog-zerolog/v2"
	"github.com/udovichenk0/scheduler/config"
)

type Logger interface {
	Info(msg string, args ...any)
	Debug(msg string, args ...any)
	Error(msg string, args ...any)
	Warn(msg string, args ...any)
}

func NewLogger() Logger {
	env := config.GetEnv("ENV")
	var logWriter io.Writer
	if env == "PROD" {
		logWriter = os.Stderr
	} else {
		logWriter = zerolog.ConsoleWriter{Out: os.Stderr}
	}

	zerologLogger := zerolog.New(logWriter).With().Timestamp().Logger()
	logger := slog.New(slogzerolog.Option{Logger: &zerologLogger}.NewZerologHandler())
	return logger
}
