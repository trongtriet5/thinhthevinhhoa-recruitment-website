'use client'

import { useState, useEffect } from 'react'
import { IconMapPin, IconClock, IconCurrencyDollar, IconCalendar, IconEye, IconChevronRight } from '@tabler/icons-react'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const ALL_PROVINCES = [
    'TP. Hồ Chí Minh',
    'Hà Nội',
    'Đà Nẵng',
    'Bình Dương',
    'Đồng Nai',
    'Cần Thơ',
    'Long An',
    'Bà Rịa - Vũng Tàu',
    'Tây Ninh',
    'Tiền Giang'
]

const ALL_BRANDS = ['MayCha', 'Tam Hảo', 'Trà Hú', 'Back Office', 'DCCK']

export function JobBoard() {
    const [jobs, setJobs] = useState<any[]>([])
    const [selectedLocations, setSelectedLocations] = useState<string[]>([])
    const [selectedBrands, setSelectedBrands] = useState<string[]>([])
    const [viewingJob, setViewingJob] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/jobs')
            const data = await res.json()
            if (Array.isArray(data)) {
                // Filter only 'Đang tuyển' jobs for public view
                setJobs(data.filter((j: any) => j.status === 'Đang tuyển'))
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleTrackClick = async (jobId: string) => {
        try {
            await fetch(`/api/jobs/${jobId}/click`, { method: 'POST' })
            // Refresh counts locally for feedback
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicants: (j.applicants || 0) + 1 } : j))
        } catch (error) {
            console.error('Failed to track click:', error)
        }
    }

    const toggleFilter = (item: string, state: string[], setState: (val: string[]) => void) => {
        if (state.includes(item)) {
            setState(state.filter(i => i !== item))
        } else {
            setState([...state, item])
        }
    }

    const filteredJobs = jobs.filter(job => {
        // Multi-location check: If any selected filter is present in job's locations
        const jobLocations = job.location.split(', ')
        const locationMatch = selectedLocations.length === 0 ||
            selectedLocations.some(loc => jobLocations.includes(loc))

        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(job.brand)
        return locationMatch && brandMatch
    })

    const getLogo = (brand: string) => {
        const brandLower = brand.toLowerCase()
        if (brandLower.includes('trà hú')) return '/logo_trahu.png'
        if (brandLower.includes('maycha')) return '/logo_maycha.png'
        if (brandLower.includes('tam hảo')) return '/logo_tamhao.jpg'
        if (brandLower.includes('bo')) return '/logo_ttvh.png'
        if (brandLower.includes('dcck')) return '/logo_ttvh.png'
        return '/logo_ttvh.png'
    }

    return (
        <section className="py-40 bg-white" id="jobs">
            <div className="container px-4 md:px-6">
                <div className="max-w-4xl mb-24 space-y-6">
                    <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tight">Cơ hội nghề nghiệp</h2>
                    <p className="text-foreground/50 text-xl font-medium max-w-2xl">Khám phá những vị trí đang chờ đón bạn cùng hệ sinh thái ẩm thực hàng đầu.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-20">
                    <aside className="w-full lg:w-64 space-y-12 shrink-0">
                        <div className="space-y-12 sticky top-40">
                            <div className="space-y-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Địa điểm</h3>
                                <div className="space-y-5 h-64 overflow-y-auto pr-4 scrollbar-thin">
                                    {ALL_PROVINCES.map(loc => (
                                        <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedLocations.includes(loc)}
                                                onChange={() => toggleFilter(loc, selectedLocations, setSelectedLocations)}
                                                className="w-5 h-5 rounded border-black/10 text-primary focus:ring-primary/10 cursor-pointer"
                                            />
                                            <span className={`font-bold transition-colors text-sm ${selectedLocations.includes(loc) ? 'text-primary' : 'text-foreground/40 group-hover:text-primary'}`}>
                                                {loc}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Thương hiệu</h3>
                                <div className="space-y-5">
                                    {ALL_BRANDS.map(brand => (
                                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
                                                className="w-5 h-5 rounded border-black/10 text-primary focus:ring-primary/10 cursor-pointer"
                                            />
                                            <span className={`font-bold transition-colors text-sm ${selectedBrands.includes(brand) ? 'text-primary' : 'text-foreground/40 group-hover:text-primary'}`}>
                                                {brand}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 space-y-4">
                        {loading ? (
                            <div className="py-20 text-center">
                                <p className="text-zinc-300 italic">Đang tải danh sách công việc...</p>
                            </div>
                        ) : filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div key={job.id} className="p-10 rounded-2xl border border-black/5 bg-white hover:border-primary/30 transition-all duration-300 group">
                                    <div className="flex flex-col md:flex-row items-center gap-12">
                                        <div className="w-20 h-20 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 p-4">
                                            <Image
                                                src={getLogo(job.brand)}
                                                alt={job.brand}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-4 text-center md:text-left">
                                            <div className="flex items-center justify-center md:justify-start gap-4">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{job.brand}</span>
                                                {job.departmentGroup && (
                                                    <span className="text-[9px] font-black tracking-widest text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">
                                                        {job.departmentGroup}
                                                    </span>
                                                )}
                                                <span className="w-1 h-1 rounded-full bg-black/10" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">{job.type}</span>
                                            </div>

                                            <h3 className="text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors flex items-center gap-3">
                                                {job.title}
                                                {job.position && (
                                                    <span className="text-[10px] font-black text-white bg-black px-2 py-1 rounded uppercase tracking-widest">
                                                        {job.position.split('(')[1]?.replace(')', '') || job.position}
                                                    </span>
                                                )}
                                            </h3>

                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-10 gap-y-3 text-xs font-bold text-foreground/40">
                                                <span className="flex items-center gap-2 italic">
                                                    <IconMapPin className="w-4 h-4 opacity-50" />
                                                    {job.location}
                                                </span>
                                                <span className="flex items-center gap-2 text-primary">
                                                    <IconCurrencyDollar className="w-4 h-4" />
                                                    {job.salary}
                                                </span>
                                                <span className="flex items-center gap-2 opacity-50">
                                                    <IconCalendar className="w-4 h-4" />
                                                    {job.type}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-auto flex flex-col gap-3">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setViewingJob(job)}
                                                        className="h-16 px-10 rounded-xl border-2 border-black/5 hover:border-black hover:bg-black hover:text-white font-black uppercase tracking-widest text-[10px] transition-all"
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                </DialogTrigger>
                                                {viewingJob && (
                                                    <DialogContent className="sm:max-w-[700px] p-0 rounded-3xl border-0 overflow-hidden">
                                                        <div className="bg-primary p-12 text-black">
                                                            <div className="flex items-center gap-4 mb-6">
                                                                <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                                                    {viewingJob.brand}
                                                                </span>
                                                                {viewingJob.departmentGroup && (
                                                                    <span className="px-3 py-1 bg-white/60 text-black text-[10px] font-black tracking-widest rounded-full border border-black/10">
                                                                        {viewingJob.departmentGroup}
                                                                    </span>
                                                                )}
                                                                <span className="font-black text-[10px] uppercase tracking-widest opacity-40">
                                                                    {viewingJob.type}
                                                                </span>
                                                            </div>
                                                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-8 flex items-center gap-4">
                                                                {viewingJob.title}
                                                                {viewingJob.position && (
                                                                    <span className="text-[12px] font-black text-black bg-white px-3 py-1 rounded-full uppercase tracking-widest border-2 border-black/5">
                                                                        {viewingJob.position.split('(')[1]?.replace(')', '') || viewingJob.position}
                                                                    </span>
                                                                )}
                                                            </h2>
                                                            <div className="flex flex-wrap gap-8 text-xs font-black uppercase tracking-widest opacity-60">
                                                                <div className="flex items-center gap-2">
                                                                    <IconMapPin size={16} />
                                                                    {viewingJob.location}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <IconCurrencyDollar size={16} />
                                                                    {viewingJob.salary}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <IconCalendar size={16} />
                                                                    {viewingJob.type}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-12 space-y-12 bg-white max-h-[60vh] overflow-y-auto">
                                                            <div className="space-y-6">
                                                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Mô tả công việc</h3>
                                                                <div
                                                                    className="text-zinc-600 font-medium leading-relaxed italic text-lg quill-content"
                                                                    dangerouslySetInnerHTML={{ __html: viewingJob.description }}
                                                                />
                                                            </div>
                                                            <div className="space-y-6">
                                                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Yêu cầu ứng viên</h3>
                                                                <div
                                                                    className="text-zinc-600 font-bold leading-relaxed quill-content"
                                                                    dangerouslySetInnerHTML={{ __html: viewingJob.requirements }}
                                                                />
                                                            </div>
                                                            <div className="pt-10 border-t border-zinc-100">
                                                                <a
                                                                    href={viewingJob.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={() => handleTrackClick(viewingJob.id)}
                                                                    className="flex items-center justify-center w-full h-16 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-black transition-all"
                                                                >
                                                                    Ứng tuyển ngay
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                )}
                                            </Dialog>

                                            <a
                                                href={job.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => handleTrackClick(job.id)}
                                                className="inline-flex items-center justify-center h-16 px-12 rounded-xl bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all duration-300 w-full"
                                            >
                                                Gia nhập ngay
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center border border-dashed border-black/10 rounded-2xl">
                                <p className="text-foreground/30 font-bold italic text-lg">Không tìm thấy vị trí phù hợp với tiêu chí của bạn.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
