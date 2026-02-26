import React, { useState, useMemo } from 'react';
import { ActivationSection } from '../types';
import { CloudDownload, Check, ExternalLink, Box } from 'lucide-react';
import { api } from '../services/api';

interface OfficeMSIDownloaderProps {
    sections: ActivationSection[];
    baseUrl?: string; // e.g. VLSC base or custom CDN
}

export const OfficeMSIDownloader: React.FC<OfficeMSIDownloaderProps> = ({ sections, baseUrl }) => {
    const [activeIdx, setActiveIdx] = useState(0);
    const [filterArch, setFilterArch] = useState<'all' | 'x64' | 'x32'>('all');
    const [search, setSearch] = useState('');
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const activeSection = sections[activeIdx];

    const hasArch = useMemo(() => activeSection?.items.some(i => i.label), [activeSection]);

    const filtered = useMemo(() => {
        if (!activeSection) return [];
        return activeSection.items.filter(item => {
            const matchArch = filterArch === 'all' || item.label === filterArch;
            const matchSearch = !search ||
                (item.product?.toLowerCase().includes(search.toLowerCase()) ||
                    item.key?.toLowerCase().includes(search.toLowerCase()));
            return matchArch && matchSearch;
        });
    }, [activeSection, filterArch, search]);

    const getDownloadUrl = (filename: string) => {
        if (!filename) return '#';
        if (filename.startsWith('http')) return filename;
        if (baseUrl) return `${baseUrl}/${filename}`;
        // Microsoft VLSC style deep link
        return `https://www.microsoft.com/en-us/download/details.aspx?id=${filename}`;
    };

    const hasLinkCol = activeSection?.headers.some(h => h.key === 'ticketLink');

    return (
        <div className="w-full animate-fade-in font-sans text-[var(--text-primary)]">

            {/* Category Tab Grid — matches OfficeDownloader style */}
            <div className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sections.map((section, idx) => {
                        const isActive = activeIdx === idx;
                        return (
                            <button
                                key={idx}
                                onClick={() => { setActiveIdx(idx); setFilterArch('all'); setSearch(''); }}
                                className={`
                                    flex flex-col items-start justify-center p-4 rounded-lg border text-left 
                                    transition-all relative overflow-hidden
                                    ${isActive
                                        ? 'bg-[var(--bg-secondary)] border-[#E14337] text-[var(--text-primary)] shadow-lg shadow-[#E14337]/10'
                                        : 'bg-[var(--bg-primary)] border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                    }
                                `}
                            >
                                <div className="font-bold text-[13px] leading-tight z-10">
                                    {section.title.replace('Office ', '')}
                                </div>
                                <div className={`text-[11px] font-medium z-10 mt-0.5 ${isActive ? 'text-[#E14337]' : 'text-[var(--text-secondary)] opacity-60'}`}>
                                    {section.items.length} files
                                </div>
                                {isActive && (
                                    <div className="absolute right-2 top-2 text-[#E14337]">
                                        <Check size={13} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filter Bar */}
            {activeSection && (
                <div className="mb-5 bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border)] flex flex-col md:flex-row gap-3 md:items-center justify-between transition-all">
                    <div>
                        <h3 className="text-base font-bold text-[var(--text-primary)]">{activeSection.title}</h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-0.5">{activeSection.items.length} bản cài đặt MSI &mdash; Volume License</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {/* Search */}
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] placeholder:opacity-50 outline-none focus:border-[var(--accent)] w-36 transition-all"
                        />
                        {/* Arch filter */}
                        {hasArch && (
                            <div className="flex bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg overflow-hidden transition-all">
                                {(['all', 'x64', 'x32'] as const).map(a => (
                                    <button
                                        key={a}
                                        onClick={() => setFilterArch(a)}
                                        className={`px-3 py-1.5 text-[12px] font-medium uppercase transition-all ${filterArch === a ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                    >
                                        {a === 'all' ? 'Tất cả' : a}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Table — exact match to C2R / OfficeDownloader style */}
            <div className="w-full overflow-hidden border border-[var(--border)] rounded-xl shadow-sm bg-[var(--bg-primary)] transition-all">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
                                {activeSection?.headers.map((h, i) => (
                                    <th key={i} className={`py-3.5 px-6 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider ${i === activeSection.headers.length - 1 ? 'text-right' : ''}`}>
                                        {h.label === 'Link' ? 'Tải xuống'
                                            : h.label === 'Arch' ? 'Kiến trúc'
                                                : h.label === 'Language' ? 'Ngôn ngữ'
                                                    : h.label === 'Product' ? 'Sản phẩm'
                                                        : h.label === 'Application' ? 'Ứng dụng'
                                                            : h.label === 'Activator' ? 'Trình kích hoạt'
                                                                : h.label === 'Applicable On' ? 'Tương thích với'
                                                                    : h.label === 'Serializer' ? 'Serializer'
                                                                        : h.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filtered.map((item, idx) => (
                                <tr key={idx} className="hover:bg-[var(--bg-secondary)] transition-colors group">
                                    {activeSection.headers.map((h, hIdx) => {
                                        const val = item[h.key as keyof typeof item] as string;
                                        const isLinkCol = h.key === 'ticketLink';
                                        const isFileCol = h.key === 'key' && val && (val.includes('.ISO') || val.includes('.img') || val.includes('.pkg') || val.startsWith('http'));
                                        const isLabel = h.key === 'label';
                                        const isLast = hIdx === activeSection.headers.length - 1;

                                        const handleDownload = async (e: React.MouseEvent, item: any) => {
                                            e.preventDefault();
                                            const key = item.key || item.product;
                                            if (loadingStates[key]) return;

                                            setLoadingStates(prev => ({ ...prev, [key]: true }));
                                            try {
                                                // Determine Category
                                                const category = activeSection.title.toLowerCase().includes('mac') ? 'MAC' : 'MSI';

                                                // For MSI/MAC, we use the product name as the query q
                                                // platform as item.label
                                                const tokenUrl = await api.getProductToken(category, item.product, item.label || 'universal', 'all');

                                                if (tokenUrl) {
                                                    window.location.href = tokenUrl;
                                                } else {
                                                    // Fallback
                                                    const fallback = getDownloadUrl(item.key);
                                                    window.open(fallback, '_blank');
                                                }
                                            } catch (err) {
                                                console.error("Download error:", err);
                                            } finally {
                                                setLoadingStates(prev => ({ ...prev, [key]: false }));
                                            }
                                        };

                                        return (
                                            <td key={hIdx} className={`py-3.5 px-6 ${isLast ? 'text-right' : ''}`}>
                                                {(isLinkCol || isFileCol) && val ? (
                                                    <button
                                                        onClick={(e) => handleDownload(e, item)}
                                                        disabled={loadingStates[item.key || item.product]}
                                                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--accent)] hover:opacity-80 transition-all font-sans disabled:opacity-50"
                                                    >
                                                        <CloudDownload size={13} className={loadingStates[item.key || item.product] ? 'animate-bounce' : ''} />
                                                        <span>{loadingStates[item.key || item.product] ? 'Đang tạo...' : 'Tải xuống'}</span>
                                                        {!loadingStates[item.key || item.product] && <ExternalLink size={11} className="opacity-60" />}
                                                    </button>
                                                ) : isLabel ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[11px] font-mono font-bold text-[#E14337]">
                                                        {val || '—'}
                                                    </span>
                                                ) : (
                                                    <span className={`text-[13px] ${hIdx === 0 ? 'text-[var(--text-primary)] opacity-90 group-hover:text-[var(--accent)] transition-colors font-semibold' : 'text-[var(--text-secondary)] font-mono text-[12px] opacity-70'}`}>
                                                        {val || '—'}
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={activeSection?.headers.length || 3} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-[var(--text-secondary)] opacity-40">
                                            <Box size={36} />
                                            <span className="text-sm">Không tìm thấy kết quả</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="mt-3 text-[11px] text-[var(--text-secondary)] text-right opacity-40">
                {filtered.length} / {activeSection?.items.length || 0} bản — Volume License (VL/KMS)
            </p>
        </div>
    );
};
