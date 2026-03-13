'use client'

import { IconSearch, IconBolt, IconShieldCheck, IconHeart, IconWorld } from '@tabler/icons-react'
import Image from 'next/image'

export function Hero() {
    return (
        <section id="hero" className="relative py-20 lg:py-40 overflow-hidden bg-white">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
                    <div className="w-full lg:w-3/5 space-y-16">
                        <div className="space-y-14">
                            <h1 className="text-6xl md:text-7xl lg:text-[100px] font-black text-foreground leading-[0.95] tracking-tight">
                                Đừng tìm công việc <br />
                                <span className="text-primary italic">Hãy tìm sự nghiệp</span>
                            </h1>

                            <p className="text-2xl text-foreground/60 max-w-2xl font-medium leading-relaxed">
                                Gia nhập <strong className="text-foreground">Thịnh Thế Vinh Hoa</strong> - Hệ sinh thái F&B hàng đầu với những thương hiệu biểu tượng. Nơi mỗi nỗ lực đều được trân trọng và tỏa sáng.
                            </p>
                        </div>

                        <div className="relative max-w-2xl group">
                            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                                <IconSearch className="h-7 w-7 text-foreground/30 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Vị trí bạn đang tìm kiếm?"
                                className="w-full h-24 pl-20 pr-32 rounded-2xl border-2 border-black/5 bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-xl font-bold"
                            />
                            <button
                                onClick={() => document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })}
                                className="absolute right-4 top-4 bottom-4 px-10 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[11px] hover:bg-primary-dark transition-all"
                            >
                                Tìm kiếm
                            </button>
                        </div>

                        <div className="space-y-8 pt-8 border-t border-black/5">
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground/30">Hệ thống thương hiệu</p>
                            <div className="flex flex-wrap items-center gap-x-16 gap-y-8">
                                <Image src="/logo_maycha.png" alt="MayCha" width={240} height={80} className="h-20 w-auto object-contain hover:scale-110 transition-transform duration-500" />
                                <Image src="/logo_tamhao.jpg" alt="Tam Hảo" width={240} height={80} className="h-20 w-auto object-contain hover:scale-110 transition-transform duration-500" />
                                <Image src="/logo_trahu.png" alt="Trà Hú" width={240} height={80} className="h-20 w-auto object-contain hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/5">
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl relative z-10 border-[16px] border-white ring-1 ring-black/5 overflow-hidden">
                                <Image
                                    src="/logo_ttvh.png"
                                    alt="Tuyển dụng Thịnh Thế Vinh Hoa"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="absolute -inset-4 bg-primary/5 -z-10 blur-3xl rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
