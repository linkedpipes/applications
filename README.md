<p align="center"><img width=30% src="https://pli.io/22gHl3.png"></p>
<p align="center"><img width=25% src="https://media.giphy.com/media/8PpFGKr5vgNY1s8QiY/giphy.gif"></p>

### Software Project (NPRG023)

[![Join the chat at https://gitter.im/linkedpipes/applications](https://badges.gitter.im/linkedpipes/applications.svg)](https://gitter.im/linkedpipes/applications?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/linkedpipes/applications.svg?branch=develop)](https://travis-ci.org/linkedpipes/applications)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/87ac72b5a8d347b5a10a519323d71b6f)](https://app.codacy.com/app/LinkedPipes/applications?utm_source=github.com&utm_medium=referral&utm_content=linkedpipes/applications&utm_campaign=Badge_Grade_Settings)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/9589669eb7534112a3f65f0e4b9f69d8)](https://www.codacy.com/app/LinkedPipes/applications?utm_source=github.com&utm_medium=referral&utm_content=linkedpipes/applications&utm_campaign=Badge_Coverage)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Meeting Logs: https://docs.google.com/document/d/1tvJgEbRWb9dYM34grGARRXQ9gE0fcITw0Rayu2mEbmA/edit

Wireframe Designs (Legacy via Moqups): https://app.moqups.com/ponsietta/LMyuSmiQKD/view

Wireframe Designs (Latest) https://docs.google.com/document/d/166u_INZn6jAsKVsmVX88N2dQdX1wb9Mk2ZH1q2gRZV4/edit?usp=sharing

Current App that we will be extracting, modifying and adding to: https://github.com/ld-viz-swp/LDVMi

High level documentation markdown (updated regularly) : [HackMD](https://hackmd.io/lymLxN5AR4KTX4x3kPyiiQ#)

ETL Service API Documentation: https://github.com/linkedpipes/etl/wiki/LinkedPipes-ETL-REST-API

## Quick start

The whole app can be run using [docker compose](https://docs.docker.com/compose/install/):

The production version can be run with:

```bash
$ curl https://raw.githubusercontent.com/linkedpipes/applications/develop/src/backend/src/main/config/com/linkedpipes/lpa/backend/config.properties -o config.properties &&
curl https://raw.githubusercontent.com/linkedpipes/applications/develop/docker-compose-master.yml -o docker-compose.yml &&
curl https://raw.githubusercontent.com/linkedpipes/applications/develop/nginx-prod.conf -o  nginx-prod.conf &&
docker-compose pull backend && docker-compose pull frontend && docker-compose up
```

The development version can be run with:

```bash
$ curl https://raw.githubusercontent.com/linkedpipes/applications/develop/src/backend/src/main/config/com/linkedpipes/lpa/backend/config.properties -o config.properties &&
curl https://raw.githubusercontent.com/linkedpipes/applications/develop/docker-compose.yml -o docker-compose.yml &&
curl https://raw.githubusercontent.com/linkedpipes/applications/develop/nginx.conf -o  nginx.conf &&
docker-compose pull backend && docker-compose pull frontend && docker-compose up
```

If it fails it can be because you already have some container with the same names running. You can delete these containers with the
following command:s

```bash
 $ docker rm $(docker ps -a -q -f name=lpa_*)
```

## Manual start

You can also run the whole application by directly from the code in the repository.

First download the whole repository into your computer by running

```bash
$ git clone https://github.com/linkedpipes/applications.git lpa
```

Then set your working directory to the one that you just downloaded:

```bash
$ cd lpa
```

Finally, execute

```bash
(lpa)$ docker-compose up --build
```

You should be able to access the application at `localhost:9001`

You can also customize some settings in the following files:

- `docker-compose.yml`
- `nginx.conf`
- `src/backend/src/main/config/com/linkedpipes/lpa/backend/config.properties`
