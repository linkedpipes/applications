<p align="center"><img width=25% src="https://pli.io/YK8iU.png"></p>
<p align="center"><img width=80% src="https://pli.io/fSPkJ.png"></p>

### Software Project (NPRG023)

[![Join the chat at https://gitter.im/linkedpipes/applications](https://badges.gitter.im/linkedpipes/applications.svg)](https://gitter.im/linkedpipes/applications?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Meeting Logs: https://docs.google.com/document/d/1tvJgEbRWb9dYM34grGARRXQ9gE0fcITw0Rayu2mEbmA/edit

Current App that we will be extracting, modifying and adding to: https://github.com/ld-viz-swp/LDVMi

High level documentation markdown (updated regularly) : [HackMD](https://hackmd.io/lymLxN5AR4KTX4x3kPyiiQ#)

# Runnning the app

The application is meant to be run inside a Docker container. However, it can also be run as any jar file. The following steps show how to build the jar file and run it as a container:

- Navigate to the backend folder

`$ cd src/backend`

- Build the jar file. It will be located under the `src/backend/build/lib` folder.

`$ gradle build`

- If the app is to be run as a Docker container then you will first need to build the image by executing in the root folder

`$ docker build -t linkedpipes/application --build-arg JAR_FILE=src/backend/build/libs/backend-0.0.1.jar .`

- Then simply run the container by executing

`docker run --name lpa-backend -p 5000:8080 linkedpipes/application`

- Application should then by available through port `5000`