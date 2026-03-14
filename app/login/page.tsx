'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { IconLock, IconUser, IconArrowLeft } from '@tabler/icons-react'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Premium Hardcoded Security
        if (username === 'admin' && password === 'ttvh@2026') {
            localStorage.setItem('isLoggedIn', 'true')
            router.push('/admin')
        } else {
            setError('Tên đăng nhập hoặc mật khẩu không đúng')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 font-montserrat" style={{ fontFamily: '"Montserrat", sans-serif' }}>
            <Card className="w-full max-w-[400px] border-0 shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardContent className="p-0">
                    <div className="bg-white pt-16 pb-8 text-black flex flex-col items-center gap-8">
                        <Image src="/logo_ttvh.png" alt="Logo" width={280} height={80} className="h-24 w-auto object-contain" />
                        <div className="text-center space-y-2">
                            <h1 className="text-sm font-black text-black tracking-[0.2em] uppercase">Trang quản lý hệ thống</h1>
                        </div>
                    </div>

                    <div className="p-12 space-y-10">
                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="username" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 ml-1 font-black">Tài khoản</Label>
                                    <div className="relative group">
                                        <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors" size={18} stroke={2.5} />
                                        <Input 
                                            id="username" 
                                            placeholder="Username" 
                                            className="h-14 pl-12 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white focus:ring-primary/20 focus:border-primary transition-all text-xs font-bold shadow-sm"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 ml-1 font-black">Mật khẩu</Label>
                                    <div className="relative group">
                                        <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors" size={18} stroke={2.5} />
                                        <Input 
                                            id="password" 
                                            type="password" 
                                            placeholder="••••••••" 
                                            className="h-14 pl-12 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white focus:ring-primary/20 focus:border-primary transition-all text-xs font-bold shadow-sm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="animate-shake py-4 px-6 bg-red-50 border border-red-100 rounded-2xl">
                                    <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <Button 
                                    type="submit" 
                                    className="w-full h-16 rounded-2xl bg-black hover:bg-primary hover:text-black text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-black/5 active:scale-[0.98]"
                                >
                                    Đăng nhập hệ thống
                                </Button>
                                
                                <div className="flex justify-center pt-2">
                                    <a href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-zinc-900 transition-colors group">
                                        <IconArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                        Quay về Trang chủ
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    )
}
