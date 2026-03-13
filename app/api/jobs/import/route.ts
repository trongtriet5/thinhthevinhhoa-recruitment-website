import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { normalizeRichTextInput } from '@/lib/rich-text'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
    try {
        const jobs = await request.json()
        if (!Array.isArray(jobs)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
        }

        const now = new Date()
        const results = []

        for (const job of jobs) {
            const id = nanoid()
            const normalizedDescription = normalizeRichTextInput(job.description)
            const normalizedRequirements = normalizeRichTextInput(job.requirements)

            const [newJob] = await sql`
                INSERT INTO "Job" (
                    "id", "title", "brand", "location", "type", "status", "salary", "link", "description", "requirements", "applicants", "position", "departmentGroup", "createdAt", "updatedAt"
                ) VALUES (
                    ${id}, ${job.title}, ${job.brand}, ${job.location}, ${job.type || 'Toàn thời gian'}, 'Đang tuyển', ${job.salary}, ${job.link || ''}, ${normalizedDescription}, ${normalizedRequirements}, 0, ${job.position || ''}, ${job.departmentGroup || ''}, ${now}, ${now}
                ) RETURNING "id"
            `
            results.push(newJob)
        }

        return NextResponse.json({ success: true, count: results.length })
    } catch (error) {
        console.error('Error importing jobs:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
