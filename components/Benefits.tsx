import { IconBolt, IconShieldCheck, IconHeart, IconWorld } from '@tabler/icons-react'

const BENEFITS = [
    {
        title: 'Lương & Thưởng hấp dẫn',
        desc: 'Mức lương cạnh tranh cùng chính sách thưởng KPI, thưởng lễ/Tết vượt trội trong ngành F&B.',
        icon: IconBolt
    },
    {
        title: 'Đào tạo & Phát triển',
        desc: 'Chương trình đào tạo bài bản từ cơ bản đến nâng cao. Cơ hội thăng tiến rõ rệt lên các vị trí quản lý.',
        icon: IconShieldCheck
    },
    {
        title: 'Môi trường làm việc',
        desc: 'Năng động, sáng tạo và đoàn kết. Nơi mỗi thành viên được tự do thể hiện bản sắc cá nhân.',
        icon: IconHeart
    },
    {
        title: 'Hệ sinh thái đa dạng',
        desc: 'Cơ hội trải nghiệm và làm việc tại nhiều thương hiệu biểu tượng trong hệ thống TTVH.',
        icon: IconWorld
    }
]

export function Benefits() {
    return (
        <section id="benefits" className="py-40 bg-zinc-50 relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mb-32 space-y-8">
                    <h2 className="text-5xl md:text-7xl font-black text-foreground tracking-tight">Đặc quyền dành <br className="md:hidden" /> cho bạn</h2>
                    <p className="text-foreground/50 text-2xl font-medium leading-relaxed max-w-3xl">
                        Chúng tôi kiến tạo môi trường làm việc nơi giá trị nhân bản được đặt lên hàng đầu và mỗi nỗ lực đều được ghi nhận xứng đáng.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {BENEFITS.map((benefit, i) => (
                        <div key={i} className="p-12 bg-white border border-black/5 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 group">
                            <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <benefit.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-foreground mb-4">{benefit.title}</h3>
                            <p className="text-foreground/40 text-sm leading-relaxed font-medium">
                                {benefit.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
