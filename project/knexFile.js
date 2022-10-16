require('dotenv').config()
//AWS
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_DATABASE,
      user: 'postgres',
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: 5432
    },
    migrations: {
      directory: './src/infra/data/database/migrations',
      tableName: 'knex_migrations'
    }
  },
  staging: {},
  production: {}

}
