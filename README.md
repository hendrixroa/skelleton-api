# Skelleton API

API builded with DI (Dependency Injection) and Swagger definitions for Typescript Rest and automated generation of swagger spec.

## Features

- Integrated with bunyan logs.
- Easy integration with Microservices.
- Swagger file generation
- Pre-built middlewares
- Response schemas
- Integrated with Prettier and code format precommit webhook.
And more...

### Requirements

- yarn
- make and build essentials for Unix

#### How to use

- Run `yarn` to install dependencies
- Run `APP=api make dev_local`
- Go to [http://localhost:5000/api-docs](http://localhost:5000/api-docs) to play with the API
- Enjoy!
