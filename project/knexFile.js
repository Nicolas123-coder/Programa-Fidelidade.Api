require('dotenv').config()
//AWS
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'postgres',
      user: 'postgres',
      password: 'fidely123#',
      host: 'database-fidely-2.cd4zglx5jkmp.sa-east-1.rds.amazonaws.com',
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
