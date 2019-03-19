<p align="center"><img width=30% src="http://i63.tinypic.com/3013lg4.png"></a>
<p align="center"><img width=25% src="https://media.giphy.com/media/8PpFGKr5vgNY1s8QiY/giphy.gif"></p>

### Software Project (NPRG023)

[![Build Status](https://travis-ci.org/linkedpipes/applications.svg?branch=develop)](https://travis-ci.org/linkedpipes/applications)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/87ac72b5a8d347b5a10a519323d71b6f)](https://app.codacy.com/app/LinkedPipes/applications?utm_source=github.com&utm_medium=referral&utm_content=linkedpipes/applications&utm_campaign=Badge_Grade_Settings)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/9589669eb7534112a3f65f0e4b9f69d8)](https://www.codacy.com/app/LinkedPipes/applications?utm_source=github.com&utm_medium=referral&utm_content=linkedpipes/applications&utm_campaign=Badge_Coverage)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Apiary: https://linkedpipes.docs.apiary.io

## Quick start

The whole app can be run using [docker compose](https://docs.docker.com/compose/install/):

The production version can be run with:

```bash
$ curl https://raw.githubusercontent.com/linkedpipes/applications/master/docker-compose-master.yml -o docker-compose.yml &&
curl https://raw.githubusercontent.com/linkedpipes/applications/master/nginx-prod.conf -o nginx-prod.conf && docker-compose stop && docker-compose rm -f && docker-compose pull && docker-compose up
```

The development version can be run with:

```bash
$ curl https://raw.githubusercontent.com/linkedpipes/applications/master/docker-compose.yml -o docker-compose.yml &&
curl https://raw.githubusercontent.com/linkedpipes/applications/master/nginx.conf -o nginx.conf && docker-compose stop && docker-compose rm -f && docker-compose pull && docker-compose up
```

If it fails it can be because you already have some container with the same names running. You can delete these containers with the
following command:s

```bash
 $ docker rm $(docker ps -a -q -f name=lpa-*)
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
(lpa)$ docker-compose stop && docker-compose rm -f && docker-compose pull && docker-compose up --build
```

You should be able to access:
• Frontend of LPA at `localhost:9001`
• Backend of LPA at `localhost:9005`
• Local Discover at `localhost:9000`
• Local ETL at `localhost:8080`
• Local Virtuoso at `localhost:8890`

You can also customize some settings in the following files:

- `docker-compose.yml`
- `nginx.conf`
- `src/backend/src/main/config/com/linkedpipes/lpa/backend/config.properties`
