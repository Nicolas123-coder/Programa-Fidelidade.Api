require('dotenv').config()

module.exports = {
  herbsCLI: 'postgres',
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'postgres',
    database: 'project'
  }
}
