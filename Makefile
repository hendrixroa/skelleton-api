.PHONY: lint build clean build_docker dev run docs

################################################################################
# DEVELOP
#
# make dev_app APP=<app_name>
#
################################################################################
dev_app:
	NODE_ENV=development \
    APP=$(APP) \
    TS_NODE_TRANSPILE_ONLY=true \
    yarn nodemon --exec \
    yarn env-cmd --no-override -f ./env/.env yarn env-cmd --no-override -f ./env/$(APP).env yarn ts-node -r tsconfig-paths/register src/apps/$(APP)/main.ts | yarn pino-pretty -c -t -l

dev_app_debug:
	NODE_ENV=development \
	APP=$(APP) \
	yarn env-cmd --no-override -f ./env/.env yarn env-cmd --no-override -f ./env/$(APP).env yarn nest start $(APP) --debug --watch | yarn pino-pretty -c -t
################################################################################
# BUILD
################################################################################
build: clean
	yarn run build && \
        cp ormconfig.js dist/ && \
        cp package.json dist/ && \
		mkdir -p dist/data
		cp data/* dist/data && \
        cp yarn.lock dist/ && \
        cp tsconfig.json dist/ && \
        for filename in $$(find . -iname '*.json' -a | grep -v '^./dist' | grep -v '^./node_modules' | sed 's/^..//'); do mkdir -p "./dist/$$(dirname $$filename)" && cp $$filename "./dist/$$filename"; done && \
        cd dist && \
        NODE_ENV=${NODE_ENV:-production} yarn

build_docker:
	docker build -t skelleton:latest --build-arg APP="$(APP)" --cache-from $$IMAGE_REGISTRY . -q

build_docker_local:
	docker build -t skelleton:latest --build-arg APP="$(APP)" . -q

build_docker_gitlab:
	docker pull $$IMAGE_REGISTRY && \
	docker build -t $$IMAGE_REGISTRY --cache-from $$IMAGE_REGISTRY . -q && \
    docker push $$IMAGE_REGISTRY \

################################################################################
# MIGRATE
#
# make migrate_up       [DOCKER=1]
# make migrate_down     [DOCKER=1]
# make migrate_down_all [DOCKER=1]
# make migrate_generate NAME=<migration-file-name>
# make migrate_create   NAME=<migration-file-name>
# make migrate_generate_initial
#
################################################################################
migrate_generate:
	$(MAKE) typeorm_cmd COMMAND="migration:generate -n $(NAME)"

migrate_create:
	$(MAKE) typeorm_cmd COMMAND="migration:create -n $(NAME)"

migrate_up:
	@if [[ -z "${DOCKER}" ]]; then \
		$(MAKE) typeorm_cmd COMMAND=migration:run; \
	else \
		docker-compose run --name migrator --rm api make migrate_up; \
	fi;

migrate_down:
	@if [[ -z "${DOCKER}" ]]; then \
		$(MAKE) typeorm_cmd COMMAND=migration:revert; >> '/dev/null' \
	else \
		docker-compose run --name migrator --rm api make migrate_down; \
	fi;


migrate_down_all:
	@if [[ -z "${DOCKER}" ]]; then \
		$(MAKE) typeorm_cmd COMMAND=schema:drop; >> '/dev/null' \
	else \
		docker-compose run --name migrator --rm api make migrate_down_all; \
	fi;

migrate_reset_database:
	$(MAKE) migrate_down_all && \
	$(MAKE) migrate_up

typeorm_cmd:
	APP=api yarn ts-node -r tsconfig-paths/register $$(yarn bin)/typeorm $(COMMAND)

################################################################################
# OTHER
################################################################################
clean:
	rm -rf dist
