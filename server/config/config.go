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
	envPath := filepath.Join(".env")
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
		URL:    GetEnv("DATABASE_URL", "", true),
		Driver: "mysql",
	}
}

func createSmtpConfig() SmtpConfig {
	return SmtpConfig{
		Host:     GetEnv("SMTP_HOST", "", true),
		Port:     GetEnv("SMTP_PORT", "", true),
		Password: GetEnv("SMTP_PASSWORD", "", true),
		From:     GetEnv("SMTP_FROM", "", true),
	}
}

func New() *Config {
	envPath := filepath.Join(".env")
	godotenv.Load(envPath)
	return &Config{
		Db:   createDbOptions(),
		Smtp: createSmtpConfig(),
		Env:  GetEnv("ENV", "PROD", false),
	}
}

func NewWithPath(path string) Config {
	godotenv.Load(path)
	return Config{
		Db:   createDbOptions(),
		Smtp: createSmtpConfig(),
		Env:  GetEnv("ENV", "", false),
	}
}

func GetEnv(env, d string, required bool) string {
	value, ok := os.LookupEnv(env)
	if required && (!ok || value == "") {
		log.Fatalf("Env %s is required", env)
		return ""
	}

	if !ok {
		log.Fatalf("No env with name %s provided", env)
		return ""
	}
	return value
}
