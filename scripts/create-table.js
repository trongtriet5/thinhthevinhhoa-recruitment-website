const { createSqlClient } = require('./db')

const sql = createSqlClient()

async function createTable() {
    try {
        console.log('Creating table...')
        await sql`
            CREATE TABLE IF NOT EXISTS "Job" (
                "id" TEXT NOT NULL,
                "title" TEXT NOT NULL,
                "brand" TEXT NOT NULL,
                "position" TEXT NOT NULL DEFAULT '',
                "departmentGroup" TEXT NOT NULL DEFAULT '',
                "location" TEXT NOT NULL,
                "type" TEXT NOT NULL DEFAULT 'Toàn thời gian',
                "status" TEXT NOT NULL DEFAULT 'Đang tuyển',
                "salary" TEXT NOT NULL,
                "link" TEXT,
                "description" TEXT NOT NULL,
                "requirements" TEXT NOT NULL,
                "applicants" INTEGER NOT NULL DEFAULT 0,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
            );
        `
        await sql`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "position" TEXT NOT NULL DEFAULT ''`
        await sql`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "departmentGroup" TEXT NOT NULL DEFAULT ''`
        console.log('Table created successfully!')
        process.exit(0)
    } catch (err) {
        console.error('Error creating table:', err)
        process.exit(1)
    } finally {
        await sql.end({ timeout: 5 }).catch(() => {})
    }
}

createTable()
