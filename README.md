# Skelleton API

API builded with DI (Dependency Injection) and Swagger definitions for Typescript Rest and automated generation of swagger spec.

## Features

- Integrated with bunyan logs.
- Easy integration with Microservices.
- Swagger file generation
- Pre-built middlewares
- Response schemas
- Integrated with Prettier and code format precommit webhook.
- Migrated to Nest.js
- Use AWS Cognito as authentication users
- User entity and authentication endpoints. 
And more...

### Requirements

- yarn
- node.js
- postgres running in localhost (or any driver that you prefer, see ormconfig.js)
- redis running in localhost
- aws cognito credentials for authentication.
- make and build essentials for Unix

#### How to use

- Run `yarn` to install dependencies
- Run `APP=api make dev_app`
- Go to [http://localhost:3000/docs](http://localhost:5000/api-docs) to play with the API
- Enjoy!
