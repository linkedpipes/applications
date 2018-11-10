# Base image
FROM node:8.12.0-alpine

# Install packages using Yarn
# References:
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
# https://hackernoon.com/using-yarn-with-docker-c116ad289d56

# Add package.json and respective lock
ADD package.json yarn.* /tmp/

# Install packages
RUN cd /tmp && yarn

# Create a symlink to node_modules
RUN mkdir -p /app && cd /app && ln -s /tmp/node_modules

WORKDIR /app

ADD . /app

EXPOSE 9001

CMD ["yarn", "startDockerDev"]



