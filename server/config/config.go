package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

type SmtpConfig struct {
	Host     string
	Password string
	Port     string
	From     string
}

type DBConfig struct {
	Name string
	Pass string
	User string
	Host string
	Port string
}
type Config struct {
	Db   DBConfig
	Smtp SmtpConfig
}

func createDbOptions() DBConfig {
	return DBConfig{
		Name: GetEnv("MYSQL_DATABASE"),
		Pass: GetEnv("MYSQL_PASSWORD"),
		User: GetEnv("MYSQL_USER"),
		Host: GetEnv("MYSQL_HOST"),
		Port: GetEnv("MYSQL_PORT"),
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

func NewWithPath(path string) *Config {
	godotenv.Load(path)
	return &Config{
		Db:   createDbOptions(),
		Smtp: createSmtpConfig(),
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
