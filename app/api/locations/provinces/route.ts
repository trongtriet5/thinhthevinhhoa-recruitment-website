import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
    try {
        const provinces = await sql`
            SELECT code, name, full_name 
            FROM provinces 
            ORDER BY 
                CASE 
                    WHEN code IN ('01', '79', '31', '48', '92') THEN 0 
                    ELSE 1 
                END, 
                name ASC
        `
        return NextResponse.json(provinces)
    } catch (error) {
        console.error('Error fetching provinces:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
