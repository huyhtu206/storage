import React, { useState, useMemo } from 'react';
import { WindowsEdition } from '../types';
import { Copy, Check, ChevronRight, Heart, Apple, Terminal, CloudDownload, Box } from 'lucide-react';
import api from '../services/api';

interface WindowsDownloaderProps {
    editions: WindowsEdition[];
}

export const WindowsDownloader: React.FC<WindowsDownloaderProps> = ({ editions }) => {
    const [activeTabId, setActiveTabId] = useState<string>(editions[0]?.id || '');
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const currentEdition = useMemo(() =>
        editions.find(e => e.id === activeTabId),
        [editions, activeTabId]);

    if (!currentEdition) return null;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 2000);
    };

    const handleDownload = async (e: React.MouseEvent, iso: any) => {
        e.preventDefault();
        const key = iso.filename;
        if (loadingStates[key]) return;

        setLoadingStates(prev => ({ ...prev, [key]: true }));
        try {
            // For Windows, we use the filename as the unique identifier if product ID is not reliable
            const tokenUrl = await api.getProductToken('WINDOWS', iso.filename);

            if (tokenUrl) {
                window.location.href = tokenUrl;
            } else {
                // Fallback to the ISDN rule directly if API fails
                const fallback = `https://archive.isdn.network/windows/${iso.filename}?`;
                window.open(fallback, '_blank');
            }
        } catch (err) {
            console.error("Download error:", err);
        } finally {
            setLoadingStates(prev => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div className="w-full animate-fade-in font-sans text-[var(--text-primary)]">

            {/* Edition Selection Grid */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[var(--accent)] rounded-full opacity-50"></span>
                    Chọn danh mục
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {editions.map(edition => {
                        const isActive = activeTabId === edition.id;
                        return (
                            <button
                                key={edition.id}
                                onClick={() => setActiveTabId(edition.id)}
                                className={`
                                flex flex-col items-start justify-center p-5 rounded-lg border text-left transition-all relative overflow-hidden group
                                ${isActive
                                        ? 'bg-[var(--bg-secondary)] border-[var(--accent)] text-[var(--text-primary)] shadow-lg shadow-black/5'
                                        : 'bg-[var(--bg-primary)] border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                    }
                            `}
                            >
                                <div className="font-bold text-[14px] leading-tight mb-1 z-10">
                                    {edition.title}
                                </div>
                                <div className={`text-[12px] font-medium z-10 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                    {edition.subTitle}
                                </div>

                                {isActive && (
                                    <div className="absolute right-2 top-2 text-[var(--accent)]">
                                        <Check size={14} />
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Selected Edition Details */}
            <div className="mb-6 bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{currentEdition.title} {currentEdition.subTitle}</h3>
                    <span className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border)]">{currentEdition.buildVersion}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] max-w-4xl leading-relaxed">
                    Danh sách các bản ISO gốc từ Microsoft. Chọn ngôn ngữ phù hợp để tải xuống.
                </p>
            </div>

            {/* Table */}
            <div className="w-full overflow-hidden border border-[var(--border)] rounded-xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse bg-[var(--bg-primary)]">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
                                <th className="py-3.5 px-6 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Ngôn ngữ</th>
                                <th className="py-3.5 px-6 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider w-24">Arch</th>
                                <th className="py-3.5 px-6 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider w-32">SHA-1</th>
                                <th className="py-3.5 px-6 text-[12px] font-bold text-[var(--text-secondary)] uppercase tracking-wider text-right">Link tải</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {currentEdition.isoList.map((iso, idx) => (
                                <tr key={idx} className="hover:bg-[var(--bg-secondary)] transition-colors group">
                                    <td className="py-4 px-6 text-sm text-[var(--text-primary)] font-medium">
                                        {iso.language}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-[var(--text-secondary)]">
                                        {iso.arch}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="relative group/copy cursor-pointer" onClick={() => handleCopy(iso.sha256)}>
                                            <div className="text-xs font-mono text-[var(--text-secondary)] truncate max-w-[100px] group-hover/copy:text-[var(--accent)] transition-colors opacity-60 group-hover/copy:opacity-100">
                                                {iso.sha256 || 'N/A'}
                                            </div>
                                            {iso.sha256 && (
                                                <div className="absolute right-0 top-0 opacity-0 group-hover/copy:opacity-100 transition-opacity">
                                                    {copiedText === iso.sha256 ? <Check size={12} className="text-[var(--accent)]" /> : <Copy size={12} />}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right font-mono text-[12px]">
                                        <button
                                            onClick={(e) => handleDownload(e, iso)}
                                            disabled={loadingStates[iso.filename]}
                                            title={iso.filename}
                                            className="inline-flex items-center gap-2 text-[var(--text-primary)] hover:opacity-70 transition-all truncate max-w-[300px] font-bold disabled:opacity-50"
                                        >
                                            <CloudDownload size={14} className={`shrink-0 ${loadingStates[iso.filename] ? 'animate-bounce' : ''}`} />
                                            <span className="truncate">{iso.filename}</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {currentEdition.isoList.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-sm text-[var(--text-secondary)]">
                                        <div className="flex flex-col items-center gap-2">
                                            <Box size={32} className="opacity-20" />
                                            <span>Dữ liệu đang được cập nhật...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};