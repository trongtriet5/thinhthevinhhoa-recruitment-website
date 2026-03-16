import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { normalizeRichTextInput } from '@/lib/rich-text'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json()
        const { id } = await params
        const now = new Date()

        // Destructure fields from the body
        const { title, brand, location, type, position, departmentGroup, status, salary, description, requirements } = body
        const normalizedDescription = normalizeRichTextInput(description)
        const normalizedRequirements = normalizeRichTextInput(requirements)

        const [updatedJob] = await sql`
            UPDATE "Job" SET 
                "title" = ${title},
                "brand" = ${brand},
                "location" = ${location},
                "type" = ${type},
                "position" = ${position},
                "departmentGroup" = ${departmentGroup || ''},
                "status" = ${status},
                "salary" = ${salary},
                "description" = ${normalizedDescription},
                "requirements" = ${normalizedRequirements},
                "updatedAt" = ${now}
            WHERE "id" = ${id}
            RETURNING *
        `

        if (!updatedJob) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        return NextResponse.json(updatedJob)
    } catch (error) {
        console.error('Error updating job:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await sql`DELETE FROM "Job" WHERE "id" = ${id}`
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting job:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
