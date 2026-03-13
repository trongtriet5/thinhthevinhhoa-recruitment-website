const { nanoid } = require('nanoid')
const { createSqlClient } = require('./db')

const sql = createSqlClient()

const jobs = [
    {
        title: 'Cửa hàng trưởng',
        brand: 'MayCha',
        position: 'Quản lý cửa hàng (SM)',
        departmentGroup: 'Khối vận hành (Các cửa hàng)',
        location: 'TP. Hồ Chí Minh',
        type: 'Toàn thời gian',
        salary: '15 - 20 triệu',
        link: 'https://1office.vn/tuyen-dung/maycha-store-manager',
        description: 'Chịu trách nhiệm vận hành cửa hàng, quản lý doanh thu, hàng hóa và chất lượng dịch vụ.\nPhối hợp đào tạo đội ngũ và đảm bảo trải nghiệm khách hàng theo tiêu chuẩn thương hiệu.',
        requirements: 'Có kinh nghiệm quản lý cửa hàng F&B hoặc bán lẻ từ 1 năm trở lên.\nKỹ năng điều phối nhân sự, xử lý tình huống và chịu được áp lực doanh số.'
    },
    {
        title: 'Giám sát ca',
        brand: 'Tam Hảo',
        position: 'Giám sát vận hành',
        departmentGroup: 'Khối vận hành (Các cửa hàng)',
        location: 'Bình Dương',
        type: 'Toàn thời gian',
        salary: '10 - 13 triệu',
        link: 'https://1office.vn/tuyen-dung/tamhao-shift-supervisor',
        description: 'Giám sát hoạt động trong ca, phân công công việc và hỗ trợ cửa hàng trưởng kiểm soát chất lượng phục vụ.\nTheo dõi tồn kho ngắn hạn và xử lý các vấn đề phát sinh trong ca làm việc.',
        requirements: 'Tối thiểu 6 tháng kinh nghiệm ở vị trí tổ trưởng hoặc giám sát.\nCó tinh thần trách nhiệm, giao tiếp tốt và linh hoạt theo ca.'
    },
    {
        title: 'Nhân viên pha chế',
        brand: 'Trà Hú',
        position: 'Barista',
        departmentGroup: 'Khối vận hành (Các cửa hàng)',
        location: 'TP. Hồ Chí Minh, Đồng Nai',
        type: 'Toàn thời gian',
        salary: '7 - 9 triệu',
        link: 'https://1office.vn/tuyen-dung/trahu-barista',
        description: 'Thực hiện pha chế đồ uống đúng công thức và tiêu chuẩn trình bày.\nGiữ gìn khu vực quầy sạch sẽ, hỗ trợ kiểm kê nguyên vật liệu cuối ca.',
        requirements: 'Ưu tiên ứng viên đã từng làm việc trong ngành đồ uống.\nNhanh nhẹn, cẩn thận, có thể làm việc theo ca xoay.'
    },
    {
        title: 'Nhân viên phục vụ',
        brand: 'MayCha',
        position: 'Dịch vụ khách hàng',
        departmentGroup: 'Khối vận hành (Các cửa hàng)',
        location: 'TP. Hồ Chí Minh, Long An',
        type: 'Bán thời gian',
        salary: '24.000 - 28.000/giờ',
        link: 'https://1office.vn/tuyen-dung/maycha-service-staff',
        description: 'Đón tiếp khách hàng, hỗ trợ order và phục vụ tại cửa hàng.\nGiữ vệ sinh khu vực phục vụ và phối hợp với team để đảm bảo tốc độ ra món.',
        requirements: 'Thân thiện, giao tiếp tốt và có thể làm việc cuối tuần.\nPhù hợp với sinh viên cần công việc linh hoạt.'
    },
    {
        title: 'Chuyên viên tuyển dụng',
        brand: 'TTVH Group',
        position: 'HR Recruitment',
        departmentGroup: 'Khối văn phòng (Back Office)',
        location: 'TP. Hồ Chí Minh',
        type: 'Toàn thời gian',
        salary: '12 - 16 triệu',
        link: 'https://1office.vn/tuyen-dung/ttvh-talent-acquisition',
        description: 'Phụ trách tuyển dụng khối vận hành cửa hàng và văn phòng.\nLàm việc với các phòng ban để lập kế hoạch tuyển dụng, sàng lọc hồ sơ và điều phối phỏng vấn.',
        requirements: 'Có kinh nghiệm tuyển dụng mass hoặc retail/F&B là lợi thế.\nKỹ năng giao tiếp, tổ chức và theo dõi tiến độ tuyển dụng tốt.'
    },
    {
        title: 'Chuyên viên Marketing Trade',
        brand: 'Tam Hảo',
        position: 'Trade Marketing',
        departmentGroup: 'Khối văn phòng (Back Office)',
        location: 'TP. Hồ Chí Minh',
        type: 'Toàn thời gian',
        salary: '14 - 18 triệu',
        link: 'https://1office.vn/tuyen-dung/tamhao-trade-marketing',
        description: 'Triển khai các chương trình marketing tại điểm bán, phối hợp với vận hành và thiết kế để tăng hiệu quả doanh thu theo chiến dịch.\nTheo dõi hiệu quả POSM và tối ưu hoạt động activation tại cửa hàng.',
        requirements: 'Kinh nghiệm trade marketing từ 1 năm trở lên, ưu tiên ngành F&B.\nCó khả năng lập kế hoạch, làm việc đa phòng ban và bám sát tiến độ triển khai.'
    }
]

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function normalizeRichTextInput(value) {
    if (typeof value !== 'string') {
        return ''
    }

    const normalizedValue = value.replace(/\r\n/g, '\n').trim()
    if (!normalizedValue) {
        return ''
    }

    if (/<\/?[a-z][\s\S]*>/i.test(normalizedValue)) {
        return normalizedValue
    }

    return normalizedValue
        .split(/\n{2,}/)
        .map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
        .join('')
}

async function ensureTableShape() {
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
        )
    `

    await sql`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "position" TEXT NOT NULL DEFAULT ''`
    await sql`ALTER TABLE "Job" ADD COLUMN IF NOT EXISTS "departmentGroup" TEXT NOT NULL DEFAULT ''`
}

async function seedJobs() {
    let inserted = 0
    let skipped = 0
    const now = new Date()

    for (const job of jobs) {
        const existing = await sql`
            SELECT "id"
            FROM "Job"
            WHERE "title" = ${job.title}
              AND "brand" = ${job.brand}
              AND "location" = ${job.location}
            LIMIT 1
        `

        if (existing.length > 0) {
            skipped += 1
            continue
        }

        await sql`
            INSERT INTO "Job" (
                "id", "title", "brand", "position", "departmentGroup", "location", "type", "status", "salary", "link", "description", "requirements", "applicants", "createdAt", "updatedAt"
            ) VALUES (
                ${nanoid()},
                ${job.title},
                ${job.brand},
                ${job.position},
                ${job.departmentGroup || ''},
                ${job.location},
                ${job.type},
                'Đang tuyển',
                ${job.salary},
                ${job.link},
                ${normalizeRichTextInput(job.description)},
                ${normalizeRichTextInput(job.requirements)},
                0,
                ${now},
                ${now}
            )
        `

        inserted += 1
    }

    const [summary] = await sql`SELECT count(*)::int AS count FROM "Job"`
    console.log(`Seed completed. Inserted: ${inserted}, skipped: ${skipped}, total jobs: ${summary.count}`)
}

async function main() {
    try {
        console.log('Ensuring Job table schema...')
        await ensureTableShape()
        console.log('Seeding sample jobs...')
        await seedJobs()
        process.exit(0)
    } catch (error) {
        console.error('Seed failed:', error)
        process.exit(1)
    } finally {
        await sql.end({ timeout: 5 }).catch(() => {})
    }
}

main()