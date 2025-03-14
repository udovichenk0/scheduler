module github.com/udovichenk0/scheduler/migrations

go 1.24.1

replace github.com/udovichenk0/scheduler/config => ../config

require (
	github.com/go-sql-driver/mysql v1.9.0
	github.com/pressly/goose/v3 v3.24.1
	github.com/udovichenk0/scheduler/config v0.0.0-00010101000000-000000000000
)

require (
	filippo.io/edwards25519 v1.1.0 // indirect
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/mfridman/interpolate v0.0.2 // indirect
	github.com/sethvargo/go-retry v0.3.0 // indirect
	go.uber.org/multierr v1.11.0 // indirect
	golang.org/x/sync v0.12.0 // indirect
)
