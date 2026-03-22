const postgres = require('postgres')
require('dotenv').config({ path: '.env' })
require('dotenv').config({ path: '.env.local' })

const sql = postgres(process.env.DIRECT_URL, { ssl: 'require' })

async function main() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "CandidateApplication" (
        "id" SERIAL PRIMARY KEY,
        "phone" VARCHAR(20) NOT NULL,
        "jobId" VARCHAR(255) NOT NULL,
        "jobPosition" VARCHAR(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE("phone", "jobId")
      );
    `
    console.log("Table CandidateApplication created successfully")
  } catch (err) {
    console.error("Error creating table:", err)
  } finally {
    process.exit(0)
  }
}
main()
