import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { normalizeRichTextInput } from '@/lib/rich-text'
import { nanoid } from 'nanoid'

export async function GET() {
    try {
        const jobs = await sql`SELECT * FROM "Job" ORDER BY "createdAt" DESC`
        return NextResponse.json(jobs)
    } catch (error) {
        console.error('Error fetching jobs:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        // Destructure fields from the body, including 'status' which was missing in the original destructuring
        const { title, brand, location, type, status, salary, description, requirements, position, departmentGroup } = body
        const normalizedDescription = normalizeRichTextInput(description)
        const normalizedRequirements = normalizeRichTextInput(requirements)
        
        const id = nanoid()
        const now = new Date()

        const [newJob] = await sql`
            INSERT INTO "Job" (
                "id", "title", "brand", "location", "type", "status", "salary", "description", "requirements", "applicants", "position", "departmentGroup", "createdAt", "updatedAt"
            ) VALUES (
                ${id}, ${title}, ${brand}, ${location}, ${type || 'Toàn thời gian'}, ${status || 'Đang tuyển'}, ${salary}, ${normalizedDescription}, ${normalizedRequirements}, 0, ${position || ''}, ${departmentGroup || ''}, ${now}, ${now}
            ) RETURNING *
        `

        return NextResponse.json(newJob)
    } catch (error) {
        console.error('Error creating job:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
