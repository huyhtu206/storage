import React from 'react';
import { MousePointer2, Home, ArrowLeft, Search } from 'lucide-react';

interface NotFoundProps {
    onBackHome: () => void;
    onSearch: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onBackHome, onSearch }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 animate-fade-in">
            <div className="relative mb-6">
                <div className="absolute inset-x-0 -top-20 -bottom-20 blur-[100px] bg-[var(--accent)] opacity-10 rounded-full" />
                <div className="relative text-[140px] font-bold tracking-tighter leading-none text-[var(--text-primary)] opacity-10">
                    404
                </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tighter text-[var(--text-primary)]">
                Page Not Found
            </h2>

            <p className="text-[var(--text-secondary)] text-lg max-w-md mb-8 leading-relaxed">
                The path you entered does not exist in our documentation space.
            </p>

            {/* Prominent Search Bar on 404 */}
            <div
                onClick={onSearch}
                className="w-full max-w-lg mb-12 relative group cursor-pointer"
            >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
                <div className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full py-4 pl-12 pr-6 text-[16px] text-[var(--text-secondary)] text-left group-hover:border-[var(--accent)] transition-all shadow-xl shadow-black/20">
                    Try searching for what you need...
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onBackHome}
                    className="flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-3 rounded-full font-semibold hover:opacity-80 transition-all font-sans"
                >
                    <Home size={18} />
                    <span>Back to Overview</span>
                </button>
            </div>

            <div className="mt-20 flex items-center gap-4 text-[var(--text-secondary)] opacity-30">
                <MousePointer2 size={16} />
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Error Reference: NULL_SPACE_V1</span>
            </div>
        </div>
    );
};
