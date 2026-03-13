import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tuyển dụng | Thịnh Thế Vinh Hoa Group',
  description: 'Hành trình kiến tạo sự nghiệp tại hệ sinh thái F&B hàng đầu Việt Nam. Maycha, Tam Hảo, Trà Hú.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen antialiased selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  )
}
