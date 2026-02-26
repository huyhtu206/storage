import React, { useState, useRef, DragEvent, useEffect } from 'react';
import { UploadCloud, Link as LinkIcon, QrCode, Copy, CheckCircle2, ChevronDown, Lock, Shield, Zap, RefreshCw, X } from 'lucide-react';

export const FileSharingPage: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [personalCode, setPersonalCode] = useState('');
    const [expiry, setExpiry] = useState<'1d' | '7d' | '30d' | 'never'>('7d');
    const [shareMode, setShareMode] = useState<'link' | 'qr'>('link');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dummy user domain
    const USER_DOMAIN = "share.huynhtu.dev/f";

    const shareLink = `https://${USER_DOMAIN}/${personalCode || 'anon'}/${selectedFile ? selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_') : 'file'}`;

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFile(e.dataTransfer.files[0]);
            setUploadComplete(false); // reset state if new file is dropped
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setUploadComplete(false);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;
        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            setIsUploading(false);
            setUploadComplete(true);
        }, 1800);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const resetForm = () => {
        setSelectedFile(null);
        setUploadComplete(false);
        setPersonalCode('');
        setExpiry('7d');
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in theme-transition pb-20">
            {/* Header / Intro */}
            <div className="mb-10 pt-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter text-[var(--text-primary)] flex items-center gap-3">
                    Chia sẻ Tệp
                    <span className="px-3 py-1 text-sm bg-[var(--accent)]/10 text-[var(--accent)] rounded-full border border-[var(--accent)]/20 font-medium">BETA</span>
                </h1>
                <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                    Tải lên và chia sẻ tệp của bạn một cách an toàn. Cung cấp đường dẫn cá nhân hóa, tự động hủy sau khi hết hạn.
                </p>

                <div className="flex flex-wrap gap-4 mt-6">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Lock size={16} className="text-[var(--text-primary)]" /> Mã hóa End-to-End
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Zap size={16} className="text-[var(--text-primary)]" /> Tốc độ CDN cao
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Shield size={16} className="text-[var(--text-primary)]" /> Tự động xóa
                    </div>
                </div>
            </div>

            {/* Main Form Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Left Column: Upload Zone (Col Span 3) */}
                <div className="lg:col-span-3 space-y-6">
                    <div
                        className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-all cursor-pointer overflow-hidden min-h-[320px]
                            ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/5 scale-[1.02]' : 'border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--text-secondary)]'}
                            ${uploadComplete ? 'border-green-500/50 bg-green-500/5 cursor-default' : ''}
                        `}
                        onDragOver={!uploadComplete ? handleDragOver : undefined}
                        onDragLeave={!uploadComplete ? handleDragLeave : undefined}
                        onDrop={!uploadComplete ? handleDrop : undefined}
                        onClick={() => !uploadComplete && fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploadComplete}
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center text-center animate-pulse">
                                <RefreshCw size={48} className="text-[var(--accent)] animate-spin mb-4" />
                                <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Đang tải lên...</h3>
                                <p className="text-[var(--text-secondary)] mt-2">Đang mã hóa ({selectedFile?.name})</p>
                            </div>
                        ) : uploadComplete ? (
                            <div className="flex flex-col items-center text-center">
                                <CheckCircle2 size={56} className="text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-2">Đã Tải Lên Thành Công</h3>
                                <p className="text-[var(--text-secondary)] max-w-sm">Tệp của bạn đã sẵn sàng chia sẻ. Thiết lập quyền truy cập sẽ được áp dụng ngay.</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); resetForm(); }}
                                    className="mt-6 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
                                >
                                    <RefreshCw size={14} /> Tải tệp khác
                                </button>
                            </div>
                        ) : selectedFile ? (
                            <div className="flex flex-col items-center text-center w-full">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center mb-4 shadow-sm">
                                    <UploadCloud size={28} className="text-[var(--accent)]" />
                                </div>
                                <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight mb-1 truncate max-w-[80%]">{selectedFile.name}</h3>
                                <p className="text-[var(--text-secondary)] font-mono text-sm mb-8">{formatBytes(selectedFile.size)}</p>

                                <div className="flex gap-3 relative z-10 w-full max-w-xs">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                                        className="flex-1 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                                    >
                                        Bắt đầu tải lên
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                        className="p-3 bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)] rounded-xl hover:text-[var(--text-primary)] transition-colors"
                                        title="Hủy"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mb-4 border border-[var(--border)] shadow-sm">
                                    <UploadCloud size={24} className="text-[var(--text-secondary)]" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-2">Kéo & Thả tệp vào đây</h3>
                                <p className="text-[var(--text-secondary)]">hoặc click để duyệt tìm trong máy của bạn</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-6 px-3 py-1 bg-[var(--bg-primary)] rounded border border-[var(--border)]">Hỗ trợ tối đa 5GB / tệp</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Settings & Share (Col Span 2) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Settings Panel */}
                    <div className={`bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 transition-opacity ${uploadComplete ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <SettingsIcon size={18} /> Cấu hình chia sẻ
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Mã cá nhân (Tùy chọn)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="vidu: tai-lieu-hop"
                                        value={personalCode}
                                        onChange={(e) => setPersonalCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                                    />
                                    <span className="absolute right-4 top-3 text-[var(--text-secondary)] text-xs font-mono pointer-events-none">Url Alias</span>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] mt-2">Tạo đường dẫn thân thiện dễ nhớ: /f/ma-cua-ban/file</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Tự động xóa sau</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: '1d', label: '1 Ngày' },
                                        { id: '7d', label: '7 Ngày' },
                                        { id: '30d', label: '30 Ngày' },
                                        { id: 'never', label: 'Vĩnh viễn' }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setExpiry(opt.id as any)}
                                            className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${expiry === opt.id ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output Panel (Revealed when complete) */}
                    <div className={`bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 transition-all duration-500 ${uploadComplete ? 'opacity-100 translate-y-0 shadow-lg border-[var(--accent)]/30' : 'opacity-30 blur-[2px] pointer-events-none translate-y-2'}`}>
                        <div className="flex border-b border-[var(--border)] mb-6">
                            <button
                                onClick={() => setShareMode('link')}
                                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${shareMode === 'link' ? 'border-[var(--text-primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                <LinkIcon size={16} /> Liên kết
                            </button>
                            <button
                                onClick={() => setShareMode('qr')}
                                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${shareMode === 'qr' ? 'border-[var(--text-primary)] text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                <QrCode size={16} /> Mã QR
                            </button>
                        </div>

                        {shareMode === 'link' ? (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">Đường dẫn chia sẻ trực tiếp</label>
                                    <div className="flex">
                                        <input
                                            readOnly
                                            value={shareLink}
                                            className="w-full bg-[var(--bg-primary)] border border-r-0 border-[var(--border)] rounded-l-xl px-4 py-3 text-sm font-mono text-[var(--text-primary)] focus:outline-none"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className={`px-4 border border-[var(--border)] rounded-r-xl transition-all flex items-center gap-2 ${copied ? 'bg-green-500 text-white border-green-500' : 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90'}`}
                                        >
                                            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                            <span className="font-bold text-sm hidden sm:inline">{copied ? 'Đã copy' : 'Copy'}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
                                    <span className="text-sm font-medium text-[var(--text-secondary)]">Gửi qua:</span>
                                    {['Zalo', 'Facebook', 'Telegram'].map(p => (
                                        <button key={p} className="text-xs font-medium px-3 py-1.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--text-primary)] transition-colors">
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4 animate-fade-in">
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    {/* Placeholder QR using CSS grid to simulate real QR code */}
                                    <div className="w-40 h-40 grid grid-cols-5 grid-rows-5 gap-1">
                                        {Array.from({ length: 25 }).map((_, i) => (
                                            <div key={i} className={`${(i % 2 === 0 || i % 3 === 0) && i !== 12 ? 'bg-black' : 'bg-transparent'} ${(i === 0 || i === 4 || i === 20 || i === 24) ? 'bg-black w-full h-full rounded-sm' : ''}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] mt-4 text-center">Quét mã QR bằng camera điện thoại<br />để tải xuống trực tiếp thiết bị</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper icon
const SettingsIcon = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
