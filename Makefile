.PHONY: lint build clean build_docker dev run docs test

################################################################################
# DEVELOP
#
# make dev_app APP=<app_name> [DOCKER=1]
# make dev_all [DOCKER=1]
# make dev_file FILE=<file_path> [APP=<app_name>]
# make dev_docker_stop
#
################################################################################
dev_app:
	@if [[ -z "${DOCKER}" ]]; then \
		$(MAKE) dev_local; \
	else \
		$(MAKE) dev_docker; \
	fi;

dev_all:
	@if [[ -z "${DOCKER}" ]]; then \
		$(MAKE) dev_all_local; \
	else \
		$(MAKE) dev_all_docker; \
	fi;

dev_local:
	NODE_ENV=development \
	APP=$(APP) \
	yarn nodemon --exec \
	"DISABLE_API_KEY_AUTH=1 make swagger && yarn env-cmd --no-override -f ./env/.env yarn env-cmd --no-override -f ./env/$(APP).env node" -r ts-node/register -r module-alias/register src/apps/$(APP)/index.ts \
	| yarn bunyan

dev_all_docker:
	$(MAKE) dev_docker

dev_docker_stop:
	docker-compose down -v

dev_file:
	yarn env-cmd --no-override -f ./env/.env yarn env-cmd --no-override -f ./env/$(APP).env node -r ts-node/register -r module-alias/register "$(FILE)" | yarn bunyan

################################################################################
# BUILD
################################################################################
build: clean swagger_all
	yarn tsc && \
		cp ormconfig.js dist/ && \
		cp package.json dist/ && \
		cp yarn.lock dist/ && \
		for filename in $$(find . -iname '*.json' -a | grep -v '^./dist' | grep -v '^./node_modules' | sed 's/^..//'); do mkdir -p "./dist/$$(dirname $$filename)" && cp $$filename "./dist/$$filename"; done && \
		cd dist && \
		NODE_ENV=${NODE_ENV:-production} yarn

build_docker_local:
	docker build -t skelleton-api:latest --build-arg APP="$(APP)" . -q

################################################################################
# TEST
#
# make test_app    TEST_TYPE=<integration|unit> [DOCKER=1] APP=<app_name>
# make test_shared TEST_TYPE=<integration|unit> [DOCKER=1]
# make test_all    [DOCKER=1]
#
################################################################################
test_app:
	@if [[ -z "${DOCKER}" ]]; then \
		$(MAKE) test_app_local; \
	else \
		$(MAKE) test_app_docker; \
	fi;

test_app_local:
	NODE_ENV=test APP="$(APP)" \
	yarn env-cmd --no-override -f ./env/.test.env yarn env-cmd --no-override -f ./env/$(APP).test.env \
	yarn mocha -t 10000 --exit --require ts-node/register -r module-alias/register "test/appTests/$(APP)/**/*.$(TEST_TYPE).test.{ts,js}"

test_shared:
	@if [[ -z "${DOCKER}" ]]; then \
		$(MAKE) test_shared_local; \
	else \
		$(MAKE) test_shared_docker; \
	fi;

test_shared_local:
	NODE_ENV=test APP="api" yarn env-cmd --no-override -f ./env/.test.env yarn mocha -t 10000 --exit --require ts-node/register -r module-alias/register "test/sharedTests/**/*.$(TEST_TYPE).test.{ts,js}"

get_all_apps:
	@find ./src/apps -maxdepth 1 -mindepth 1 -type d | xargs -I "{}" basename {}

################################################################################
# LINT
################################################################################
lint:
	yarn tslint -c ./tslint.json --project tsconfig.json "$$(MAKE get_source_files)" "$$(MAKE get_test_files)"

lint_fix:
	yarn tslint -c ./tslint.json --fix --project tsconfig.json "$$(MAKE get_source_files)" "$$(MAKE get_test_files)"

prettier:
	yarn prettier --write "$$(MAKE get_source_files)" "$$(MAKE get_test_files)"

get_source_files:
	@echo "./src/**/*.ts"

get_test_files:
	@echo "./test/**/*.ts"


################################################################################
# OTHER
################################################################################

docs: clean_docs
	yarn typedoc --excludeExternals --ignoreCompilerErrors --mode file --exclude */test/* --out ./docs ./src

clean_docs:
	rm -rf docs

clean:
	rm -rf dist

swagger:
	[ -f ./src/apps/$(APP)/swaggerConfig.js ] && yarn swaggerGen -t -c ./src/apps/$(APP)/swaggerConfig.js || true;

swagger_all:
	for filename in $$(find ./src/apps -name swaggerConfig.js -print); do yarn swaggerGen -t -c $$filename; done

