import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const accessToken = process.env.OFFICE_ACCESS_TOKEN
        if (!accessToken) {
            console.error('1Office Access Token is not defined in .env')
            return NextResponse.json({ error: 'Access token missing' }, { status: 500 })
        }

        const domain = 'maycha.1office.vn'
        const apiUrl = `https://${domain}/api/recruitment/candidate/fields/list?access_token=${accessToken}`

        try {
            const response = await fetch(apiUrl)
            const text = await response.text()
            
            if (text.trim().startsWith('{')) {
                const data = JSON.parse(text)
                if (data && data.data) {
                    const cf56Field = data.data.find((field: any) => field.code === 'cf56')
                    if (cf56Field && cf56Field.options) {
                        return NextResponse.json(cf56Field.options)
                    }
                }
            }
        } catch (e) {
            console.error('Error fetching fields list from 1Office:', e)
        }

        // Fallback options based on user provided list
        const fallbackOptions = [
            { id: 'An Giang', name: 'An Giang' },
            { id: 'Bà Rịa', name: 'Bà Rịa' },
            { id: 'Bình Thuận', name: 'Bình Thuận' },
            { id: 'Cần Thơ', name: 'Cần Thơ' },
            { id: 'Củ Chi', name: 'Củ Chi' },
            { id: 'Đà Nẵng', name: 'Đà Nẵng' },
            { id: 'Đồng Nai', name: 'Đồng Nai' },
            { id: 'Đồng Tháp', name: 'Đồng Tháp' },
            { id: 'Huyện Bình Chánh', name: 'Huyện Bình Chánh' },
            { id: 'Huyện Hóc Môn', name: 'Huyện Hóc Môn' },
            { id: 'Huyện Nhà Bè', name: 'Huyện Nhà Bè' },
            { id: 'Kiên Giang', name: 'Kiên Giang' },
            { id: 'Long An', name: 'Long An' },
            { id: 'Phan Thiết', name: 'Phan Thiết' },
            { id: 'Quận 1', name: 'Quận 1' },
            { id: 'Quận 10', name: 'Quận 10' },
            { id: 'Quận 11', name: 'Quận 11' },
            { id: 'Quận 12', name: 'Quận 12' },
            { id: 'Quận 2', name: 'Quận 2' },
            { id: 'Quận 3', name: 'Quận 3' },
            { id: 'Quận 4', name: 'Quận 4' },
            { id: 'Quận 5', name: 'Quận 5' },
            { id: 'Quận 6', name: 'Quận 6' },
            { id: 'Quận 7', name: 'Quận 7' },
            { id: 'Quận 8', name: 'Quận 8' },
            { id: 'Quận 9', name: 'Quận 9' },
            { id: 'Quận Bình Tân', name: 'Quận Bình Tân' },
            { id: 'Quận Bình Thạnh', name: 'Quận Bình Thạnh' },
            { id: 'Quận Gò Vấp', name: 'Quận Gò Vấp' },
            { id: 'Quận Phú Nhuận', name: 'Quận Phú Nhuận' },
            { id: 'Quận Tân Bình', name: 'Quận Tân Bình' },
            { id: 'Quận Tân Phú', name: 'Quận Tân Phú' },
            { id: 'Tây Ninh', name: 'Tây Ninh' },
            { id: 'Tiền Giang', name: 'Tiền Giang' },
            { id: 'TP Thủ Dầu Một', name: 'TP Thủ Dầu Một' },
            { id: 'TP. Dĩ An', name: 'TP. Dĩ An' },
            { id: 'TP. Rạch Giá', name: 'TP. Rạch Giá' },
            { id: 'TP. Thủ Đức', name: 'TP. Thủ Đức' },
            { id: 'TX. Thuận An', name: 'TX. Thuận An' },
            { id: 'Thành phố Đà Lạt', name: 'Thành phố Đà Lạt' },
            { id: 'Thành phố Huế', name: 'Thành phố Huế' },
            { id: 'Trà Vinh', name: 'Trà Vinh' },
            { id: 'Vũng Tàu', name: 'Vũng Tàu' }
        ]
        
        return NextResponse.json(fallbackOptions)
    } catch (error) {
        console.error('Error in cf56 route:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
