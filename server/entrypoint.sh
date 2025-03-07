#!/bin/sh
export SMTP_FROM=$(cat /run/secrets/smtp_from)
export SMTP_PORT=$(cat /run/secrets/smtp_port)
export SMTP_PASSWORD=$(cat /run/secrets/smtp_password)
export SMTP_HOST=$(cat /run/secrets/smtp_host)

export DATABASE_URL=$(cat /run/secrets/database_url)

exec "$@"