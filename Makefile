NS = gitlab.dev.itech.md:5050
VERSION ?= 16-alpine

REPO = itech/topestate
NAME = app
INSTANCE = default
PORTS = -p 3000:3000
ENV = \
  -e NODE_ENV=development

.PHONY: build push shell test run start stop rm release
dist:
	npm install && npm run build

build:
	docker build -t $(NS)/$(REPO)/${NAME}:$(VERSION) .

login:
	docker login ${NS} -u $(DOCKER_EMAIL) -p $(DOCKER_PASSWORD)

push:
	docker push $(NS)/$(REPO)/${NAME}:$(VERSION)

fast_track:
	./docker/fast_track $(NS)/$(REPO)/${NAME} $(VERSION)

shell:
	docker run --rm --name $(NAME)-$(INSTANCE) -i -t $(PORTS) $(VOLUMES) $(ENV) $(REPO)/${NAME}:$(VERSION) /bin/sh

test:
	docker run --rm $(NS)/$(REPO)/${NAME}:$(VERSION) yarn test

run:
	docker run --rm --name $(NAME)-$(INSTANCE) $(PORTS) $(VOLUMES) $(ENV) $(REPO)/${NAME}:$(VERSION)

start:
	docker run -d --name $(NAME)-$(INSTANCE) $(PORTS) $(VOLUMES) $(ENV) $(REPO)/${NAME}:$(VERSION)

stop:
	docker stop $(NAME)-$(INSTANCE)

rm:
	docker rm $(NAME)-$(INSTANCE)

release: build
	make push -e VERSION=$(VERSION)

default: build
