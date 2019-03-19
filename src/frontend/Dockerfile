# Base image
FROM node:8.15.0-alpine

# Install packages using Yarn
# References:
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
# https://hackernoon.com/using-yarn-with-docker-c116ad289d56

# Add package.json and respective lock
COPY package.json yarn.* /tmp/

# Install git 
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# Install packages
WORKDIR /tmp
RUN yarn install --frozen-lockfile

# Create a symlink to node_modules
RUN mkdir -p /app 
WORKDIR /app
RUN ln -s /tmp/node_modules

COPY . /app

EXPOSE 9001

CMD ["yarn", "startDockerDev"]



