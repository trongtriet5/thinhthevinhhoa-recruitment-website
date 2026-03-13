'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
    const [activeSection, setActiveSection] = useState('')

    useEffect(() => {
        const sections = ['hero', 'benefits', 'jobs', 'culture']
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -70% 0px', // Trigger when section is near top
            threshold: 0
        }

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id)
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)
        
        sections.forEach(id => {
            const element = document.getElementById(id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [])

    const navItems = [
        { name: 'Về chúng tôi', href: '#hero', id: 'hero' },
        { name: 'Đặc quyền', href: '#benefits', id: 'benefits' },
        { name: 'Tuyển dụng', href: '#jobs', id: 'jobs' },
        { name: 'Văn hóa', href: '#culture', id: 'culture' },
    ]

    return (
        <header className="sticky top-0 z-50 transition-all duration-500">
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xl border-b border-black/5" />
            <div className="container relative z-10 flex h-28 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-16">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/logo_ttvh.png"
                            alt="Thịnh Thế Vinh Hoa Group"
                            width={320}
                            height={100}
                            className="h-20 w-auto object-contain"
                            priority
                        />
                    </Link>
                    <nav className="hidden lg:flex items-center gap-10 text-[13px] font-bold text-foreground/40">
                        {navItems.map((item) => (
                            <Link 
                                key={item.id}
                                href={item.href} 
                                className={`transition-all duration-300 relative group py-2
                                    ${activeSection === item.id 
                                        ? 'text-black font-black scale-105' 
                                        : 'hover:text-black'
                                    }`}
                            >
                                {item.name}
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 
                                    ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`} 
                                />
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    )
}
