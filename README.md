<p align="center"><img width=30% src="https://pli.io/YK8iU.png"></p>
<p align="center"><img width=60% src="https://pli.io/9qaU7.png"></p>

### Software Project (NPRG023)

[![Join the chat at https://gitter.im/linkedpipes/applications](https://badges.gitter.im/linkedpipes/applications.svg)](https://gitter.im/linkedpipes/applications?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Meeting Logs: https://docs.google.com/document/d/1tvJgEbRWb9dYM34grGARRXQ9gE0fcITw0Rayu2mEbmA/edit

Wireframe Designs: https://app.moqups.com/ponsietta/LMyuSmiQKD/view

Current App that we will be extracting, modifying and adding to: https://github.com/ld-viz-swp/LDVMi

High level documentation markdown (updated regularly) : [HackMD](https://hackmd.io/lymLxN5AR4KTX4x3kPyiiQ#)

# Running the app

The Docker image for this project is hosted in [Docker Hub](https://hub.docker.com/r/linkedpipes/application/) so to run the application you just need to execute (given that you have Docker installed):

`docker run --name lpa -p 5000:8080 linkedpipes/application`

The application should then by available through port `5000`

# Building the image

In case you wanna build the image locally, follow the next steps:

- Navigate to the backend folder

`$ cd src/backend`

- Build the jar file. It will be located under the `src/backend/build/lib` folder.

`$ gradle build`

- Build the image by executing in the project's root folder the next command, replacing `<some_tag>` by the name you want the image to have

`$ docker build -t <some_tag> --build-arg JAR_FILE=src/backend/build/libs/backend-0.0.1.jar .`
