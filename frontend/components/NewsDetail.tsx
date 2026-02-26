import React from 'react';
import { NewsItem } from '../types';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';

interface NewsDetailProps {
    item: NewsItem;
    onBack: () => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ item, onBack }) => {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto pb-20">
            {/* Breadcrumb / Back */}
            <button
                onClick={onBack}
                className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
            >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                Back to News
            </button>

            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-secondary)] mb-4 uppercase tracking-wider">
                    <span className="text-[var(--text-primary)] opacity-80">{item.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight tracking-tight mb-6">
                    {item.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] pb-8 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)] border border-[var(--border)]">
                            <User size={16} />
                        </div>
                        <span>By <span className="text-[var(--text-primary)] font-medium">{item.author || 'HuynhTu'}</span></span>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {item.image && (
                <div className="w-full aspect-video rounded-lg overflow-hidden mb-12 border border-[var(--border)] bg-[var(--bg-secondary)]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
            )}

            {/* Content Body */}
            <div className="prose max-w-none">
                <div
                    dangerouslySetInnerHTML={{ __html: item.content }}
                    className="text-[var(--text-secondary)] transition-colors leading-8 space-y-6 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[var(--text-primary)] [&>h3]:mt-10 [&>h3]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-2 [&>code]:bg-[var(--bg-secondary)] [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-sm [&>code]:border [&>code]:border-[var(--border)]"
                />
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[var(--border)]">
                    <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] text-xs hover:bg-[var(--border)] hover:text-[var(--text-primary)] transition-colors">
                                <Tag size={12} /> {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};