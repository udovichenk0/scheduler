package config

import (
	"context"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	"github.com/zhulik/pal"
)

type SmtpConfig struct {
	Host     string
	Password string
	Port     string
	From     string
}

type DBConfig struct {
	URL    string
	Driver string
}
type Config struct {
	Db   DBConfig
	Smtp SmtpConfig
	Env  string
}

func (c *Config) Init(_ context.Context) error {
	envPath := filepath.Join("..", "..", ".env")
	config := NewWithPath(envPath)
	c.Db = config.Db
	c.Smtp = config.Smtp
	return nil
}

func Provide() pal.ServiceDef {
	return pal.Provide(&Config{})
}

func createDbOptions() DBConfig {
	return DBConfig{
		URL:    GetEnv("DATABASE_URL"),
		Driver: "mysql",
	}
}

func createSmtpConfig() SmtpConfig {
	return SmtpConfig{
		Host:     GetEnv("SMTP_HOST"),
		Port:     GetEnv("SMTP_PORT"),
		Password: GetEnv("SMTP_PASSWORD"),
		From:     GetEnv("SMTP_FROM"),
	}
}

func New() *Config {
	envPath := filepath.Join("..", ".env")
	godotenv.Load(envPath)
	return &Config{
		Db:   createDbOptions(),
		Smtp: createSmtpConfig(),
	}
}

func NewWithPath(path string) Config {
	godotenv.Load(path)
	return Config{
		Db:   createDbOptions(),
		Smtp: createSmtpConfig(),
		Env:  GetEnv("ENV"),
	}
}

func GetEnv(env string) string {
	value, ok := os.LookupEnv(env)

	if !ok {
		log.Fatalf("No env with name %s provided", env)
		return ""
	}
	return value
}
