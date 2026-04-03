package logger

import (
	"context"
	"io"
	"log/slog"
	"os"

	"github.com/rs/zerolog"
	slogzerolog "github.com/samber/slog-zerolog/v2"
	"github.com/udovichenk0/scheduler/config"
	"github.com/zhulik/pal"
)

type Logger struct {
	logger *slog.Logger
	Config *config.Config
}

type ILogger interface {
	Info(msg string, args ...any)
	Debug(msg string, args ...any)
	Error(msg string, args ...any)
	Warn(msg string, args ...any)
}

func (l *Logger) Info(msg string, args ...any) {
	l.logger.Info(msg, args...)
}
func (l *Logger) Debug(msg string, args ...any) {
	l.logger.Debug(msg, args...)
}
func (l *Logger) Error(msg string, args ...any) {

	l.logger.Error(msg, args...)
}
func (l *Logger) Warn(msg string, args ...any) {
	l.logger.Warn(msg, args...)
}

func NewLogger() ILogger {
	env := config.GetEnv("ENV", "", true)
	var logWriter io.Writer
	if env == "PROD" {
		logWriter = os.Stderr
	} else {
		logWriter = zerolog.ConsoleWriter{Out: os.Stdout}
	}

	zerologLogger := zerolog.New(logWriter).With().Timestamp().Logger()
	return slog.New(slogzerolog.Option{Logger: &zerologLogger}.NewZerologHandler())
}

func (l *Logger) Init(_ context.Context) error {
	env := l.Config.Env
	var logWriter io.Writer
	if env == "PROD" {
		logWriter = os.Stderr
	} else {
		logWriter = zerolog.ConsoleWriter{Out: os.Stdout}
	}

	zerologLogger := zerolog.New(logWriter).With().Timestamp().Logger()
	l.logger = slog.New(slogzerolog.Option{Logger: &zerologLogger}.NewZerologHandler())
	return nil
}

func Provide() pal.ServiceDef {
	return pal.Provide[ILogger](&Logger{})
}
