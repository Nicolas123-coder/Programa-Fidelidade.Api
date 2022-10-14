require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: {
    host: 'database-fidely-2.cd4zglx5jkmp.sa-east-1.rds.amazonaws.com',
    user: 'postgres',
    password: 'fidely123#',
    database: 'postgres'
  }
}
