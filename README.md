<p align="center"><img width=30% src="https://pli.io/k9Aaw.png"></p>
<p align="center"><img width=60% src="https://pli.io/9qaU7.png"></p>

### Software Project (NPRG023)

[![Join the chat at https://gitter.im/linkedpipes/applications](https://badges.gitter.im/linkedpipes/applications.svg)](https://gitter.im/linkedpipes/applications?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/linkedpipes/applications.svg?branch=develop)](https://travis-ci.org/linkedpipes/applications)

Meeting Logs: https://docs.google.com/document/d/1tvJgEbRWb9dYM34grGARRXQ9gE0fcITw0Rayu2mEbmA/edit

Wireframe Designs (Legacy via Moqups): https://app.moqups.com/ponsietta/LMyuSmiQKD/view

Wireframe Designs (Latest) https://docs.google.com/document/d/166u_INZn6jAsKVsmVX88N2dQdX1wb9Mk2ZH1q2gRZV4/edit?usp=sharing

Current App that we will be extracting, modifying and adding to: https://github.com/ld-viz-swp/LDVMi

High level documentation markdown (updated regularly) : [HackMD](https://hackmd.io/lymLxN5AR4KTX4x3kPyiiQ#)

ETL Service API Documentation: https://github.com/linkedpipes/etl/wiki/LinkedPipes-ETL-REST-API

## Quick start

The whole app can be run using [docker compose](https://docs.docker.com/compose/install/):

`$ curl https://raw.githubusercontent.com/linkedpipes/applications/develop/docker-compose.yml -o docker-compose.yml; docker-compose up`

## Manual start

### Running backend

#### Using docker

##### Building image locally

In case you want to build the image locally, follow the next steps:

- Navigate to the backend folder

`$ cd src/backend`

- Build the image by executing in the project's root folder the next command, replacing `<some_tag>` by the name you want the image to have

`$ docker build -t <some_tag> .`

##### Running the image

The Docker image for this project is hosted in [Docker Hub](https://hub.docker.com/r/linkedpipes/application/) so to run the application you just need to execute (given that you have Docker installed):

`$ docker run --name <container name> -p 5000:8080 <some_tag>`

The application should then by available through port `5000`.
Custom configuration can be supplied via `-v <path to config.properties>:/app/config.properties` if needed.

### Running frontend

#### Running locally

1. Make sure that you are currently switched to `frontend` branch since `develop` does not contain frontend code yet.
2. Navigate to frontend folder by executing following commands from root folder.
   `$ cd src/frontend`
3. Installing dependencies. Depending on user's preference execute the command below.
   3.1. If you are using `npm` then : `$ npm install`
   3.2. If you are using `yarn` then : `$ yarn install`
4. Running the web-app on `localhost`. Depending on user's preference execute the command below.
   4.1. If you are using `npm` then : `$ npm run dev-server`
   4.2. If you are using `yarn` then : `$ yarn run dev-server`

After step `4` navigate to `localhost:9000` in browser. Please note that the frontend app currently expects to have local instance of backend running at port `8080`.

#### Using Docker

1. Make sure that you are currently switched to `frontend` branch since `develop` does not contain frontend code yet.
2. Navigate to frontend folder by executing following commands from root folder.
   `$ cd src/frontend`
3. Build the image by running:
   `$ docker build -t frontend .`
4. Running the image by running:
   `$ docker run frontend -p 9000:9000`
