const TESTIMONIALS = [
    {
        quote: '"Từ khi đồng hành cùng MayCha, tôi học được cách xây dựng đội ngũ gắn kết và luôn giữ tiêu chuẩn dịch vụ đồng đều ở mọi ca làm."',
        name: 'Phạm Minh Khang',
        role: 'Quản lý cửa hàng - MayCha',
    },
    {
        quote: '"Tam Hảo cho tôi cơ hội thử nghiệm nhiều ý tưởng vận hành mới, từ đó cải thiện doanh thu và trải nghiệm khách hàng rõ rệt."',
        name: 'Lê Ngọc Anh',
        role: 'Quản lý cửa hàng - Tam Hảo',
    },
    {
        quote: '"Môi trường tại Trà Hú rất năng động, giúp tôi trưởng thành nhanh về quản trị con người, kiểm soát chất lượng và xử lý tình huống."',
        name: 'Trần Quốc Bảo',
        role: 'Quản lý cửa hàng - Trà Hú',
    },
]

export function Testimonial() {
    return (
        <section id="culture" className="py-24 bg-zinc-50 text-foreground relative overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
                    <div className="max-w-3xl space-y-6">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Văn hóa tại Thịnh Thế Vinh Hoa</p>
                        <h2 className="text-4xl md:text-6xl font-black leading-[0.9] tracking-tighter italic">
                            "Con người là <br className="hidden md:block" /> trung tâm của <br className="hidden md:block" /> mọi sự phát triển"
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((item) => (
                        <div key={item.role} className="flex flex-col p-10 border border-black/5 bg-white rounded-2xl gap-8 group hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                            <p className="text-lg font-medium leading-relaxed text-foreground/60 italic">
                                {item.quote}
                            </p>
                            <div className="flex items-center gap-4 pt-4 border-t border-black/5 mt-auto">
                                <div className="w-12 h-12 rounded-full bg-primary/20 shrink-0" />
                                <div>
                                    <h4 className="font-black text-base">{item.name}</h4>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mt-0.5">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
        </section>
    )
}
