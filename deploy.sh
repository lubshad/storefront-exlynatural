#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${ROOT_DIR}/deploy.env"

if [[ ! -f "${CONFIG_FILE}" ]]; then
	echo "Missing deploy.env."
	echo "Create it with: cp deploy.env.example deploy.env"
	exit 1
fi

# shellcheck disable=SC1090
source "${CONFIG_FILE}"

: "${DEPLOY_TARGET:?Set DEPLOY_TARGET in deploy.env, for example ubuntu@your-server-ip}"
: "${DEPLOY_PATH:?Set DEPLOY_PATH in deploy.env, for example /var/www/storefront-exlynatural}"

command -v ssh >/dev/null || {
	echo "ssh is required but was not found."
	exit 1
}

command -v rsync >/dev/null || {
	echo "rsync is required but was not found."
	exit 1
}

SSH_ARGS=()
if [[ -n "${DEPLOY_SSH_KEY:-}" ]]; then
	if [[ ! -f "${DEPLOY_SSH_KEY}" ]]; then
		echo "DEPLOY_SSH_KEY does not exist: ${DEPLOY_SSH_KEY}"
		exit 1
	fi
	SSH_ARGS=(-i "${DEPLOY_SSH_KEY}")
fi

RSYNC_ARGS=(
	-az
	--delete
	--exclude ".env"
	--exclude ".env.*"
	--exclude "deploy.env"
	--exclude ".git"
	--exclude "node_modules"
	--exclude ".next"
	--exclude "out"
	--exclude "build"
	--exclude "coverage"
	--exclude "test-results"
	--exclude ".pnpm-store"
	--exclude ".vercel"
	--exclude ".DS_Store"
	--exclude "*.tsbuildinfo"
)

DRY_RUN_ENABLED=0
if [[ "${DRY_RUN:-}" == "1" ]]; then
	DRY_RUN_ENABLED=1
	RSYNC_ARGS+=(--dry-run --itemize-changes)
	echo "Running rsync dry run. No files will be changed."
fi

if [[ "${DRY_RUN_ENABLED}" == "1" ]]; then
	echo "Checking remote deploy path exists: ${DEPLOY_TARGET}:${DEPLOY_PATH}"
	ssh "${SSH_ARGS[@]}" "${DEPLOY_TARGET}" "test -d '${DEPLOY_PATH}'"
else
	echo "Ensuring remote deploy path exists: ${DEPLOY_TARGET}:${DEPLOY_PATH}"
	ssh "${SSH_ARGS[@]}" "${DEPLOY_TARGET}" "mkdir -p '${DEPLOY_PATH}'"
fi

echo "Syncing storefront source to ${DEPLOY_TARGET}:${DEPLOY_PATH}"
if [[ ${#SSH_ARGS[@]} -gt 0 ]]; then
	rsync "${RSYNC_ARGS[@]}" -e "ssh -i ${DEPLOY_SSH_KEY}" "${ROOT_DIR}/" "${DEPLOY_TARGET}:${DEPLOY_PATH}/"
else
	rsync "${RSYNC_ARGS[@]}" "${ROOT_DIR}/" "${DEPLOY_TARGET}:${DEPLOY_PATH}/"
fi

if [[ "${DRY_RUN_ENABLED}" == "1" ]]; then
	echo "Dry run complete. Skipping remote Docker deployment."
	exit 0
fi

echo "Building and restarting storefront on server"
ssh "${SSH_ARGS[@]}" "${DEPLOY_TARGET}" "cd '${DEPLOY_PATH}' && { test -f .env || { echo 'Missing production .env on server.'; exit 1; }; } && docker compose up -d --build --remove-orphans && docker compose ps"

echo "Deployment complete."
