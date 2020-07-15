FROM node:13-alpine
WORKDIR /usr/src/app
ARG NODE_ENV=production

RUN apk update && apk upgrade && \
    apk --no-cache --virtual build-dependencies add \
    bash \
    g++ \
    make && \
    rm -rf /var/cache/apk/*

# Memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package.json ./
COPY yarn.lock ./
COPY ormconfig.js ./
RUN yarn config set no-progress
RUN yarn --production=false
COPY . ./
RUN make build
RUN find ./* ! -name dist ! -name Makefile -maxdepth 0 -exec rm -rf {} +
RUN cp -R "./dist/"* . && rm -rf dist
RUN ls -la
CMD node src/apps/${APP}/main.js
