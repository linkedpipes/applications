# Base image
FROM node:8.16.1-alpine

ENV YARN_VERSION 1.16.0
# Install packages using Yarn
# References:
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
# https://hackernoon.com/using-yarn-with-docker-c116ad289d56

# Add package.json and respective lock
COPY package.json yarn.* /tmp/

# Install git
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN apk add --no-cache --virtual .build-deps-yarn curl \
    && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
    && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
    && rm yarn-v$YARN_VERSION.tar.gz \
    && apk del .build-deps-yarn

# Install packages
WORKDIR /tmp
RUN yarn cache clean
RUN yarn install --frozen-lockfile --network-concurrency 1

# Create a symlink to node_modules
RUN mkdir -p /app
WORKDIR /app
RUN ln -s /tmp/node_modules

COPY . /app

EXPOSE 9001

CMD ["yarn", "startDockerDev"]



