import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            name, phone, email, note, jobTitle, jobBrand, jobPosition, jobId, cvFile,
            private_code, gender, birthday, current_address, cf56
        } = body

        // Format birthday from YYYY-MM-DD to dd/mm/YYYY
        let formattedBirthday = ''
        if (birthday) {
            const [y, m, d] = birthday.split('-')
            formattedBirthday = `${d}/${m}/${y}`
        }

        // Format the phone number (keep only digits)
        const cleanPhone = phone.toString().replace(/\D/g, '')

        // Check if candidate already applied for this jobId
        if (cleanPhone && jobId) {
            const existing = await sql`SELECT id FROM "CandidateApplication" WHERE "phone" = ${cleanPhone} AND "jobId" = ${jobId}`
            if (existing.length > 0) {
                return NextResponse.json({ error: 'Duplicate', message: 'Bạn đã ứng tuyển vị trí này rồi! Hệ thống đã ghi nhận.' }, { status: 400 })
            }
        }

        const accessToken = process.env.OFFICE_ACCESS_TOKEN || ''
        // Put access_token in URL as some 1Office endpoints prefer it there
        const apiUrl = `https://maycha.1office.vn/api/recruitment/candidate/insert?access_token=${accessToken}`

        const candidateCode = `WEB_${Date.now()}_${Math.floor(Math.random() * 1000)}`

        const payload: any = {
            code: candidateCode,
            name: name,
            gender: gender,
            birthday: formattedBirthday,
            phone: phone,
            email: email,
            source: '13',
            channel_link: '/rc20434-394?lang=vn',
            private_code: private_code,
            current_address: current_address,
            cf56: cf56,
            campaign_current_id: 'MC0843401603266140',
            note: `${jobPosition || ''}`.trim(),
            field_raws: 'source,gender,cf56'
        }

        if (cvFile) {
            payload.files = JSON.stringify([cvFile])
        }

        console.log('Sending application to 1Office (Body size around:', JSON.stringify(payload).length, 'chars)')

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(payload)
        })

        const text = await response.text()
        let result: any = { message: text }

        try {
            if (text.trim().startsWith('{')) {
                result = JSON.parse(text)
            }
        } catch (e) {
            console.error('Failed to parse 1Office response as JSON:', text.substring(0, 100))
        }

        if (!response.ok) {
            console.error('1Office API error:', result)
            return NextResponse.json({ error: 'Failed to submit to 1Office', details: result }, { status: response.status })
        }

        // Record successful application
        if (cleanPhone && jobId) {
            try {
                await sql`INSERT INTO "CandidateApplication" ("phone", "jobId", "jobPosition") VALUES (${cleanPhone}, ${jobId}, ${jobPosition || ''}) ON CONFLICT DO NOTHING`
            } catch (err) {
                console.error('Failed to log CandidateApplication:', err)
            }
        }

        return NextResponse.json({ success: true, data: result })
    } catch (error) {
        console.error('Application submission error:', error)
        return NextResponse.json({ error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}
