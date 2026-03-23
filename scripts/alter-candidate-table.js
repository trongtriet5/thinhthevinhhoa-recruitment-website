const postgres = require('postgres')
require('dotenv').config({ path: '.env' })
require('dotenv').config({ path: '.env.local' })

const sql = postgres(process.env.DIRECT_URL, { ssl: 'require' })

async function main() {
  try {
    await sql`
      ALTER TABLE "CandidateApplication" 
      ADD COLUMN IF NOT EXISTS "cccd" VARCHAR(255);
    `
    console.log("Column 'cccd' added successfully")
  } catch (err) {
    console.error("Error altering table (add column):", err)
  }

  try {
    await sql`
      ALTER TABLE "CandidateApplication" 
      ADD CONSTRAINT candidate_cccd_jobid_key UNIQUE ("cccd", "jobId");
    `
    console.log("Constraint candidate_cccd_jobid_key added successfully")
  } catch (err) {
    console.error("Error altering table (add constraint):", err.message)
  }

  finally {
    process.exit(0)
  }
}
main()
