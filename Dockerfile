FROM node:10-alpine
WORKDIR /usr/src/app
ARG NODE_ENV=production

COPY package.json ./
COPY yarn.lock ./
RUN yarn config set no-progress
RUN yarn --production=false
COPY . ./

RUN NODE_ENV="$NODE_ENV" make build
RUN find ./* ! -name dist ! -name Makefile -maxdepth 0 -exec rm -rf {} +
RUN cp -R "./dist/"* . && rm -rf dist
# RUN apk del build-dependencies
ENV NODE_ENV=production
CMD node -r source-map-support/register -r module-alias/register src/apps/${APP}/index.js
