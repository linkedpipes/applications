# Base image
FROM node:8.11.4-alpine

# Install packages using Yarn
# References:
# http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
# https://hackernoon.com/using-yarn-with-docker-c116ad289d56

# Add package.json and respective lock
ADD package.json yarn.* /tmp/

# Install packages
RUN cd /tmp && yarn

ARG REACT_APP_BASE_BACKEND_URL

ENV REACT_APP_BACKEND_URL $REACT_APP_BASE_BACKEND_URL

RUN echo ${REACT_APP_BACKEND_URL}

# Create a symlink to node_modules
RUN mkdir -p /app && cd /app && ln -s /tmp/node_modules

WORKDIR /app

ADD . /app

EXPOSE 9000

RUN ls

COPY . .

RUN ls

RUN touch ./.env && \
    eval env > ./.env && cat .env

CMD ["yarn", "start"]



