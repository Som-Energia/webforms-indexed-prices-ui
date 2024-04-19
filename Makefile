.PHONY: default ui-build ui-dev ui-deps style ui-test ui-test-once clean ui-test-cypress-run ui-test-cypress-open

PORT := 5173
CYPRESS := node_modules/.bin/cypress
PRETTIER := node_modules/.bin/prettier

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

ui-test-once:
	npm run test:once

ui-test-cypress-run:
	@if ! curl -s "http://localhost:$(PORT)" > /dev/null 2>&1; then \
		echo "\nRun 'make ui-dev' to start the application before running Cypress.\n"; \
		exit 1; \
    fi
	$(CYPRESS) run

ui-test-cypress-open:
	$(CYPRESS) open

style:
	$(PRETTIER) --write ./src/ --config .prettierrc.yaml

clean:
	rm -rf node_modules package-lock.json

define HELP
    - make ui-deps\t\tInstall frontend environment
    - make ui-dev\t\tStart frontend development server
    - make ui-test\t\tPass frontend tests
    - make ui-test-once\t\tPass frontend tests once
    - make ui-build\t\tBuild frontend distribution files
    - make clean\t\tRemove installed dependencies
    - make ui-test-cypress-run\t\tPass cypress tests at command line
    - make ui-test-cypress-open\t\tOpen cypress browser interface

Please execute "make <command>". Example: make run

endef

export HELP
