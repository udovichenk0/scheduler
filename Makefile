APP_BUILD_DIR:=server/app/cmd
APP_BUILD_NAME:=main
APP_BINARY:=$(APP_BUILD_DIR)/$(APP_BUILD_NAME)

MIGRATION_BUILD_DIR:=server/migrations
MIGRATION_BUILD_NAME:=main
MIGRATION_BINARY:=$(MIGRATION_BUILD_DIR)/$(MIGRATION_BUILD_NAME)

FRONTEND_DIR:=client

COMPOSE_FILE:=docker-compose.dev.yaml
include .env
export
GOOSE_DRIVER := mysql
GOOSE_DBSTRING := $(DATABASE_URL)
MIGRATIONS_DIR := server/migrations/schemas/migrations

.PHONY: dev run-go frontend compose build-go clean migration full-clean remove-artifacts orval goose

dev : build-go
	$(MAKE) -j2 run-go frontend

run-go:
	$(APP_BINARY)

frontend:
	pnpm run -C $(FRONTEND_DIR) dev
compose:
	docker compose -f $(COMPOSE_FILE) up -d

build-go:
	go build -C $(APP_BUILD_DIR) -o $(APP_BUILD_NAME)

migration:
	go build -C $(MIGRATION_BUILD_DIR) -o main
	$(MIGRATION_BINARY)

orval:
	pnpm run -C $(FRONTEND_DIR) orval

full-clean:
	docker compose -f $(COMPOSE_FILE) down -v --rmi all
	$(MAKE) remove-artifacts

clean:
	docker compose -f $(COMPOSE_FILE) down
	$(MAKE) remove-artifacts

remove-artifacts:
	rm -f $(APP_BINARY) $(MIGRATION_BINARY)


# goose:
# 	goose -dir $(MIGRATIONS_DIR) $(filter-out $@,$(MAKECMDGOALS))

# goose-create:
# 	 goose -dir $(MIGRATIONS_DIR) create $(filter-out $@,$(MAKECMDGOALS)) sql
