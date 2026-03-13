if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile()
}

const postgres = require('postgres')

const connectionString = process.env.DIRECT_URL

if (!connectionString) {
  throw new Error('Missing DIRECT_URL environment variable')
}

function createSqlClient() {
  return postgres(connectionString, {
    ssl: 'require',
  })
}

module.exports = {
  createSqlClient,
}