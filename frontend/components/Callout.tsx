import React from 'react';
import { Info, AlertTriangle, Lightbulb, Flame } from 'lucide-react';

interface CalloutProps {
  variant: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ variant, title, children }) => {
  const styles = {
    info: {
      borderColor: 'border-[var(--border)]',
      bg: 'bg-[var(--bg-secondary)]',
      iconColor: 'text-[var(--text-secondary)]',
      Icon: Info,
    },
    warning: {
      borderColor: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      iconColor: 'text-amber-500',
      Icon: AlertTriangle,
    },
    tip: {
      borderColor: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      iconColor: 'text-emerald-500',
      Icon: Lightbulb,
    },
    danger: {
      borderColor: 'border-rose-500/30',
      bg: 'bg-rose-500/5',
      iconColor: 'text-rose-500',
      Icon: Flame,
    },
  }[variant];

  const { Icon } = styles;

  return (
    <div className={`my-6 border ${styles.borderColor} ${styles.bg} p-4 rounded-md flex gap-4 transition-all`}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon size={18} className={styles.iconColor} />
      </div>
      <div className="flex-1">
        {title && <h5 className="font-semibold text-sm text-[var(--text-primary)] mb-1">{title}</h5>}
        <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};