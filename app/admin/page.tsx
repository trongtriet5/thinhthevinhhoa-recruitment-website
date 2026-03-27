'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamicImport from 'next/dynamic'
import {
    IconPlus,
    IconSearch,
    IconEdit,
    IconTrash,
    IconEye,
    IconBriefcase,
    IconLogout,
    IconMapPin,
    IconCurrencyDollar,
    IconCalendar,
    IconDownload,
    IconFileImport,
    IconChevronDown,
    IconCheck
} from '@tabler/icons-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { decodeHtml } from '@/lib/rich-text'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'


const BRANDS = ['MayCha', 'Tam Hảo', 'Trà Hú', 'BO', 'DCCK']
const DEPARTMENT_GROUPS = [
    'Khối vận hành',
    'Khối văn phòng',
    'Khối sản xuất',
    'Bếp trung tâm'
]
const POSITIONS = [
    'Quản lý cửa hàng (SM)',
    'Trưởng ca (SL)',
    'All Star Full-time (ASF)',
    'All Star Part-time (ASP)',
    'Nhân viên Full-time (SF)',
    'Nhân viên Part-time (STAFF)',
    'Nhân viên Part-time ca đêm (STAFF-D)'
]
const ALL_PROVINCES = [
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh', 'Bến Tre', 'Bình Định',
    'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng', 'Đà Nẵng', 'Đắk Lắk',
    'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh',
    'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum',
    'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận',
    'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
    'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang',
    'TP. Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
]

export default function AdminPage() {
    const [jobs, setJobs] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedJob, setSelectedJob] = useState<any>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isOtherPosition, setIsOtherPosition] = useState(false)
    const [customPosition, setCustomPosition] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        location: '',
        type: 'Toàn thời gian',
        position: '',
        departmentGroup: '',
        salary: '',
        salaryMin: '',
        salaryMax: '',
        isSalaryNegotiable: false,
        description: '',
        requirements: '',
        status: 'Đang tuyển'
    })

    const router = useRouter()

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/jobs')
            const data = await res.json()
            if (Array.isArray(data)) {
                setJobs(data)
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn')
        if (loggedIn !== 'true') {
            router.push('/login')
        } else {
            setIsLoggedIn(true)
            fetchJobs()
        }
    }, [router])

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn')
        router.push('/login')
    }

    const handleLocationToggle = (province: string) => {
        const currentLocations = formData.location ? formData.location.split(', ') : []
        let newLocations
        if (currentLocations.includes(province)) {
            newLocations = currentLocations.filter(l => l !== province)
        } else {
            newLocations = [...currentLocations, province]
        }
        setFormData({ ...formData, location: newLocations.join(', ') })
    }

    const formatCurrency = (val: string) => {
        if (!val) return ''
        const numeric = val.replace(/\D/g, '')
        return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }

    const unformatCurrency = (val: string) => {
        return val.replace(/\./g, '')
    }

    const handleAddJob = async (e: React.FormEvent) => {
        e.preventDefault()
        const finalPosition = isOtherPosition ? customPosition : formData.position

        let finalSalary = formData.salary
        if (formData.isSalaryNegotiable) {
            finalSalary = 'Thỏa thuận'
        } else if (formData.salaryMin || formData.salaryMax) {
            const min = formData.salaryMin ? formData.salaryMin + 'đ' : '?'
            const max = formData.salaryMax ? formData.salaryMax + 'đ' : '?'
            finalSalary = `${min} - ${max}`
        }

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, position: finalPosition, salary: finalSalary })
            })
            if (res.ok) {
                setIsAddDialogOpen(false)
                resetForm()
                fetchJobs()
            }
        } catch (error) {
            console.error('Failed to add job:', error)
        }
    }

    const handleDeleteJob = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) {
            try {
                const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
                if (res.ok) {
                    fetchJobs()
                }
            } catch (error) {
                console.error('Failed to delete job:', error)
            }
        }
    }

    const handleEditJob = async (e: React.FormEvent) => {
        e.preventDefault()
        const finalPosition = isOtherPosition ? customPosition : formData.position

        let finalSalary = formData.salary
        if (formData.isSalaryNegotiable) {
            finalSalary = 'Thỏa thuận'
        } else if (formData.salaryMin || formData.salaryMax) {
            const min = formData.salaryMin ? formData.salaryMin + 'đ' : '?'
            const max = formData.salaryMax ? formData.salaryMax + 'đ' : '?'
            finalSalary = `${min} - ${max}`
        }

        try {
            const res = await fetch(`/api/jobs/${selectedJob.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, position: finalPosition, salary: finalSalary })
            })
            if (res.ok) {
                setIsEditDialogOpen(false)
                resetForm()
                fetchJobs()
            }
        } catch (error) {
            console.error('Failed to edit job:', error)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            brand: '',
            location: '',
            type: 'Toàn thời gian',
            position: '',
            departmentGroup: '',
            salary: '',
            salaryMin: '',
            salaryMax: '',
            isSalaryNegotiable: false,
            description: '',
            requirements: '',
            status: 'Đang tuyển'
        })
        setSelectedJob(null)
        setIsOtherPosition(false)
        setCustomPosition('')
    }

    const openEditDialog = (job: any) => {
        setSelectedJob(job)

        const stripHtml = (html: string) => {
            if (!html) return ''
            let text = html.replace(/<br\s*[\/]?>/gi, '\n')
            text = text.replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
            text = text.replace(/<[^>]*>?/gm, '')
            text = decodeHtml(text)
            return text.trim()
        }

        setFormData({
            title: job.title,
            brand: job.brand,
            location: job.location,
            type: job.type,
            position: job.position || '',
            departmentGroup: job.departmentGroup || '',
            salary: job.salary,
            salaryMin: '',
            salaryMax: '',
            isSalaryNegotiable: job.salary === 'Thỏa thuận',
            description: stripHtml(job.description),
            requirements: stripHtml(job.requirements),
            status: job.status
        })

        // Try to parse salary back if possible
        if (job.salary && job.salary.includes(' - ')) {
            const parts = job.salary.split(' - ')
            const min = parts[0].replace(/đ/g, '')
            const max = parts[1].replace(/đ/g, '')
            setFormData(prev => ({ ...prev, salaryMin: min, salaryMax: max }))
        }

        // Handle custom position logic
        if (job.position && !POSITIONS.includes(job.position)) {
            setIsOtherPosition(true)
            setCustomPosition(job.position)
        } else {
            setIsOtherPosition(false)
            setCustomPosition('')
        }

        setIsEditDialogOpen(true)
    }

    const getLogo = (brand: string) => {
        const b = brand.toLowerCase()
        if (b.includes('maycha')) return '/logo_maycha.png'
        if (b.includes('tam hảo')) return '/logo_tamhao.jpg'
        if (b.includes('trà hú')) return '/logo_trahu.png'
        return '/logo_ttvh.png'
    }

    const handleDownloadTemplate = () => {
        import('xlsx').then(XLSX => {
            const template = [
                {
                    'Tiêu đề': 'Cửa hàng trưởng',
                    'Thương hiệu': 'MayCha',
                    'Vị trí': 'Quản lý cửa hàng (SM)',
                    'Khối phòng ban': 'Khối vận hành',
                    'Địa điểm': 'TP. Hồ Chí Minh, Bình Dương',
                    'Mức lương': '15 - 20 triệu',
                    'Loại hình': 'Toàn thời gian',
                    'Mô tả công việc': 'Nội dung mô tả...\nCó thể xuống dòng mà không cần HTML.',
                    'Yêu cầu': 'Nội dung yêu cầu...\nCó thể xuống dòng mà không cần HTML.'
                }
            ]
            const ws = XLSX.utils.json_to_sheet(template)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'Template')
            XLSX.writeFile(wb, 'Template_TuyenDung_TTVH.xlsx')
        })
    }

    const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const XLSX = await import('xlsx')
        const reader = new FileReader()
        reader.onload = async (evt) => {
            const bstr = evt.target?.result
            const wb = XLSX.read(bstr, { type: 'binary' })
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]
            const data: any[] = XLSX.utils.sheet_to_json(ws)

            const formattedJobs = data.map(row => ({
                title: row['Tiêu đề'] || '',
                brand: row['Thương hiệu'] || '',
                position: row['Vị trí'] || '',
                departmentGroup: row['Khối phòng ban'] || '',
                location: row['Địa điểm'] || '',
                salary: row['Mức lương'] || '',
                type: row['Loại hình'] || 'Toàn thời gian',
                description: row['Mô tả công việc'] || '',
                requirements: row['Yêu cầu'] || ''
            }))

            if (formattedJobs.length > 0) {
                try {
                    const res = await fetch('/api/jobs/import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formattedJobs)
                    })
                    if (res.ok) {
                        alert(`Đã import thành công ${formattedJobs.length} tin tuyển dụng!`)
                        fetchJobs()
                    }
                } catch (error) {
                    alert('Lỗi khi import dữ liệu')
                }
            }
        }
        reader.readAsBinaryString(file)
    }



    if (!isLoggedIn) return null

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar */}
            <aside className="w-72 border-r border-zinc-100 bg-white flex flex-col fixed h-full z-20">
                <div className="p-12">
                    <Image src="/logo_ttvh.png" alt="Logo" width={220} height={60} className="h-16 w-auto object-contain" />
                </div>

                <nav className="flex-1 px-6 space-y-1">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary text-sm font-black uppercase tracking-widest transition-all">
                        <IconBriefcase size={14} stroke={2.5} />
                        Tin tuyển dụng
                    </a>
                </nav>

                <div className="p-6 border-t border-zinc-100">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-bold uppercase tracking-widest"
                    >
                        <IconLogout size={14} stroke={2} />
                        Đăng xuất
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col ml-72 bg-zinc-50/30">
                <header className="h-20 border-b border-zinc-100 flex items-center justify-between px-12 shrink-0 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
                    <div className="space-y-1">
                        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">Hệ thống quản trị</h1>
                        <p className="text-sm text-zinc-400 font-medium uppercase tracking-widest">Thinh The Vinh Hoa Recruitment Portal</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-zinc-900 leading-tight">Administrator</p>
                            <p className="text-sm text-zinc-400 uppercase tracking-tighter">Quản trị viên</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 border border-zinc-200 shadow-sm overflow-hidden">
                            <Image src="/logo_ttvh.png" alt="TTVH Logo" width={48} height={48} className="object-contain" />
                        </div>
                    </div>
                </header>

                <div className="p-12 space-y-10 max-w-[1400px] mx-auto w-full">
                    {/* Actions Bar */}
                    <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                        <div className="relative flex-1 max-w-lg ml-2">
                            <IconSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <Input
                                placeholder="Tìm kiếm vị trí, thương hiệu..."
                                className="pl-14 h-14 bg-zinc-50/50 border-transparent rounded-[1.5rem] text-[13px] font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 pr-2">
                            <Button
                                onClick={handleDownloadTemplate}
                                variant="outline"
                                className="h-14 px-6 rounded-[1.5rem] border-zinc-200 text-sm font-black uppercase tracking-widest hover:bg-zinc-50 transition-all shrink-0"
                            >
                                <IconDownload size={16} stroke={2.5} className="mr-2" />
                                Template
                            </Button>

                            <div className="relative shrink-0">
                                <Button
                                    variant="outline"
                                    className="h-14 px-6 rounded-[1.5rem] border-zinc-200 text-sm font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                                >
                                    <IconFileImport size={16} stroke={2.5} className="mr-2" />
                                    Import
                                </Button>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImportExcel}
                                />
                            </div>

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="h-14 px-8 rounded-[1.5rem] bg-black hover:bg-primary hover:text-black text-white text-sm font-black uppercase tracking-[0.2em] gap-3 transition-all shadow-xl active:scale-[0.98] shrink-0">
                                        <IconPlus size={16} stroke={3} />
                                        Tạo tin tuyển dụng
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[850px] w-[95vw] rounded-[2.5rem] overflow-hidden p-0 border-0 shadow-2xl">
                                    <form onSubmit={handleAddJob} className="flex flex-col h-full max-h-[90vh]">
                                        <div className="bg-primary p-8 md:p-10 text-black shrink-0 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                                            <DialogHeader className="relative z-10">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-primary">
                                                        <IconPlus size={24} stroke={3} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-none">Mở vị trí mới</DialogTitle>
                                                        <DialogDescription className="text-black/50 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                                            Phát hành tin tuyển dụng lên Website
                                                        </DialogDescription>
                                                    </div>
                                                </div>
                                            </DialogHeader>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-white space-y-10 scrollbar-thin">
                                            {/* Thông tin cơ bản */}
                                            <section className="space-y-6">
                                                <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                                    <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900">Thông tin cơ bản</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2.5">
                                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Tiêu đề công việc</Label>
                                                        <Input
                                                            required
                                                            placeholder="VD: Cửa hàng trưởng"
                                                            className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none font-bold text-sm"
                                                            value={formData.title}
                                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2.5">
                                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Thương hiệu</Label>
                                                        <div className="relative">
                                                            <select
                                                                required
                                                                className="w-full h-14 px-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none outline-none appearance-none"
                                                                value={formData.brand}
                                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                            >
                                                                <option value="">Chọn thương hiệu</option>
                                                                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                                            </select>
                                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                                <IconChevronDown size={14} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2.5">
                                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Khối phòng ban</Label>
                                                        <div className="relative">
                                                            <select
                                                                required
                                                                className="w-full h-14 px-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none outline-none appearance-none"
                                                                value={formData.departmentGroup}
                                                                onChange={(e) => setFormData({ ...formData, departmentGroup: e.target.value })}
                                                            >
                                                                <option value="">Chọn khối phòng ban</option>
                                                                {DEPARTMENT_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                                                            </select>
                                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                                <IconChevronDown size={14} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2.5">
                                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Loại hình</Label>
                                                        <div className="relative">
                                                            <select
                                                                className="w-full h-14 px-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none outline-none appearance-none"
                                                                value={formData.type}
                                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                            >
                                                                <option value="Toàn thời gian">Toàn thời gian</option>
                                                                <option value="Bán thời gian">Bán thời gian</option>
                                                                <option value="Thời vụ">Thời vụ</option>
                                                            </select>
                                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                                <IconChevronDown size={14} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Vị trí & Lương */}
                                            <section className="space-y-6">
                                                <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                                    <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900">Chuyên môn & Thu nhập</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Vị trí chuyên môn</Label>
                                                        <div className="space-y-4">
                                                            <div className="relative">
                                                                <select
                                                                    required
                                                                    className="w-full h-14 px-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none outline-none appearance-none"
                                                                    value={isOtherPosition ? 'Khác' : formData.position}
                                                                    onChange={(e) => {
                                                                        if (e.target.value === 'Khác') {
                                                                            setIsOtherPosition(true)
                                                                            setFormData({ ...formData, position: '' })
                                                                        } else {
                                                                            setIsOtherPosition(false)
                                                                            setFormData({ ...formData, position: e.target.value })
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="">Chọn vị trí chuyên môn</option>
                                                                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                                                    <option value="Khác">Vị trí khác...</option>
                                                                </select>
                                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                                    <IconChevronDown size={14} />
                                                                </div>
                                                            </div>

                                                            {isOtherPosition && (
                                                                <Input
                                                                    required
                                                                    placeholder="Nhập vị trí cụ thể..."
                                                                    className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none font-bold text-sm animate-in zoom-in-95 duration-200"
                                                                    value={customPosition}
                                                                    onChange={(e) => setCustomPosition(e.target.value)}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between ml-1">
                                                            <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Mức lương (VNĐ)</Label>
                                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                                <div className={cn(
                                                                    "w-10 h-6 rounded-full transition-all flex items-center p-1",
                                                                    formData.isSalaryNegotiable ? "bg-primary" : "bg-zinc-200"
                                                                )}>
                                                                    <div className={cn(
                                                                        "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                                                                        formData.isSalaryNegotiable ? "translate-x-4" : "translate-x-0"
                                                                    )} />
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={formData.isSalaryNegotiable}
                                                                    onChange={(e) => setFormData({ ...formData, isSalaryNegotiable: e.target.checked })}
                                                                    className="sr-only"
                                                                />
                                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-black transition-colors">Thỏa thuận</span>
                                                            </label>
                                                        </div>

                                                        {!formData.isSalaryNegotiable ? (
                                                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 transition-all">
                                                                <div className="flex-1 relative">
                                                                    <Input
                                                                        placeholder="Từ"
                                                                        className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none font-bold text-sm pr-10"
                                                                        value={formData.salaryMin}
                                                                        onChange={(e) => setFormData({ ...formData, salaryMin: formatCurrency(e.target.value) })}
                                                                    />
                                                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-300">đ</span>
                                                                </div>
                                                                <div className="w-4 h-[2px] bg-zinc-100 shrink-0" />
                                                                <div className="flex-1 relative">
                                                                    <Input
                                                                        placeholder="Đến"
                                                                        className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none font-bold text-sm pr-10"
                                                                        value={formData.salaryMax}
                                                                        onChange={(e) => setFormData({ ...formData, salaryMax: formatCurrency(e.target.value) })}
                                                                    />
                                                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-300">đ</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-14 flex items-center px-6 bg-primary/5 border border-primary/10 rounded-2xl text-[13px] font-bold text-primary italic">
                                                                Lương thỏa thuận khi phỏng vấn
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Địa điểm */}
                                            <section className="space-y-6">
                                                <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                                    <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900">Địa điểm làm việc</h3>
                                                </div>
                                                <div className="p-8 bg-zinc-50/50 border border-zinc-100 rounded-[2rem] space-y-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 italic">Chọn các tỉnh thành áp dụng tin tuyển dụng này</p>
                                                        <div className="px-3 py-1 bg-white border border-zinc-100 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                                                            {formData.location.split(', ').filter(Boolean).length} Đã chọn
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-4 scrollbar-thin">
                                                        {ALL_PROVINCES.sort().map(p => {
                                                            const isSelected = formData.location.split(', ').includes(p);
                                                            return (
                                                                <label
                                                                    key={p}
                                                                    className={cn(
                                                                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 group",
                                                                        isSelected
                                                                            ? "bg-primary border-primary text-black shadow-md shadow-primary/20"
                                                                            : "bg-white border-zinc-100 text-zinc-500 hover:border-primary/50"
                                                                    )}
                                                                >
                                                                    <div className={cn(
                                                                        "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                                                                        isSelected ? "bg-black border-black text-primary" : "bg-zinc-50 border-zinc-200"
                                                                    )}>
                                                                        {isSelected && <IconCheck size={10} stroke={4} />}
                                                                    </div>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected}
                                                                        onChange={() => handleLocationToggle(p)}
                                                                        className="sr-only"
                                                                    />
                                                                    <span className="text-[12px] font-bold truncate">{p}</span>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Chi tiết công việc */}
                                            <section className="space-y-6 pb-6">
                                                <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                                    <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900">Nội dung chi tiết</h3>
                                                </div>

                                                <div className="space-y-8">
                                                    <div className="space-y-3">
                                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Mô tả công việc</Label>
                                                        <div className="bg-zinc-50/50 rounded-[2rem] border border-zinc-100 overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 focus-within:bg-white focus-within:border-primary/30 transition-all shadow-sm">
                                                            <textarea
                                                                value={formData.description}
                                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                                className="w-full min-h-[180px] p-6 bg-transparent outline-none resize-y text-sm font-medium text-zinc-700 leading-relaxed placeholder:italic placeholder:text-zinc-400"
                                                                placeholder="Mỗi dòng là một ý mô tả..."
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Yêu cầu ứng viên</Label>
                                                        <div className="bg-zinc-50/50 rounded-[2rem] border border-zinc-100 overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 focus-within:bg-white focus-within:border-primary/30 transition-all shadow-sm">
                                                            <textarea
                                                                value={formData.requirements}
                                                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                                                className="w-full min-h-[180px] p-6 bg-transparent outline-none resize-y text-sm font-medium text-zinc-700 leading-relaxed placeholder:italic placeholder:text-zinc-400"
                                                                placeholder="Mỗi dòng là một ý yêu cầu..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>

                                        <DialogFooter className="p-8 bg-zinc-50/80 border-t border-zinc-100 shrink-0">
                                            <div className="flex items-center gap-4 w-full">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsAddDialogOpen(false)}
                                                    className="h-16 px-8 rounded-2xl border-zinc-200 text-sm font-black uppercase tracking-widest hover:bg-white transition-all"
                                                >
                                                    Hủy
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="flex-1 h-16 rounded-2xl bg-black text-white text-[13px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] active:scale-[0.98]"
                                                >
                                                    Phát hành tin tuyển dụng ngay
                                                </Button>
                                            </div>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Job Cards Layout */}
                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            <div className="py-40 text-center space-y-4">
                                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-zinc-400 font-bold italic text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
                            </div>
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div key={job.id} className="group rounded-2xl border border-zinc-200/60 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-[0_24px_60px_-36px_rgba(0,0,0,0.35)] flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">

                                    <div className="w-16 h-16 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 p-3">
                                        <Image
                                            src={getLogo(job.brand)}
                                            alt={job.brand}
                                            width={60}
                                            height={60}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                                        <div className="flex items-center justify-center sm:justify-start gap-4">
                                            <span className="text-sm font-black uppercase tracking-widest text-primary">{job.brand}</span>
                                            {job.departmentGroup && (
                                                <span className="text-[9px] font-black tracking-widest text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                                                    {job.departmentGroup}
                                                </span>
                                            )}
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${job.status === 'Đang tuyển' ? 'border-green-200 text-green-600 bg-green-50' : 'border-zinc-200 text-zinc-400 bg-zinc-50'
                                                }`}>
                                                {job.status}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-black tracking-tight text-zinc-900 line-clamp-1">
                                            {job.title}
                                            {job.position && (
                                                <span className="ml-2 text-sm text-zinc-400 font-bold bg-zinc-100 px-2 py-0.5 rounded uppercase">
                                                    {job.position.split('(')[1]?.replace(')', '') || job.position}
                                                </span>
                                            )}
                                        </h3>

                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-1 text-sm font-bold text-zinc-400">
                                            <span className="flex items-center gap-2">
                                                <IconMapPin size={10} className="opacity-50" />
                                                <span className="truncate max-w-[200px]">{job.location}</span>
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <IconCurrencyDollar size={10} className="text-primary" />
                                                {job.salary}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[220px] sm:items-end">
                                        <div className="flex w-full flex-wrap items-center justify-end gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-1.5 transition-all duration-300 sm:w-auto sm:bg-white/80 sm:opacity-75 sm:shadow-sm sm:group-hover:opacity-100 sm:group-hover:shadow-md">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-10 flex-1 rounded-xl border-zinc-200 bg-white px-4 text-sm font-black uppercase tracking-widest transition-all hover:border-black hover:bg-black hover:text-white sm:flex-none"
                                                onClick={() => openEditDialog(job)}
                                            >
                                                <IconEdit size={14} className="mr-2" />
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-10 flex-1 rounded-xl border-zinc-200 bg-white px-4 text-sm font-black uppercase tracking-widest transition-all hover:border-red-500 hover:bg-red-500 hover:text-white sm:flex-none"
                                                onClick={() => handleDeleteJob(job.id)}
                                            >
                                                <IconTrash size={14} className="mr-2" />
                                                Xóa
                                            </Button>
                                        </div>

                                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl px-6 py-4 flex flex-col items-center justify-center min-h-[88px] w-full sm:min-w-[140px] sm:w-auto transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/[0.03]">
                                            <span className="text-xl font-black tracking-tighter text-zinc-900">{job.applicants}</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Lượt quan tâm</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center border-2 border-dashed border-black/5 rounded-[3rem] bg-white">
                                <p className="text-zinc-300 font-bold italic text-xl uppercase tracking-widest">Hệ thống chưa có tin tuyển dụng nào.</p>
                                <Button
                                    onClick={() => setIsAddDialogOpen(true)}
                                    variant="ghost"
                                    className="mt-6 text-primary font-black uppercase tracking-widest text-sm hover:bg-primary hover:text-black rounded-xl px-10 h-14 transition-all"
                                >
                                    Bắt đầu tạo ngay
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[850px] w-[95vw] rounded-[2.5rem] overflow-hidden p-0 border-0 shadow-2xl">
                    <form onSubmit={handleEditJob} className="flex flex-col h-full max-h-[90vh]">
                        <div className="bg-zinc-900 p-8 md:p-10 text-white shrink-0 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                            <DialogHeader className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black">
                                        <IconEdit size={24} stroke={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight uppercase">Cập nhật tin</DialogTitle>
                                        <DialogDescription className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 italic">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                            Chế độ hiệu chỉnh • ID: {selectedJob?.id?.substring(0, 8)}...
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-white space-y-10 scrollbar-thin">
                            {/* Thông tin cơ bản */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900">Thông tin cơ bản</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Tiêu đề công việc</Label>
                                        <Input
                                            required
                                            placeholder="VD: Cửa hàng trưởng"
                                            className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none font-bold text-sm"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Thương hiệu</Label>
                                        <div className="relative">
                                            <select
                                                required
                                                className="w-full h-14 px-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none outline-none appearance-none"
                                                value={formData.brand}
                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                            >
                                                <option value="">Chọn thương hiệu</option>
                                                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                <IconChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Khối phòng ban</Label>
                                        <div className="relative">
                                            <select
                                                required
                                                className="w-full h-14 px-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none outline-none appearance-none"
                                                value={formData.departmentGroup}
                                                onChange={(e) => setFormData({ ...formData, departmentGroup: e.target.value })}
                                            >
                                                <option value="">Chọn khối phòng ban</option>
                                                {DEPARTMENT_GROUPS.map(group => <option key={group} value={group}>{group}</option>)}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                <IconChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2.5">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Loại hình</Label>
                                        <div className="relative">
                                            <select
                                                className="w-full h-14 px-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none outline-none appearance-none"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            >
                                                <option value="Toàn thời gian">Toàn thời gian</option>
                                                <option value="Bán thời gian">Bán thời gian</option>
                                                <option value="Thời vụ">Thời vụ</option>
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                <IconChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Vị trí & Lương */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900">Chuyên môn & Thu nhập</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Vị trí chuyên môn</Label>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <select
                                                    required
                                                    className="w-full h-14 px-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none outline-none appearance-none"
                                                    value={isOtherPosition ? 'Khác' : formData.position}
                                                    onChange={(e) => {
                                                        if (e.target.value === 'Khác') {
                                                            setIsOtherPosition(true)
                                                            setFormData({ ...formData, position: '' })
                                                        } else {
                                                            setIsOtherPosition(false)
                                                            setFormData({ ...formData, position: e.target.value })
                                                        }
                                                    }}
                                                >
                                                    <option value="">Chọn vị trí chuyên môn</option>
                                                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                                    <option value="Khác">Vị trí khác...</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                                    <IconChevronDown size={14} />
                                                </div>
                                            </div>

                                            {isOtherPosition && (
                                                <Input
                                                    required
                                                    placeholder="Nhập vị trí cụ thể..."
                                                    className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none font-bold text-sm animate-in zoom-in-95 duration-200"
                                                    value={customPosition}
                                                    onChange={(e) => setCustomPosition(e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between ml-1">
                                            <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Mức lương (VNĐ)</Label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <div className={cn(
                                                    "w-10 h-6 rounded-full transition-all flex items-center p-1",
                                                    formData.isSalaryNegotiable ? "bg-primary" : "bg-zinc-200"
                                                )}>
                                                    <div className={cn(
                                                        "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                                                        formData.isSalaryNegotiable ? "translate-x-4" : "translate-x-0"
                                                    )} />
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isSalaryNegotiable}
                                                    onChange={(e) => setFormData({ ...formData, isSalaryNegotiable: e.target.checked })}
                                                    className="sr-only"
                                                />
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-black transition-colors">Thỏa thuận</span>
                                            </label>
                                        </div>

                                        {!formData.isSalaryNegotiable ? (
                                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 transition-all">
                                                <div className="flex-1 relative">
                                                    <Input
                                                        placeholder="Từ"
                                                        className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none font-bold text-sm pr-10"
                                                        value={formData.salaryMin}
                                                        onChange={(e) => setFormData({ ...formData, salaryMin: formatCurrency(e.target.value) })}
                                                    />
                                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-300">đ</span>
                                                </div>
                                                <div className="w-4 h-[2px] bg-zinc-100 shrink-0" />
                                                <div className="flex-1 relative">
                                                    <Input
                                                        placeholder="Đến"
                                                        className="rounded-2xl h-14 border-zinc-100 bg-zinc-50/50 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all shadow-none font-bold text-sm pr-10"
                                                        value={formData.salaryMax}
                                                        onChange={(e) => setFormData({ ...formData, salaryMax: formatCurrency(e.target.value) })}
                                                    />
                                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-300">đ</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-14 flex items-center px-6 bg-primary/5 border border-primary/10 rounded-2xl text-[13px] font-bold text-primary italic">
                                                Lương thỏa thuận khi phỏng vấn
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Địa điểm */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900">Địa điểm làm việc</h3>
                                </div>
                                <div className="p-8 bg-zinc-50/50 border border-zinc-100 rounded-[2rem] space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 italic">Chọn các tỉnh thành áp dụng tin tuyển dụng này</p>
                                        <div className="px-3 py-1 bg-white border border-zinc-100 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                                            {formData.location.split(', ').filter(Boolean).length} Đã chọn
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-4 scrollbar-thin">
                                        {ALL_PROVINCES.sort().map(p => {
                                            const isSelected = formData.location.split(', ').includes(p);
                                            return (
                                                <label
                                                    key={p}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 group",
                                                        isSelected
                                                            ? "bg-primary border-primary text-black shadow-md shadow-primary/20"
                                                            : "bg-white border-zinc-100 text-zinc-500 hover:border-primary/50"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                                                        isSelected ? "bg-black border-black text-primary" : "bg-zinc-50 border-zinc-200"
                                                    )}>
                                                        {isSelected && <IconCheck size={10} stroke={4} />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleLocationToggle(p)}
                                                        className="sr-only"
                                                    />
                                                    <span className="text-[12px] font-bold truncate">{p}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>

                            {/* Trạng thái */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900">Trạng thái tin đăng</h3>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {['Đang tuyển', 'Tạm dừng', 'Đã đóng'].map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status })}
                                            className={cn(
                                                "px-8 h-12 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all relative overflow-hidden group",
                                                formData.status === status
                                                    ? "bg-black text-white shadow-xl scale-105"
                                                    : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100"
                                            )}
                                        >
                                            {status}
                                            {formData.status === status && (
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Chi tiết công việc */}
                            <section className="space-y-6 pb-6">
                                <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-900">Nội dung chi tiết</h3>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Mô tả công việc</Label>
                                        <div className="bg-zinc-50/50 rounded-[2rem] border border-zinc-100 overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 focus-within:bg-white focus-within:border-primary/30 transition-all shadow-sm">
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full min-h-[180px] p-6 bg-transparent outline-none resize-y text-sm font-medium text-zinc-700 leading-relaxed placeholder:italic placeholder:text-zinc-400"
                                                placeholder="Mỗi dòng là một ý mô tả..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase tracking-widest text-zinc-400 ml-1">Yêu cầu ứng viên</Label>
                                        <div className="bg-zinc-50/50 rounded-[2rem] border border-zinc-100 overflow-hidden focus-within:ring-4 focus-within:ring-primary/10 focus-within:bg-white focus-within:border-primary/30 transition-all shadow-sm">
                                            <textarea
                                                value={formData.requirements}
                                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                                className="w-full min-h-[180px] p-6 bg-transparent outline-none resize-y text-sm font-medium text-zinc-700 leading-relaxed placeholder:italic placeholder:text-zinc-400"
                                                placeholder="Mỗi dòng là một ý yêu cầu..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <DialogFooter className="p-8 bg-zinc-50/80 border-t border-zinc-100 shrink-0">
                            <div className="flex items-center gap-4 w-full">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                    className="h-16 px-8 rounded-2xl border-zinc-200 text-sm font-black uppercase tracking-widest hover:bg-white transition-all"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-16 rounded-2xl bg-zinc-900 text-white text-[13px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] active:scale-[0.98]"
                                >
                                    Cập nhật thông tin ngay
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <style jsx global>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #f4f4f5;
                    border-radius: 10px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #e4e4e7;
                }
            `}</style>
        </div>
    )
}
