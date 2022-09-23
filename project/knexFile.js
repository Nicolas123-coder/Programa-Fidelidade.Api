module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'postgres',
      user: 'postgres',
      host: '127.0.0.1',
      password: 'easypointz-tcc',
      // password: '8Q5DoMNE7hRIKKZcvSAD',
      // host: 'database-fidely-dev.cd4zglx5jkmp.sa-east-1.rds.amazonaws.com',
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
