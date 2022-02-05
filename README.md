## Description
A Simple CRUD Web API with JWT authentication, creation of users with differents roles to add and fetch books

### Built With
* [NestJS](https://nestjs.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [TypeORM](https://typeorm.io/)
* [Swagger](https://swagger.io/)
* [Docker](https://www.docker.com/)

## Installation

```bash
$ git clone https://github.com/v-cardona/bookstore_api.git
```

## Running the app

- cd into `bookstore_api`
- run `npm install`
- create a docker container with postgres image `docker run -d -p DOCKER_PORT:5432 --name bookstore_container -e POSTGRES_PASSWORD=password postgres`
- set up your postgres database
- create a firebase project and a storage bucket
- rename `.env.sample` to `.env` and populate the parameters
- rename `.orm.config.json.sample` to `.orm.config.json` and populate the parameters
- run databse migration `npm run migration:run`
- run `npm run start:dev`

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Access to documentation API
- Open a web browser and acces to http://localhost:5000/docs/

## Database migration
- generate migration `npm run migration:generate --name`
- run migration `npm run migration:run`
- revert migration `npm run migration:revert`
