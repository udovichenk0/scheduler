package main

import (
	"context"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/udovichenk0/scheduler/app"
	"github.com/udovichenk0/scheduler/config"
	"github.com/udovichenk0/scheduler/internal/adapters/db"
	"github.com/udovichenk0/scheduler/internal/adapters/rest"
	"github.com/udovichenk0/scheduler/internal/adapters/smtp"
	"github.com/udovichenk0/scheduler/internal/adapters/sse"
	authservice "github.com/udovichenk0/scheduler/internal/services/auth"
	projectservice "github.com/udovichenk0/scheduler/internal/services/project"
	taskservice "github.com/udovichenk0/scheduler/internal/services/task"
	userservice "github.com/udovichenk0/scheduler/internal/services/user"
	verificationservice "github.com/udovichenk0/scheduler/internal/services/verification"
	log "github.com/udovichenk0/scheduler/pkg/logger"
	"github.com/udovichenk0/scheduler/pkg/sessionmanager"
	ssebroker "github.com/udovichenk0/scheduler/pkg/sse-broker"
	validator "github.com/udovichenk0/scheduler/pkg/validation"
	"github.com/zhulik/pal"
)

func main() {
	p := pal.New(
		log.Provide(),
		config.Provide(),
		db.Provide(),
		smtp.Provide(),
		sessionmanager.Provide(),
		validator.Provide(),
		ssebroker.Provide(),
		// services
		authservice.Provide(),
		projectservice.Provide(),
		taskservice.Provide(),
		userservice.Provide(),
		verificationservice.Provide(),
		//app
		app.Provide(),
		//handlers
		rest.Provide(),
		sse.Provide(),
	).
		InitTimeout(time.Second).         // Set the timeout for the initialization phase.
		HealthCheckTimeout(time.Second).  // Set the timeout for the health check phase.
		ShutdownTimeout(20 * time.Second) // Set the timeout for the shutdown phase.

	err := p.Run(context.Background())
	if err != nil {
		fmt.Println(err.Error())
	}
}
