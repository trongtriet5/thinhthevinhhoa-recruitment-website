import { IconMapPin, IconMail, IconPhone, IconBrandFacebook, IconBrandLinkedin, IconBrandInstagram, IconBrandTwitter, IconChevronRight } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

const FOOTER_NAV_ITEMS = [
    { name: 'Về chúng tôi', href: '#hero' },
    { name: 'Đặc quyền', href: '#benefits' },
    { name: 'Tuyển dụng', href: '#jobs' },
    { name: 'Văn hóa', href: '#culture' },
]

export function Footer() {
    return (
        <footer className="bg-[#0D0D0D] text-white pt-32 pb-16 relative overflow-hidden">
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-8">
                            <Image 
                                src="/logo_ttvh.png" 
                                alt="Thịnh Thế Vinh Hoa Group" 
                                width={240} 
                                height={80} 
                                className="h-20 w-auto object-contain" 
                            />
                            <p className="text-zinc-300 text-lg leading-relaxed font-bold max-w-sm italic">
                                "Nơi khát vọng vươn tầm, nơi tài năng tỏa sáng." <br />
                                <span className="not-italic text-sm text-zinc-300 mt-4 block font-bold">
                                    Thịnh Thế Vinh Hoa kiến tạo hệ sinh thái F&B bền vững, mang lại giá trị thực cho cộng đồng và cơ hội phát triển vượt bậc cho đội ngũ.
                                </span>
                            </p>
                        </div>
                        
                        <div className="flex gap-4">
                            {[
                                { icon: IconBrandFacebook, href: "#" },
                                { icon: IconBrandLinkedin, href: "#" },
                                { icon: IconBrandInstagram, href: "#" },
                                { icon: IconBrandTwitter, href: "#" }
                            ].map((social, i) => (
                                <a 
                                    key={i} 
                                    href={social.href} 
                                    className="w-14 h-14 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black text-zinc-500 transition-all duration-500 group"
                                >
                                    <social.icon size={22} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="lg:col-span-2 space-y-10">
                        <h3 className="text-[11px] font-black tracking-[0.4em] text-zinc-300 border-l-2 border-primary pl-4">Khám phá</h3>
                        <ul className="space-y-6">
                            {FOOTER_NAV_ITEMS.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="group flex items-center gap-2 text-zinc-400 hover:text-primary transition-all font-bold text-sm tracking-wide">
                                        <IconChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-10">
                            <h3 className="text-[11px] font-black tracking-[0.4em] text-zinc-300 border-l-2 border-primary pl-4">Trụ sở chính</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-5 group cursor-default">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 transition-all duration-500 group-hover:bg-primary group-hover:text-black group-hover:scale-110">
                                        <IconMapPin size={24} />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Văn phòng TP.HCM</span>
                                        <p className="text-sm text-zinc-300 font-bold leading-relaxed max-w-[200px]">
                                            35-37 Huỳnh Tịnh Của, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h3 className="text-[11px] font-black tracking-[0.4em] text-zinc-300 border-l-2 border-primary pl-4">Kết nối ngay</h3>
                            <div className="space-y-8">
                                <a href="mailto:hr@tt" className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-primary shrink-0 transition-all duration-500 group-hover:bg-primary group-hover:text-black group-hover:scale-110">
                                        <IconMail size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Email</span>
                                        <span className="text-sm text-zinc-300 font-black group-hover:text-primary transition-colors tracking-wide">hr@maycha.com.vn</span>
                                    </div>
                                </a>
                                <a href="tel:+84 772 086 453" className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-primary shrink-0 transition-all duration-500 group-hover:bg-primary group-hover:text-black group-hover:scale-110">
                                        <IconPhone size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Hotline</span>
                                        <span className="text-sm text-zinc-300 font-black group-hover:text-primary transition-colors tracking-wide">+84 772 086 453</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300 italic">
                            © {new Date().getFullYear()} Thịnh Thế Vinh Hoa. Created by trongtriet5
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                        {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Sơ đồ trang'].map((item) => (
                            <a key={item} href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-primary transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
