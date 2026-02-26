import React, { useState } from 'react';
import { Search, Terminal, ArrowRight, CheckCircle2, Copy } from 'lucide-react';
import { DownloadItem, PlatformType } from '../types';
import { getResolveUrl } from '../services/api';
import { XAICard } from './XAICard';

interface SoftwareCatalogProps {
    items: DownloadItem[];
    activePlatform: PlatformType;
    onPlatformChange: (p: PlatformType) => void;
    title?: string;
    id?: string;
    hideSearch?: boolean;
    selectedIds?: Set<string>;
    toggleSelection?: (id: string) => void;
}

export const SoftwareCatalog: React.FC<SoftwareCatalogProps> = ({
    items,
    activePlatform,
    onPlatformChange,
    title,
    id,
    hideSearch = false,
    selectedIds = new Set(),
    toggleSelection
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedCommands, setCopiedCommands] = useState<Set<string>>(new Set());

    if (!items || !Array.isArray(items)) return null;

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlatform = item.platforms.includes(activePlatform);
        return matchesSearch && matchesPlatform;
    });

    const handleCopy = (e: React.MouseEvent, cmd: string, itemId: string) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(cmd);
        setCopiedCommands(prev => new Set(prev).add(itemId));
        setTimeout(() => {
            setCopiedCommands(prev => {
                const next = new Set(prev);
                next.delete(itemId);
                return next;
            });
        }, 2000);
    };

    return (
        <div className="space-y-8 theme-transition" id={id}>
            {title && <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight scroll-mt-24">{title}</h2>}

            {!hideSearch && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6 relative z-10">
                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors" />
                        <input
                            placeholder="Tìm kiếm phần mềm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 pl-10 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-[var(--accent)] focus:outline-none transition-all shadow-sm focus:shadow-md"
                        />
                    </div>
                    <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border)] shadow-sm">
                        {['windows', 'mac', 'linux'].map(p => (
                            <button
                                key={p}
                                onClick={() => onPlatformChange(p as PlatformType)}
                                className={`px-4 py-1.5 rounded-md text-[12px] font-bold uppercase tracking-wider transition-all ${activePlatform === p ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            )
            }

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item, i) => {
                    const itemId = item.title + i;
                    const command = item.commands?.[activePlatform];
                    // Clean URL - same logic as before
                    const safeLink = item.link === '#' || !item.link?.includes('http')
                        ? getResolveUrl('software', undefined, item.title)
                        : item.link;

                    return (
                        <div key={i} className="relative group/catalog">
                            {toggleSelection && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleSelection(item.title);
                                    }}
                                    className={`absolute -left-3 -top-3 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${selectedIds.has(item.title) ? 'bg-[var(--accent)] border-[var(--accent)] text-white scale-110' : 'bg-[var(--bg-primary)] border-[var(--border)] text-transparent opacity-0 group-hover/catalog:opacity-100'}`}
                                >
                                    <CheckCircle2 size={14} className={selectedIds.has(item.title) ? 'opacity-100' : 'opacity-0'} />
                                </button>
                            )
                            }

                            {
                                command ? (
                                    // For items with terminal commands
                                    <div className={`flex flex-col h-full rounded-xl bg-[var(--bg-secondary)] border transition-all hover:border-[var(--accent)] overflow-hidden ${selectedIds.has(item.title) ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]' : 'border-[var(--border)]'}`}>
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="text-[var(--text-primary)] p-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                                                    <Terminal size={24} />
                                                </div>
                                                {item.version && (
                                                    <span className="rounded-full px-3 py-1 text-[11px] font-bold text-[var(--text-secondary)] bg-[var(--bg-primary)] border border-[var(--border)]">
                                                        {item.version}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[var(--text-primary)] mb-2 tracking-tight flex items-center gap-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">{item.description}</p>
                                            </div>
                                        </div>

                                        {/* Command Bar Footer */}
                                        <div className="bg-[var(--bg-primary)] border-t border-[var(--border)] p-4 flex items-center justify-between gap-4">
                                            <code className="flex-1 text-[13px] font-mono text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-2 rounded border border-[var(--border)] truncate">
                                                {command}
                                            </code>
                                            <button
                                                onClick={(e) => handleCopy(e, command, itemId)}
                                                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded transition-colors flex-shrink-0"
                                                title="Copy command"
                                            >
                                                {copiedCommands.has(itemId) ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                            <a
                                                href={safeLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[12px] font-bold text-[var(--accent)] hover:opacity-80 transition-opacity flex items-center gap-1 flex-shrink-0"
                                            >
                                                Chi tiết <ArrowRight size={14} />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    // For items without commands (Standard XAICard)
                                    <div className={`h-full transition-all ${selectedIds.has(item.title) ? 'ring-2 ring-[var(--accent)] rounded-xl' : ''}`}>
                                        <XAICard
                                            title={item.title}
                                            description={item.description}
                                            icon={<Terminal size={24} />}
                                            badge={item.version}
                                            link={safeLink}
                                        />
                                    </div>
                                )}
                        </div>
                    );
                })}
            </div>
            {filteredItems.length === 0 && (
                <div className="text-center py-12 text-[var(--text-secondary)]">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Không tìm thấy phần mềm nào phù hợp.</p>
                </div>
            )}
        </div>
    );
};
