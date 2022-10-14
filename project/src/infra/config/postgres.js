// require('dotenv').config()

// module.exports = {
//   client: 'pg',
//   connection: {
//     host: '127.0.0.1',
//     user: 'postgres',
//     password: 'easypointz-tcc',
//     database: 'postgres'
//   }
// }

require('dotenv').config()

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  }
}
