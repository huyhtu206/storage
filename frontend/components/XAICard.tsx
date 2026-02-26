import React from 'react';

// --- OpenAI Style Card ---
export interface XAICardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    badge?: string;
    onClick?: () => void;
    link?: string;
    footer?: React.ReactNode;
    image?: string; // For gradient backgrounds
}

export const XAICard: React.FC<XAICardProps> = ({ title, description, icon, badge, onClick, link, footer, image }) => {
    const Wrapper = link && link !== '#' ? 'a' : 'div';
    return (
        <Wrapper
            href={link && link !== '#' ? link : undefined}
            target={link && link !== '#' && !link.startsWith('/') ? "_blank" : undefined}
            onClick={onClick}
            className="group relative flex flex-col justify-between rounded-xl bg-[var(--bg-secondary)] p-6 transition-all border border-[var(--border)] hover:border-[var(--accent)] cursor-pointer h-full overflow-hidden"
        >
            {image && (
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                </div>
            )}
            <div className="relative z-10 w-full h-full flex flex-col justify-between">
                <div className="flex items-start justify-between mb-8">
                    <div className="text-[var(--text-primary)]">
                        {icon}
                    </div>
                    {badge && (
                        <span className="rounded-full px-3 py-0.5 text-[11px] font-medium text-[var(--text-primary)] bg-[var(--text-primary)]/10 backdrop-blur-md border border-[var(--text-primary)]/10">
                            {badge}
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="text-[17px] font-semibold text-[var(--text-primary)] mb-2 tracking-tight group-hover:opacity-80 transition-opacity">{title}</h3>
                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed line-clamp-2 group-hover:text-[var(--text-primary)] transition-colors">{description}</p>
                </div>
                {footer && <div className="mt-4 pt-4 border-t border-[var(--border)]">{footer}</div>}
            </div>
        </Wrapper>
    );
};
