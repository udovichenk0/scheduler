#!/bin/sh
export DATABASE_URL=$(cat /run/secrets/database_url)
exec "$@"