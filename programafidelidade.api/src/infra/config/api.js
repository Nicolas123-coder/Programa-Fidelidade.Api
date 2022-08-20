const env = require('sugar-env')
require('dotenv').config()

module.exports = {
  port: env.get(['GRAPHQL_PORT', 'API_PORT'], 3001),
  host: env.get(['GRAPHQL_HOST', 'API_HOST'], '0.0.0.0')
}
