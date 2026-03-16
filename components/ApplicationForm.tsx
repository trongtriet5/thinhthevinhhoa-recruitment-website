'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconUpload, IconCheck, IconLoader2, IconSearch, IconChevronDown } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

function SearchableSelect({
    label,
    options,
    value,
    onChange,
    placeholder,
    error,
    disabled = false
}: {
    label: string,
    options: { id: string | number, name: string }[],
    value: string,
    onChange: (val: string) => void,
    placeholder: string,
    error?: string,
    disabled?: boolean
}) {
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    )

    const selectedOption = options.find(opt => String(opt.id) === value || opt.name === value)

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            <Label className="text-[11px] font-black uppercase tracking-widest opacity-40">{label}</Label>
            <div
                className={cn(
                    "w-full h-12 px-4 rounded-xl border border-black/5 bg-zinc-50 flex items-center justify-between cursor-pointer focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all font-bold text-sm",
                    error && "border-red-500",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={cn("truncate mr-2", !selectedOption && "text-foreground/30")}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <IconChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
            </div>

            {isOpen && (
                <div className="absolute z-[100] top-full left-0 w-full mt-2 bg-white border border-black/5 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-black/5 flex items-center gap-2 bg-zinc-50">
                        <IconSearch className="w-4 h-4 text-foreground/30" />
                        <input
                            type="text"
                            className="bg-transparent border-none outline-none w-full text-sm font-bold"
                            placeholder="Tìm kiếm..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto scrollbar-thin">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <div
                                    key={opt.id}
                                    className={cn(
                                        "px-4 py-3 cursor-pointer hover:bg-primary/10 transition-colors text-sm font-bold",
                                        (String(opt.id) === value || opt.name === value) && "bg-primary/20 text-primary"
                                    )}
                                    onClick={() => {
                                        onChange(String(opt.id || opt.name))
                                        setIsOpen(false)
                                        setSearch('')
                                    }}
                                >
                                    {opt.name}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-xs font-bold text-foreground/30 italic">
                                Không tìm thấy kết quả
                            </div>
                        )}
                    </div>
                </div>
            )}
            {error && <p className="text-[10px] text-red-500 font-bold italic">{error}</p>}
        </div>
    )
}

interface ApplicationFormProps {
    job: any
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

const naturalSort = (a: string, b: string) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

export function ApplicationForm({ job, isOpen, onOpenChange }: ApplicationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [provinces, setProvinces] = useState<any[]>([])
    const [wards, setWards] = useState<any[]>([])
    const [cf56Wards, setCf56Wards] = useState<any[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        birthday: '',
        phone: '',
        email: '',
        private_code: '',
        street: '',
        ward: '',
        province: '',
        cf56: ''
    })
    const [cf56Options, setCf56Options] = useState<any[]>([])

    // Fetch provinces on mount
    useEffect(() => {
        fetch('/api/locations/provinces')
            .then(res => res.json())
            .then(data => {
                setProvinces(data)
            })
            .catch(err => console.error('Error fetching provinces:', err))

        const fetchCf56 = async () => {
            try {
                const res = await fetch('/api/office/cf56')
                const contentType = res.headers.get('content-type')
                if (res.ok && contentType && contentType.includes('application/json')) {
                    const data = await res.json()
                    if (Array.isArray(data)) {
                        setCf56Options(data)
                    }
                } else {
                    console.error('API /api/office/cf56 did not return JSON or failed:', res.status)
                }
            } catch (err) {
                console.error('Error fetching cf56 options:', err)
            }
        }

        fetchCf56()
    }, [])

    const handleProvinceChange = async (provinceCode: string) => {
        const province = provinces.find(p => p.code === provinceCode)
        setFormData(prev => ({ ...prev, province: province?.full_name || '', ward: '' }))
        setWards([])
        if (provinceCode) {
            try {
                const res = await fetch(`/api/locations/wards?provinceCode=${provinceCode}`)
                const data = await res.json()
                const sortedWards = (data || []).sort((a: any, b: any) => naturalSort(a.name, b.name))
                setWards(sortedWards)
            } catch (err) {
                console.error('Error fetching wards:', err)
            }
        }
        validateField('province', province?.full_name || '')
    }


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1]
                resolve(base64String)
            }
            reader.onerror = error => reject(error)
        })
    }

    const validateField = (name: string, value: string) => {
        let error = ''
        switch (name) {
            case 'name':
                if (value.trim().length < 2) error = 'Vui lòng nhập đầy đủ họ tên'
                break
            case 'phone':
                const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
                if (!phoneRegex.test(value)) error = 'Số điện thoại không hợp lệ'
                break
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(value)) error = 'Email không hợp lệ'
                break
            case 'private_code':
                const cccdRegex = /^\d{12}$/
                if (!cccdRegex.test(value)) error = 'CCCD phải là 12 chữ số'
                break
            case 'birthday':
                const birthdayRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/
                if (!value) error = 'Vui lòng nhập ngày sinh'
                else if (!birthdayRegex.test(value)) error = 'Định dạng phải là dd/mm/yyyy'
                break
            case 'gender':
                if (!value) error = 'Vui lòng chọn giới tính'
                break
            case 'street':
                if (!value.trim()) error = 'Vui lòng nhập số nhà, tên đường'
                break
            case 'ward':
                if (!value.trim()) error = 'Vui lòng chọn phường/xã'
                break
            case 'province':
                if (!value.trim()) error = 'Vui lòng chọn tỉnh/thành phố'
                break
            case 'cf56':
                if (!value.trim()) error = 'Vui lòng chọn khu vực mong muốn'
                break
        }
        setErrors(prev => ({ ...prev, [name]: error }))
        return !error
    }

    const validate = () => {
        const fields = Object.keys(formData) as Array<keyof typeof formData>
        let isValid = true
        fields.forEach(field => {
            const isFieldValid = validateField(field, formData[field])
            if (!isFieldValid) isValid = false
        })
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)

        try {
            let base64File = ''
            if (file) {
                base64File = await fileToBase64(file)
            }

            const [d, m, y] = formData.birthday.split('/')
            const isoBirthday = `${y}-${m}-${d}`

            const payload = {
                ...formData,
                birthday: isoBirthday,
                current_address: `${formData.street}, ${formData.ward}, ${formData.province}`,
                cf56: formData.cf56,
                jobTitle: job.title,
                jobBrand: job.brand,
                jobPosition: job.position,
                jobId: job.id,
                cvFile: base64File ? {
                    name: file?.name,
                    file: base64File
                } : null
            }

            const response = await fetch('/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                setIsSuccess(true)
                setTimeout(() => {
                    onOpenChange(false)
                    setIsSuccess(false)
                    setFormData({
                        name: '',
                        gender: '',
                        birthday: '',
                        phone: '',
                        email: '',
                        private_code: '',
                        street: '',
                        ward: '',
                        province: '',
                        cf56: ''
                    })
                    setFile(null)
                    setErrors({})
                }, 3000)
            } else {
                alert('Có lỗi xảy ra, vui lòng thử lại sau.')
            }
        } catch (error) {
            console.error('Submission error:', error)
            alert('Có lỗi xảy ra, vui lòng thử lại sau.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] w-[95vw] md:w-full p-0 rounded-3xl border-0 overflow-hidden bg-white shadow-2xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>Ứng tuyển {job?.title}</DialogTitle>
                    <DialogDescription>Điền thông tin của bạn để gửi hồ sơ ứng tuyển.</DialogDescription>
                </DialogHeader>

                {!isSuccess ? (
                    <div className="flex flex-col">
                        <div className="bg-primary p-6 md:p-8 text-black">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {job?.brand}
                                </span>
                                <span className="font-black text-[10px] uppercase tracking-widest opacity-40">
                                    Ứng tuyển vị trí
                                </span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight leading-tight">
                                {job?.title}
                            </h2>
                            {job?.position && (
                                <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">
                                    Vị trí: {job.position}
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-4 md:space-y-6 max-h-[75vh] md:max-h-[70vh] overflow-y-auto scrollbar-thin">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest opacity-40">Họ và tên *</Label>
                                    <Input
                                        id="name"
                                        required
                                        placeholder="Nguyễn Văn A"
                                        className={cn(
                                            "h-12 rounded-xl border-black/5 bg-zinc-50 focus:bg-white focus:ring-primary/20 transition-all font-bold",
                                            errors.name && "border-red-500 focus:ring-red-200"
                                        )}
                                        value={formData.name}
                                        onChange={e => {
                                            const val = e.target.value
                                            setFormData(prev => ({ ...prev, name: val }))
                                            validateField('name', val)
                                        }}
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500 font-bold italic">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-[11px] font-black uppercase tracking-widest opacity-40">Số điện thoại *</Label>
                                    <Input
                                        id="phone"
                                        required
                                        type="tel"
                                        placeholder="0901 xxx xxx"
                                        className={cn(
                                            "h-12 rounded-xl border-black/5 bg-zinc-50 focus:bg-white focus:ring-primary/20 transition-all font-bold",
                                            errors.phone && "border-red-500 focus:ring-red-200"
                                        )}
                                        value={formData.phone}
                                        onChange={e => {
                                            const val = e.target.value
                                            setFormData(prev => ({ ...prev, phone: val }))
                                            validateField('phone', val)
                                        }}
                                    />
                                    {errors.phone && <p className="text-[10px] text-red-500 font-bold italic">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black uppercase tracking-widest opacity-40">Giới tính *</Label>
                                    <select
                                        className={cn(
                                            "w-full h-12 px-4 rounded-xl border border-black/5 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm outline-none appearance-none",
                                            errors.gender && "border-red-500 focus:ring-red-200"
                                        )}
                                        value={formData.gender}
                                        onChange={e => {
                                            const val = e.target.value
                                            setFormData(prev => ({ ...prev, gender: val }))
                                            validateField('gender', val)
                                        }}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="1">Nam</option>
                                        <option value="0">Nữ</option>
                                        <option value="2">Khác</option>
                                    </select>
                                    {errors.gender && <p className="text-[10px] text-red-500 font-bold italic">{errors.gender}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="birthday" className="text-[11px] font-black uppercase tracking-widest opacity-40">Ngày sinh (dd/mm/yyyy) *</Label>
                                    <Input
                                        id="birthday"
                                        required
                                        type="text"
                                        placeholder="31/12/1995"
                                        className={cn(
                                            "h-12 rounded-xl border-black/5 bg-zinc-50 focus:bg-white focus:ring-primary/20 transition-all font-bold",
                                            errors.birthday && "border-red-500 focus:ring-red-200"
                                        )}
                                        value={formData.birthday}
                                        onChange={e => {
                                            let val = e.target.value.replace(/\D/g, '')
                                            if (val.length > 8) val = val.substring(0, 8)

                                            let formatted = val
                                            if (val.length > 4) {
                                                formatted = val.substring(0, 2) + '/' + val.substring(2, 4) + '/' + val.substring(4)
                                            } else if (val.length > 2) {
                                                formatted = val.substring(0, 2) + '/' + val.substring(2)
                                            }

                                            setFormData(prev => ({ ...prev, birthday: formatted }))
                                            if (formatted.length === 10) {
                                                validateField('birthday', formatted)
                                            } else {
                                                setErrors(prev => ({ ...prev, birthday: '' }))
                                            }
                                        }}
                                        onBlur={e => validateField('birthday', e.target.value)}
                                        maxLength={10}
                                    />
                                    {errors.birthday && <p className="text-[10px] text-red-500 font-bold italic">{errors.birthday}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest opacity-40">Email *</Label>
                                    <Input
                                        id="email"
                                        required
                                        type="email"
                                        placeholder="example@gmail.com"
                                        className={cn(
                                            "h-12 rounded-xl border-black/5 bg-zinc-50 focus:bg-white focus:ring-primary/20 transition-all font-bold",
                                            errors.email && "border-red-500 focus:ring-red-200"
                                        )}
                                        value={formData.email}
                                        onChange={e => {
                                            const val = e.target.value
                                            setFormData(prev => ({ ...prev, email: val }))
                                            validateField('email', val)
                                        }}
                                    />
                                    {errors.email && <p className="text-[10px] text-red-500 font-bold italic">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="private_code" className="text-[11px] font-black uppercase tracking-widest opacity-40">Số CCCD *</Label>
                                    <Input
                                        id="private_code"
                                        required
                                        placeholder="12 chữ số"
                                        className={cn(
                                            "h-12 rounded-xl border-black/5 bg-zinc-50 focus:bg-white focus:ring-primary/20 transition-all font-bold",
                                            errors.private_code && "border-red-500 focus:ring-red-200"
                                        )}
                                        value={formData.private_code}
                                        onChange={e => {
                                            const val = e.target.value
                                            setFormData(prev => ({ ...prev, private_code: val }))
                                            validateField('private_code', val)
                                        }}
                                    />
                                    {errors.private_code && <p className="text-[10px] text-red-500 font-bold italic">{errors.private_code}</p>}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-black/5">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Địa chỉ liên hệ *</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="street" className="text-[11px] font-black uppercase tracking-widest opacity-40">Số nhà tên đường *</Label>
                                    <Input
                                        id="street"
                                        required
                                        placeholder="Ví dụ: 123 Nguyễn Huệ"
                                        className={cn(
                                            "h-12 rounded-xl border-black/5 bg-zinc-50 focus:bg-white focus:ring-primary/20 transition-all font-bold",
                                            errors.street && "border-red-500 focus:ring-red-200"
                                        )}
                                        value={formData.street}
                                        onChange={e => {
                                            const val = e.target.value
                                            setFormData(prev => ({ ...prev, street: val }))
                                            validateField('street', val)
                                        }}
                                    />
                                    {errors.street && <p className="text-[10px] text-red-500 font-bold italic">{errors.street}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <SearchableSelect
                                        label="Tỉnh thành *"
                                        placeholder="Chọn Tỉnh thành"
                                        options={provinces.map(p => ({ id: p.code, name: p.full_name }))}
                                        value={provinces.find(p => p.full_name === formData.province)?.code || ''}
                                        onChange={val => handleProvinceChange(val)}
                                        error={errors.province}
                                    />

                                    <SearchableSelect
                                        label="Phường / Xã *"
                                        placeholder="Chọn Phường / Xã"
                                        options={wards.map(w => ({ id: w.code, name: w.full_name }))}
                                        value={wards.find(w => w.full_name === formData.ward)?.code || ''}
                                        onChange={val => {
                                            const ward = wards.find(w => w.code === val)
                                            setFormData(prev => ({ ...prev, ward: ward?.full_name || '' }))
                                            validateField('ward', ward?.full_name || '')
                                        }}
                                        disabled={!formData.province}
                                        error={errors.ward}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-black/5">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Khu vực mong muốn làm việc *</h3>
                                <SearchableSelect
                                    label="Lựa chọn khu vực *"
                                    placeholder="Chọn khu vực"
                                    options={cf56Options.map(opt => ({ id: opt.id, name: opt.name }))}
                                    value={formData.cf56}
                                    onChange={val => {
                                        setFormData(prev => ({ ...prev, cf56: val }))
                                        validateField('cf56', val)
                                    }}
                                    error={errors.cf56}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest opacity-40">CV của bạn</Label>
                                <div
                                    className={cn(
                                        "relative group cursor-pointer",
                                        "border-2 border-dashed rounded-2xl p-6 transition-all duration-300",
                                        file ? "border-primary bg-primary/5" : "border-black/5 bg-zinc-50 hover:border-primary/30 hover:bg-zinc-100"
                                    )}
                                >
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                                        {file ? (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black">
                                                    <IconCheck size={20} />
                                                </div>
                                                <p className="font-bold text-sm text-black">{file.name}</p>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); setFile(null); }}
                                                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline z-20 relative"
                                                >
                                                    Thay đổi tệp
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/20 group-hover:bg-primary/20 group-hover:text-primary">
                                                    <IconUpload size={20} />
                                                </div>
                                                <p className="font-bold text-sm text-foreground/40">Kéo thả hoặc nhấn để tải lên CV</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-30 italic">PDF, DOC, DOCX (Max 5MB)</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-16 rounded-2xl bg-black text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-primary hover:text-black transition-all group"
                            >
                                {isSubmitting ? (
                                    <IconLoader2 className="animate-spin" />
                                ) : (
                                    <>Gửi hồ sơ ngay</>
                                )}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="p-8 md:p-16 flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center text-black">
                            <IconCheck className="w-10 h-10 md:w-12 md:h-12" stroke={3} />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Cảm ơn bạn!</h2>
                            <p className="text-foreground/50 font-medium italic text-lg text-sm md:text-lg">
                                Hồ sơ của bạn đã được gửi thành công. <br className="hidden md:block" />
                                Bộ phận tuyển dụng sẽ sớm liên hệ với bạn.
                            </p>
                        </div>
                        <Button
                            onClick={() => onOpenChange(false)}
                            className="bg-black text-white px-8 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]"
                        >
                            Đóng cửa sổ
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
