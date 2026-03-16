import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const provinceCode = searchParams.get('provinceCode')

    if (!provinceCode) {
        return NextResponse.json({ error: 'provinceCode is required' }, { status: 400 })
    }

    try {
        const wards = await sql`
            SELECT code, name, full_name 
            FROM wards 
            WHERE province_code = ${provinceCode}
            ORDER BY name ASC
        `
        return NextResponse.json(wards)
    } catch (error) {
        console.error('Error fetching wards:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
