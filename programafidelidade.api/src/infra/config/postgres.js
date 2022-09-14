require('dotenv').config()
  //TODO: set this variables in the .env file
module.exports = {
  herbsCLI: 'postgres',
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'easypointz-tcc',
    database: 'postgres',
    port: 5432
  }
}
