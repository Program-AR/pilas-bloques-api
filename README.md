# Pilas Bloques API
REST-API for Pilas Bloques app.

## Requisites
- [Nodejs](https://nodejs.org/es/) (v12 >=)
- [MonngoDB](https://www.mongodb.com/) (TODO: use Docker)

## Config project
- Checkout this repository.
- Create `.env` file with the required enviroments variables. You can copy from [`sample.env`](sample.env)
- Run `npm install`

## Running app
> Remember start the DB before!

For development
- Run `npm run dev` for server starts. Any file change should re-run the it.

For production
- Run `npm run build` for make `dist` directory. (TODO)
- Run `npm start` for server starts.

## Running tests

All tests
- Run `npm test`

Only one file
- Run `npm test -- -f <FILE_PATH>`