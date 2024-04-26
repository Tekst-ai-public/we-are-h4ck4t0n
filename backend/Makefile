SHELL := /bin/bash

.PHONY: dockerbuild
dockerbuild:
	npm run dockerbuild

.PHONY: dockerrun
dockerrun:
	npm run dockerrun

.PHONY: docker
docker:
	$(MAKE) dockerbuild
	$(MAKE) dockerrun
