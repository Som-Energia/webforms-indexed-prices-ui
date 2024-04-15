.PHONY: default deploy ui-build ui-dev ui-deps style

default:
	@printf "$$HELP"

ui-build: ui-deps
	npm run build

ui-dev:
	npm run dev

ui-deps:
	npm install

ui-test:
	npm run test

style:
	node_modules/.bin/prettier --write . --config .prettierrc.yaml
	# TODO: apply black

clean:
	rm -r node_modules package-lock.json

define HELP
    - make ui-deps\t\tInstall frontend environment
    - make ui-dev\t\tStart frontend development server
    - make ui-test\t\tPass frontend tests
    - make ui-build\t\tBuild frontend distribution files

Please execute "make <command>". Example: make run

endef

export HELP
