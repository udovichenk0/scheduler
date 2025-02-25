package config

import (
	"log"
	"os"

	smtpservice "github.com/udovichenk0/scheduler/internal/ports/api/smtp"
)

type DBConfig struct {
	Name string
	Pass string
	User string
	Host string
	Port string
}
type Config struct {
	Db   DBConfig
	Smtp smtpservice.SmtpConfig
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

func createSmtpConfig() smtpservice.SmtpConfig {

	return smtpservice.SmtpConfig{
		Host:     GetEnv("SMTP_HOST"),
		Port:     GetEnv("SMTP_PORT"),
		Password: GetEnv("SMTP_PASSWORD"),
		From:     GetEnv("SMTP_FROM"),
	}
}

func CreateConfig() *Config {
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
