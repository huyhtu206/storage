import React, { useState, useEffect, useRef } from 'react';
import { Search, Monitor, FileText, Terminal, ChevronRight, X } from 'lucide-react';
import { DOCS_DATA, SOFTWARE_DATABASE, NAVIGATION } from '../constants';
import { NavItem } from '../types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (id: string, type?: 'page' | 'news') => void;
}

interface SearchResult {
    id: string;
    title: string;
    description?: string;
    type: 'page' | 'software';
    group: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Flatten Navigation pages for search
    const getPages = (items: NavItem[]): SearchResult[] => {
        let results: SearchResult[] = [];
        for (const item of items) {
            if (item.pages) {
                results = [...results, ...getPages(item.pages)];
            } else if (!item.isSection) {
                const doc = DOCS_DATA[item.id];
                results.push({
                    id: item.id,
                    title: item.title,
                    description: doc?.description,
                    type: 'page',
                    group: 'Pages'
                });
            }
        }
        return results;
    };

    const allPages = getPages(NAVIGATION);
    const allSoftware = SOFTWARE_DATABASE.map(s => ({
        id: 'software',
        title: s.title,
        description: s.description,
        type: 'software' as const,
        group: 'Phần mềm'
    }));

    const allData = [...allPages, ...allSoftware];

    const filteredResults = query
        ? allData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8)
        : [];

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                // Toggle logic handled by parent, but if open, close it, if closed, parent opens it.
                // Here we just handle close if open to avoid conflicts
                if (isOpen) onClose();
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg shadow-2xl overflow-hidden animate-fade-in">

                {/* Input */}
                <div className="flex items-center px-4 py-4 border-b border-[var(--border)]">
                    <Search className="w-5 h-5 text-[var(--text-secondary)] mr-4" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Tìm kiếm tài liệu, phần mềm, tin tức..."
                        className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] opacity-100 h-6 text-[16px]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                        <kbd className="hidden md:inline-flex px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] text-[var(--text-secondary)] font-mono">ESC</kbd>
                        <button onClick={onClose} className="md:hidden text-[var(--text-secondary)]"><X size={20} /></button>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                    {!query && (
                        <div className="py-12 text-center">
                            <p className="text-[var(--text-secondary)] text-sm">Nhập từ khóa để tìm kiếm...</p>
                            <div className="flex justify-center gap-4 mt-4 text-xs text-[var(--text-secondary)] opacity-60">
                                <span className="flex items-center gap-1"><Terminal size={12} /> Lệnh</span>
                                <span className="flex items-center gap-1"><FileText size={12} /> Tài liệu</span>
                            </div>
                        </div>
                    )}

                    {query && filteredResults.length === 0 && (
                        <div className="py-8 text-center text-[var(--text-secondary)] text-sm">
                            Không tìm thấy kết quả cho "{query}"
                        </div>
                    )}

                    {filteredResults.length > 0 && (
                        <div className="space-y-1">
                            {filteredResults.map((result, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onNavigate(result.id, 'page');
                                        onClose();
                                    }}
                                    className="w-full flex items-center gap-4 px-3 py-3 rounded hover:bg-[var(--bg-secondary)] group transition-colors text-left border border-transparent hover:border-[var(--border)]"
                                >
                                    <div className="p-2 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] border border-[var(--border)] transition-colors">
                                        {result.type === 'page' && <FileText size={18} />}
                                        {result.type === 'software' && <Terminal size={18} />}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-[14px] font-medium text-[var(--text-primary)] truncate">{result.title}</span>
                                            <span className="text-[10px] text-[var(--text-secondary)] font-mono uppercase tracking-wider bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--border)]">{result.group}</span>
                                        </div>
                                        {result.description && (
                                            <p className="text-[13px] text-[var(--text-secondary)] truncate group-hover:text-[var(--text-primary)] transition-colors opacity-70">{result.description}</p>
                                        )}
                                    </div>
                                    <ChevronRight size={16} className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {filteredResults.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg-primary)] text-[11px] text-[var(--text-secondary)] flex justify-between">
                        <span>{filteredResults.length} kết quả</span>
                        <span>Dùng phím mũi tên để di chuyển</span>
                    </div>
                )}
            </div>
        </div>
    );
};