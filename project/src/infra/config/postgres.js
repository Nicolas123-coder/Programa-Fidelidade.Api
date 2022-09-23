require('dotenv').config()

module.exports = {
  herbsCLI: 'postgres',
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    // host: 'database-fidely-dev.cd4zglx5jkmp.sa-east-1.rds.amazonaws.com',
    user: 'postgres',
    password: 'easypointz-tcc',
    // password: '8Q5DoMNE7hRIKKZcvSAD',
    database: 'postgres'
  }
}
