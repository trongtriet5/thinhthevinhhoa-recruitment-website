import postgres from 'postgres'

const connectionString = process.env.DIRECT_URL

if (!connectionString) {
  throw new Error('Missing DIRECT_URL environment variable')
}

export const sql = postgres(connectionString, {
  ssl: 'require',
})
