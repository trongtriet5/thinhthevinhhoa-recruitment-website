import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await sql`
            UPDATE "Job"
            SET "applicants" = "applicants" + 1
            WHERE "id" = ${id}
        `
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error tracking click:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
