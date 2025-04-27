#!/bin/bash

ENV_VAR_NAME=DATABASE_URL
ENV_VAR_VALUE=postgres://user:password@postgres:5432/microservice_db
touch tests/.env
# Set environment variable into .env file
echo "${ENV_VAR_NAME}=${ENV_VAR_VALUE}" >> tests/.env
# Start docker-compose in dev mode
docker-compose up --build

# Run npm tests
cd tests
npm run test