const express = require('express')

const rest = require('./rest')

async function start (config) {
  const app = express()

  await rest(app, config)
  
 
  return app.listen(
    { port: config.api.port },
    () => console.log(`🚀 Server UP and 🌪️ Spinning on port ${config.api.port}`))
}

module.exports = start
module.exports.start = start
