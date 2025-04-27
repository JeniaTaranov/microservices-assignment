#!/bin/bash

for dir in api-gateway auth-service order-service user-service tests
do
  echo "Installing dependencies for $dir..."
  (cd $dir && npm install)
done

ENV_VAR_NAME=DATABASE_URL
ENV_VAR_VALUE=postgres://user:password@localhost:5432/microservices_db
if [ ! -f tests/.env ]; then
  echo "${ENV_VAR_NAME}=${ENV_VAR_VALUE}" > tests/.env
elif ! grep -q "^${ENV_VAR_NAME}=" tests/.env; then
  echo "${ENV_VAR_NAME}=${ENV_VAR_VALUE}" >> tests/.env
fi