package main

import (
	"context"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/udovichenk0/scheduler/config"
	"github.com/udovichenk0/scheduler/internal/adapters/db"
	"github.com/udovichenk0/scheduler/internal/adapters/rest"
	"github.com/udovichenk0/scheduler/internal/adapters/smtp"
	"github.com/udovichenk0/scheduler/internal/services/auth"
	"github.com/udovichenk0/scheduler/internal/services/project"
	"github.com/udovichenk0/scheduler/internal/services/task"
	"github.com/udovichenk0/scheduler/internal/services/user"
	"github.com/udovichenk0/scheduler/internal/services/verification"
	log "github.com/udovichenk0/scheduler/pkg/logger"
	"github.com/udovichenk0/scheduler/pkg/sessionmanager"
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
		// services
		auth.Provide(),
		project.Provide(),
		task.Provide(),
		user.Provide(),
		verification.Provide(),
		//rest
		Provide(),
		rest.Provide(),
	).
		InitTimeout(time.Second).        // Set the timeout for the initialization phase.
		HealthCheckTimeout(time.Second). // Set the timeout for the health check phase.
		ShutdownTimeout(5 * time.Second) // Set the timeout for the shutdown phase.

	err := p.Run(context.Background())
	if err != nil {
		fmt.Println(err.Error())
	}
}
