#!/bin/sh

# Drop existing postgres container (and remove volume it created)
PGVERSION=9.6.5
docker rm -fv umbrella-db-postgres-$PGVERSION

# Run postgres:$PGVERSION in daemon mode, expose port 5432
docker run --name umbrella-db-postgres-$PGVERSION -p 5432:5432 -e POSTGRES_PASSWORD=root -e POSTGRES_USER=postgres -d -e POSTGRES_DB=umbrella-db postgres:$PGVERSION
