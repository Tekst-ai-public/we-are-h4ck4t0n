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

.PHONY: prismaStudio
prismaStudio:
	POSTGRES_HOST=$$(grep POSTGRES_HOST_LOCAL .env | cut -d '=' -f 2-) npx prisma studio

.PHONY: prismaPush
prismaPush:
	POSTGRES_HOST=$$(grep POSTGRES_HOST_LOCAL .env | cut -d '=' -f 2-) npx prisma db push