import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';

// QR code images as inline SVG data or simple fallback display
const PAYMENT_METHODS = [
    {
        id: 'momo',
        name: 'MoMo',
        color: '#A0147E',
        bg: 'rgba(160,20,126,0.08)',
        border: 'rgba(160,20,126,0.3)',
        account: '0901 234 567',
        holder: 'HUYNH TU',
        deepLink: 'https://me.momo.vn/huynhtu',
        logo: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#A0147E" />
                <text x="24" y="32" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Arial">M</text>
            </svg>
        ),
        badge: 'Ví điện tử',
        cta: 'Ủng hộ qua MoMo',
    },
    {
        id: 'vcb',
        name: 'Vietcombank',
        color: '#007B40',
        bg: 'rgba(0,123,64,0.08)',
        border: 'rgba(0,123,64,0.3)',
        account: '1234 5678 9012',
        holder: 'HUYNH TU',
        deepLink: 'https://vcb.com.vn',
        logo: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#007B40" />
                <text x="24" y="32" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">VCB</text>
            </svg>
        ),
        badge: 'Ngân hàng',
        cta: 'Chuyển khoản VCB',
    },
    {
        id: 'paypal',
        name: 'PayPal',
        color: '#003087',
        bg: 'rgba(0,48,135,0.08)',
        border: 'rgba(0,48,135,0.3)',
        account: 'donate@huynhtu.dev',
        holder: 'huynhtu.dev',
        deepLink: 'https://paypal.me/huynhtu',
        logo: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#003087" />
                <text x="24" y="33" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">Pay</text>
            </svg>
        ),
        badge: 'Quốc tế',
        cta: 'Ủng hộ qua PayPal',
    },
];

const SPONSORS = [
    { name: 'Nguyễn Văn Hùng', amount: '500.000đ', date: '02/2026' },
    { name: 'Trần Thị Lan', amount: '300.000đ', date: '02/2026' },
    { name: 'Lê Minh Tuấn', amount: '200.000đ', date: '02/2026' },
    { name: 'Phạm Thị Mai', amount: '150.000đ', date: '01/2026' },
    { name: 'Hoàng Văn Nam', amount: '100.000đ', date: '01/2026' },
    { name: 'Vũ Thị Thu', amount: '50.000đ', date: '01/2026' },
    { name: 'Bùi Quốc Cường', amount: '50.000đ', date: '01/2026' },
    { name: 'Đinh Thị Hoa', amount: '30.000đ', date: '01/2026' },
];

const FAQ = [
    {
        q: 'Tôi ủng hộ rồi, sẽ nhận được gì?',
        a: 'Tên bạn sẽ được ghi vào danh sách nhà tài trợ trên website. Bạn cũng sẽ được hỗ trợ ưu tiên khi gặp vấn đề kỹ thuật.'
    },
    {
        q: 'Số tiền ủng hộ được dùng làm gì?',
        a: 'Toàn bộ dùng để nâng cấp lưu trữ (storage), cải thiện tốc độ tải xuống (CDN), và duy trì tên miền + máy chủ.'
    },
    {
        q: 'Tôi có thể ủng hộ hàng tháng không?',
        a: 'Có! Bạn có thể cài đặt lệnh chuyển khoản định kỳ qua ứng dụng ngân hàng hoặc PayPal Subscription.'
    },
    {
        q: 'Website có chia sẻ thông tin tài khoản của tôi không?',
        a: 'Không. Chúng tôi chỉ hiển thị tên bạn cung cấp và số tiền ủng hộ để cảm ơn công khai. Thông tin ngân hàng hoàn toàn bảo mật.'
    },
    {
        q: 'Làm thế nào để xác nhận ủng hộ thành công?',
        a: 'Nhắn tin kèm ảnh chụp giao dịch qua Zalo hoặc Facebook. Chúng tôi sẽ xác nhận trong vòng 24 giờ.'
    },
];

export const SponsorPage: React.FC = () => {
    const [openFaq, setOpenFaq] = React.useState<number | null>(null);

    return (
        <div className="max-w-4xl mx-auto space-y-16 pb-16 animate-fade-in font-sans">

            {/* Hero */}
            <div className="text-center space-y-4 pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)] border-opacity-20 text-[var(--accent)] text-[12px] font-semibold tracking-wider uppercase">
                    <Heart size={12} className="fill-[var(--accent)]" /> Ủng hộ dự án
                </div>
                <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">
                    Giúp chúng tôi <span className="text-[var(--accent)]">lưu trữ</span> tốt hơn
                </h1>
                <p className="text-[var(--text-secondary)] text-base max-w-xl mx-auto leading-relaxed">
                    Hiện tại, kho lưu trữ của website <strong className="text-[var(--text-primary)]">không đủ dung lượng</strong> để chứa toàn bộ ISO Windows/Office gốc.
                    Mỗi đóng góp của bạn sẽ giúp chúng tôi <strong className="text-[var(--text-primary)]">nâng cấp lưu trữ và cải thiện tốc độ tải xuống</strong> cho mọi người.
                </p>
            </div>

            {/* Problem stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Dung lượng thiếu', value: '~2TB', sub: 'ISO + Ghost + Software' },
                    { label: 'Tốc độ hiện tại', value: '~5 MB/s', sub: 'CDN giới hạn băng thông' },
                    { label: 'Mục tiêu', value: '50 MB/s', sub: 'Sau khi nâng cấp' },
                ].map((s, i) => (
                    <div key={i} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-5 text-center transition-all">
                        <div className="text-2xl font-black text-[var(--text-primary)] mb-1">{s.value}</div>
                        <div className="text-[13px] font-semibold text-[var(--text-primary)] opacity-80 mb-0.5">{s.label}</div>
                        <div className="text-[11px] text-[var(--text-secondary)]">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Payment methods */}
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[var(--accent)] rounded-full inline-block" />
                    Phương thức ủng hộ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PAYMENT_METHODS.map(m => (
                        <div
                            key={m.id}
                            className="relative rounded-2xl border p-6 flex flex-col gap-4 transition-all hover:scale-[1.02] hover:shadow-xl group"
                            style={{ background: m.bg, borderColor: m.border }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {m.logo}
                                    <div>
                                        <div className="font-bold text-[var(--text-primary)] text-[15px]">{m.name}</div>
                                        <div className="text-[11px] px-2 py-0.5 rounded-full border text-[10px] font-semibold transition-colors" style={{ color: m.color, borderColor: m.border }}>
                                            {m.badge}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[var(--bg-primary)] bg-opacity-40 rounded-xl p-3 space-y-1 transition-all">
                                <div className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider opacity-60">
                                    {m.id === 'paypal' ? 'Email / Link' : 'Số tài khoản'}
                                </div>
                                <div className="font-mono font-bold text-[var(--text-primary)] text-[14px] tracking-wider select-all">
                                    {m.account}
                                </div>
                                <div className="text-[11px] text-[var(--text-secondary)] opacity-80">{m.holder}</div>
                            </div>

                            <a
                                href={m.deepLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[13px] text-white transition-all hover:opacity-90 active:scale-95 shadow-lg"
                                style={{ background: m.color, boxShadow: `0 4px 12px ${m.color}40` }}
                            >
                                {m.cta}
                                <ExternalLink size={13} />
                            </a>
                        </div>
                    ))}
                </div>
                <p className="mt-3 text-[12px] text-[var(--text-secondary)] text-center opacity-60">
                    Sau khi ủng hộ, nhắn tin kèm ảnh chụp giao dịch qua Zalo / Facebook để được ghi danh
                </p>
            </div>

            {/* Sponsor list */}
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[var(--accent)] rounded-full inline-block" />
                    Danh sách ủng hộ mới nhất
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {SPONSORS.map((s, i) => (
                        <div key={i} className="flex flex-col items-center p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl hover:border-[var(--accent)] hover:shadow-lg transition-all text-center group">
                            <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-lg mb-3 shadow-[0_0_15px_rgba(var(--accent),0.1)] group-hover:scale-110 transition-transform">
                                {s.name.charAt(0)}
                            </div>
                            <h3 className="text-[13px] font-bold text-[var(--text-primary)] mb-1 truncate w-full">{s.name}</h3>
                            <div className="text-[14px] font-black text-[var(--accent)] mb-2 tracking-tight">{s.amount}</div>
                            <div className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-primary)] px-2 py-0.5 rounded-full border border-[var(--border)] whitespace-nowrap">
                                {s.date}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-center">
                    <div className="px-6 py-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] bg-opacity-30 inline-flex items-center gap-2">
                        <Heart size={14} className="text-[var(--accent)] animate-pulse" />
                        <span className="text-[12px] font-semibold text-[var(--text-secondary)]">Tổng số lượt ủng hộ: {SPONSORS.length} người • Cảm ơn tất cả!</span>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[var(--accent)] rounded-full inline-block" />
                    Câu hỏi thường gặp
                </h2>
                <div className="space-y-2">
                    {FAQ.map((f, i) => (
                        <div key={i} className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-primary)] transition-all">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                <span className="text-[14px] font-semibold text-[var(--text-primary)]">{f.q}</span>
                                <span className={`text-[var(--text-secondary)] transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === i && (
                                <div className="px-5 pb-4 text-[13px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] bg-[var(--bg-secondary)] bg-opacity-30 animate-fade-in">
                                    <p className="pt-3">{f.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
