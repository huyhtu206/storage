import React, { useState, useMemo } from 'react';
import { OfficeDownloaderData } from '../types';
import { CloudDownload, Check, Globe, Box, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

interface OfficeDownloaderProps {
    data: OfficeDownloaderData;
}

export const OfficeDownloader: React.FC<OfficeDownloaderProps> = ({ data }) => {
    const [activeTabId, setActiveTabId] = useState<string>(data.categories[0]?.id || '');
    const [selectedLang, setSelectedLang] = useState(data.languages[0]?.value || 'en-US');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

    const currentCategory = useMemo(() =>
        data.categories.find(c => c.id === activeTabId),
        [data.categories, activeTabId]);

    const selectedLangLabel = useMemo(() =>
        data.languages.find(l => l.value === selectedLang)?.label || selectedLang,
        [data.languages, selectedLang]);

    if (!currentCategory) return null;

    return (
        <div className="w-full animate-fade-in font-sans text-[var(--text-primary)]" onClick={() => setIsLangOpen(false)}>

            {/* Category Selection Grid - EXTACT MATCH to WindowsDownloader */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[var(--accent)] rounded-full opacity-50"></span>
                    Chọn danh mục
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.categories.map(category => {
                        const isActive = activeTabId === category.id;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveTabId(category.id)}
                                className={`
                                flex flex-col items-start justify-center p-5 rounded-lg border text-left transition-all relative overflow-hidden group
                                ${isActive
                                        ? 'bg-[var(--bg-secondary)] border-[var(--accent)] text-[var(--text-primary)] shadow-lg shadow-black/5'
                                        : 'bg-[var(--bg-primary)] border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                    }
                            `}
                            >
                                <div className="font-bold text-[14px] leading-tight mb-1 z-10">
                                    {category.title}
                                </div>
                                <div className={`text-[12px] font-medium z-10 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                    {category.subTitle}
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

            {/* Selected Category Details & PREMIUM Language Selector */}
            <div className="mb-6 bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{currentCategory.title} {currentCategory.subTitle}</h3>
                        <span className="text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--bg-primary)] px-2 py-0.5 rounded border border-[var(--border)] uppercase tracking-tighter">
                            {currentCategory.buildVersion}
                        </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                        {currentCategory.description || 'Danh sách các bản cài đặt Office C2R. Chọn ngôn ngữ phù hợp để tải xuống.'}
                    </p>
                </div>

                {/* Custom Premium Dropdown */}
                <div
                    className="relative w-full md:w-72"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsLangOpen(!isLangOpen);
                    }}
                >
                    <div className={`
                        w-full bg-[var(--bg-primary)] p-4 rounded-lg border transition-all cursor-pointer group/select flex items-center justify-between
                        ${isLangOpen ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]/10 shadow-lg shadow-black/5' : 'border-[var(--border)] hover:border-[var(--accent)]'}
                    `}>
                        <div className="flex flex-col">
                            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-2 transition-colors ${isLangOpen ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                <Globe size={11} />
                                Ngôn ngữ hệ thống
                            </h4>
                            <div className="text-[13px] text-[var(--text-primary)] font-medium truncate max-w-[200px]">
                                {selectedLangLabel}
                            </div>
                        </div>
                        <ChevronRight size={16} className={`text-[var(--text-secondary)] transition-transform duration-300 ${isLangOpen ? 'rotate-90' : ''}`} />
                    </div>

                    {/* Popover Menu */}
                    {isLangOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl shadow-2xl z-[100] max-h-[320px] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="overflow-y-auto custom-scrollbar p-2">
                                {data.languages.map(lang => (
                                    <div
                                        key={lang.value}
                                        onClick={() => {
                                            setSelectedLang(lang.value);
                                            setIsLangOpen(false);
                                        }}
                                        className={`
                                            flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all mb-1
                                            ${selectedLang === lang.value
                                                ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'}
                                        `}
                                    >
                                        <span className="text-[13px] font-medium">{lang.label}</span>
                                        {selectedLang === lang.value && <Check size={14} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Table - EXACT MATCH to WindowsDownloader structure/style */}
            <div className="w-full overflow-hidden border border-[var(--border)] rounded-xl shadow-sm bg-[var(--bg-primary)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
                                <th className="py-3.5 px-6 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Sản phẩm</th>
                                <th className="py-3.5 px-6 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Ứng dụng</th>
                                <th className="py-3.5 px-6 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider text-center w-32">Tải x64</th>
                                <th className="py-3.5 px-6 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider text-center w-32">Tải x32</th>
                                <th className="py-3.5 px-6 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider text-right w-32">Offline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {currentCategory.products.map((prod, idx) => {
                                const handleDownload = async (e: React.MouseEvent, type: 'x64' | 'x86' | 'offline') => {
                                    e.preventDefault();
                                    const key = `${prod.productId}-${type}`;
                                    if (loadingStates[key]) return;

                                    setLoadingStates(prev => ({ ...prev, [key]: true }));
                                    try {
                                        const lang = selectedLang.toLowerCase();
                                        const platform = type === 'x86' ? 'x86' : 'x64';

                                        // Category in D1 is 'OFFICE' for C2R
                                        const tokenUrl = await api.getProductToken('OFFICE', prod.productId, platform, lang);
                                        if (tokenUrl) {
                                            window.location.href = tokenUrl;
                                        } else {
                                            // Fallback to construction if everything fails
                                            const fallback = type === 'offline'
                                                ? `https://officecdn.microsoft.com/db/492350f6-3a01-4f97-b9c0-c7c6ddf67d60/media/${lang}/${prod.productId}.img`
                                                : `https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=${prod.productId}&platform=${type}&language=${lang}&version=O16GA`;
                                            window.open(fallback, '_blank');
                                        }
                                    } catch (err) {
                                        console.error("Download error:", err);
                                    } finally {
                                        setLoadingStates(prev => ({ ...prev, [key]: false }));
                                    }
                                };

                                const downloadStyle = "inline-flex items-center gap-1.5 text-[var(--text-primary)] hover:opacity-70 transition-all text-[12px] font-bold disabled:opacity-50 disabled:cursor-wait";

                                return (
                                    <tr key={idx} className="hover:bg-[var(--bg-secondary)] transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:opacity-80 transition-colors">
                                                {prod.productId}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-[280px]">
                                                {prod.includedApps}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {prod.onlineX64 !== 'NA' ? (
                                                <button
                                                    onClick={(e) => handleDownload(e, 'x64')}
                                                    disabled={loadingStates[`${prod.productId}-x64`]}
                                                    className={downloadStyle}
                                                >
                                                    <CloudDownload size={14} className={loadingStates[`${prod.productId}-x64`] ? 'animate-bounce' : ''} />
                                                    <span>{loadingStates[`${prod.productId}-x64`] ? 'Đang tạo...' : 'Tải x64'}</span>
                                                </button>
                                            ) : (
                                                <span className="text-[var(--text-secondary)] opacity-10 text-xs font-mono">—</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {prod.onlineX32 !== 'NA' ? (
                                                <button
                                                    onClick={(e) => handleDownload(e, 'x86')}
                                                    disabled={loadingStates[`${prod.productId}-x86`]}
                                                    className={downloadStyle}
                                                >
                                                    <CloudDownload size={14} className={loadingStates[`${prod.productId}-x86`] ? 'animate-bounce' : ''} />
                                                    <span>{loadingStates[`${prod.productId}-x86`] ? 'Đang tạo...' : 'Tải x32'}</span>
                                                </button>
                                            ) : (
                                                <span className="text-[var(--text-secondary)] opacity-10 text-xs font-mono">—</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-right font-mono text-[12px]">
                                            {prod.offlineX32X64 !== 'NA' ? (
                                                <button
                                                    onClick={(e) => handleDownload(e, 'offline')}
                                                    disabled={loadingStates[`${prod.productId}-offline`]}
                                                    className={downloadStyle}
                                                >
                                                    <CloudDownload size={14} className={loadingStates[`${prod.productId}-offline`] ? 'animate-bounce' : ''} />
                                                    <span>{loadingStates[`${prod.productId}-offline`] ? 'Đang tạo...' : 'Tải Offline'}</span>
                                                </button>
                                            ) : (
                                                <span className="text-[var(--text-secondary)] opacity-10">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {currentCategory.products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center text-sm text-[var(--text-secondary)]">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative">
                                                <Box size={40} className="text-[var(--border)]" />
                                            </div>
                                            <span className="font-medium tracking-tight">Dữ liệu đang được cập nhật...</span>
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
