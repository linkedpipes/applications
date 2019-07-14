---
title: "Installation"
---

## Installation guide

### Prerequisites

- [Gradle](https://gradle.org)
- [Node.js v10.15.x](https://nodejs.org/en/)
- [Java JDK 11](https://www.oracle.com/technetwork/java/javase/downloads/jdk11-downloads-5066655.html)
- [Docker and Docker-compose](https://www.docker.com/) # if you intent to run via docker compose along with other containers

### Running locally

This assumes that you are currently inside the root folder of the whole application's repository and you have other components such as **Discovery**, **ETL**, **Frontend**, **PostgreSQL** and **Virtuoso** running locally on default ports in your system:

```bash

$ cd src/backend
$ ./gradlew bootRun

```

After that navigate backend service will be available at [localhost:9005](localhost:9005). Refer to [Backend API Documentation](https://linkedpipes.docs.apiary.io) for more details on how to interact with backend instance.

### Running as a docker container inside docker-compose

This assumes that you are currently inside the root folder of the whole application's repository.

```bash
$ cd docker
$ docker-compose up --build --force-recreate

```

After that navigate to [localhost:9005](localhost:9005) to access the frontend, by default docker is being exposing it on port `9005` .

#### Running with docker-compose with persistent volumes

If you use the default `docker-compose.yml` file you will notice that it does not specify the volumes for **PostgreSQL** and **Virtuoso** containers. Therefore, your data won't be lost upon every `docker-compose up` session. If you want to have persistend docker-compose setup, follow these steps instead:

```bash
$ cd docker
$ docker-compose -f docker-compose-persistent.yml up --build  --force-recreate

```

This will create two folders named `data` and `appdata` inside the root folder of the repository. This is where your data is going to be stored for next `docker-compose up` sessions.

Alternatively inspect, the `lpa-cli.sh` script for a simplified commands if you prefer not to interact with `docker-compose` directly.
