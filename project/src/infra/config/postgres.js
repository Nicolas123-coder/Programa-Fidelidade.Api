require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'easypointz-tcc',
    database: 'postgres'
  }
}
