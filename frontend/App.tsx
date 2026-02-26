import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { Accordion } from './components/Accordion';
import { CodeBlock } from './components/CodeBlock';
import { Callout } from './components/Callout';
import { WindowsDownloader } from './components/WindowsDownloader';
import { OfficeDownloader } from './components/OfficeDownloader';
import { OfficeMSIDownloader } from './components/OfficeMSIDownloader';
import { SponsorPage } from './components/SponsorPage';
import { SearchModal } from './components/SearchModal';
import { NewsDetail } from './components/NewsDetail';
import { ActivationTable } from './components/ActivationTable';
import { DriverPage } from './components/DriverPage';
import { NotFound } from './components/NotFound';
import { XAICard } from './components/XAICard';
import { QuickstartHero } from './components/QuickstartHero';
import { SoftwareCatalog } from './components/SoftwareCatalog';
import { FileSharingPage } from './components/FileSharingPage';
import { NAVIGATION, DOCS_DATA, PAGES_WITH_DRIVERS } from './constants';
import { DocSectionType, DownloadItem, NewsItem, PlatformType, ServiceItem, WindowsEdition, AccordionItem, OfficeDownloaderData, ActivationSection } from './types';
import { Terminal, Settings, Zap, Search, Box, Cpu, Globe, Shield, Command, Monitor, CloudDownload, Key, ArrowRight, Play, LayoutGrid } from 'lucide-react';
import { getResolveUrl } from './services/api';

// --- Helper Icons ---
const getIcon = (name: string, props: any = { size: 24 }) => {
    switch (name) {
        case 'windows': return <Monitor {...props} />;
        case 'office': return <LayoutGrid {...props} />;
        case 'remote': return <Command {...props} />;
        case 'key': return <Key {...props} />;
        case 'cpu': return <Cpu {...props} />;
        case 'shield': return <Shield {...props} />;
        case 'zap': return <Zap {...props} />;
        case 'globe': return <Globe {...props} />;
        case 'code': return <Terminal {...props} />;
        case 'settings': return <Settings {...props} />;
        case 'hard-drive': return <Box {...props} />;
        case 'download': return <CloudDownload {...props} />;
        case 'play': return <Play {...props} />;
        default: return <Terminal {...props} />;
    }
};



// --- Main App ---

function App() {
    const [activeSlug, setActiveSlug] = useState<string>('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activePlatform, setActivePlatform] = useState<PlatformType>('windows');
    const [isDark, setIsDark] = useState(true);

    // Sync theme with document element for global CSS variables access
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
    }, [isDark]);

    // Handle initial route from URL if present (simple SPA router)
    useEffect(() => {
        const path = window.location.pathname.replace(/^\//, '');
        if (path && (DOCS_DATA[path] || PAGES_WITH_DRIVERS[path])) {
            setActiveSlug(path);
        }
    }, []);
    const activePage = DOCS_DATA[activeSlug] || PAGES_WITH_DRIVERS[activeSlug];
    const isNotFound = !activePage;

    const handleNavigate = (id: string, type: 'page' | 'news' = 'page') => {
        setActiveSlug(id);
        // Update URL without reload
        window.history.pushState({}, '', `/${id === 'home' ? '' : id}`);

        setIsMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderBlock = (block: any, index: number) => {
        switch (block.type as DocSectionType) {
            case 'quickstart-hero':
                return <QuickstartHero key={index} />;
            case 'grid-cards':
                return (
                    <div key={index} className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            {block.title && <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{block.title}</h3>}
                            <button className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
                                View all <ArrowRight size={14} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(block.content as any[]).map((item, i) => (
                                <XAICard
                                    key={i}
                                    title={item.title}
                                    description={item.description || ''}
                                    image={item.image}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'text':
                return (
                    <div key={index} className="mb-10 w-full" id={block.title ? 'section-' + index : undefined}>
                        {block.title && <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 tracking-tight" id={block.title ? block.title.toLowerCase().replace(/\s+/g, '-') : undefined}>{block.title}</h2>}
                        <div
                            className="text-[var(--text-secondary)] leading-relaxed text-[16px] prose prose-invert max-w-none prose-p:mb-4"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                    </div>
                );
            case 'code':
                return <div key={index} className="mb-8"><CodeBlock code={block.content} language={block.language} /></div>;
            case 'accordion':
                return (
                    <div key={index} className="max-w-4xl mx-auto w-full mb-12">
                        <Accordion items={block.content as AccordionItem[]} />
                    </div>
                );
            case 'callout':
                return <Callout key={index} variant={block.variant} title={block.title}>{block.content}</Callout>;
            case 'windows-release-grid':
                return (
                    <div key={index} className="w-full mb-12">
                        <WindowsDownloader key={activeSlug + index} editions={block.content as WindowsEdition[]} />
                    </div>
                );
            case 'office-downloader':
                return (
                    <div key={index} className="w-full mb-12">
                        <OfficeDownloader data={block.content as OfficeDownloaderData} />
                    </div>
                );
            case 'office-msi-downloader': {
                const proxyBase = (import.meta as any).env?.VITE_PROXY_URL
                    ?? 'https://api.huynhtu.com';
                return (
                    <div key={index} className="w-full mb-12">
                        <OfficeMSIDownloader
                            sections={block.content as ActivationSection[]}
                            baseUrl={proxyBase}
                        />
                    </div>
                );
            }
            case 'sponsor-page':
                return <SponsorPage key={index} />;
            case 'services-grid':
                return (
                    <div key={index} className="mb-12">
                        {block.title && <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 tracking-tight" id="services">{block.title}</h3>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(block.content as ServiceItem[]).map((item, i) => (
                                <XAICard
                                    key={i}
                                    title={item.title}
                                    description={item.description}
                                    icon={getIcon(item.icon)}
                                    badge={item.price}
                                    link={item.link}
                                    footer={
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[var(--text-secondary)]">Learn more</span>
                                            <ArrowRight size={14} className="text-[var(--text-primary)]" />
                                        </div>
                                    }
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'software-catalog':
                return (
                    <SoftwareCatalog
                        key={index}
                        items={block.content as DownloadItem[]}
                        activePlatform={activePlatform}
                        onPlatformChange={setActivePlatform}
                    />
                );
            case 'driver-page':
                return (
                    <div key={index} className="w-full mb-12">
                        <DriverPage platforms={block.content} />
                    </div>
                );
            case 'ghost-catalog':
                return (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {(block.content as any[]).map((item, i) => (
                            <XAICard
                                key={i}
                                title={item.title}
                                description={item.description}
                                icon={getIcon('hard-drive')}
                                badge={item.version}
                                link="#"
                            />
                        ))}
                    </div>
                );
            case 'activation-section':
                return (
                    <div key={index} className="w-full mb-12">
                        <ActivationTable data={block.content as ActivationSection[]} />
                    </div>
                );
            case 'file-sharing':
                return <FileSharingPage key={index} />;
            default:
                return null;
        }
    };


    // Extract headings for right sidebar
    const headings = activePage.blocks
        .filter(s => s.type === 'text' && s.title)
        .map((s, i) => ({
            id: s.title ? s.title.toLowerCase().replace(/\s+/g, '-') : `section-${i}`,
            text: s.title || '',
            level: 2
        }));


    useEffect(() => {
        const handleInternalLinks = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link && link.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                const slug = link.getAttribute('href')?.substring(1);
                if (slug) {
                    handleNavigate(slug, 'page');
                }
            }
        };

        document.addEventListener('click', handleInternalLinks);
        return () => document.removeEventListener('click', handleInternalLinks);
    }, []);

    const isWindowsPage = activeSlug.startsWith('win-') || activeSlug.startsWith('ghost-') || activeSlug.startsWith('sw-win') || activeSlug === 'windows' || activeSlug === 'office-msi' || activeSlug === 'office-mac' || activeSlug.startsWith('driver-');

    return (
        <div
            data-theme={isDark ? 'dark' : 'light'}
            className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden transition-colors duration-300"
        >
            <Header
                onMenuClick={() => setIsMobileMenuOpen(true)}
                onNavigate={handleNavigate}
                onSearchClick={() => setIsSearchOpen(true)}
                isDark={isDark}
                onToggleTheme={() => setIsDark(!isDark)}
            />

            <div className="flex-1 max-w-none mx-auto w-full flex overflow-hidden relative">
                <div className="md:block shrink-0">
                    <SidebarLeft
                        items={NAVIGATION}
                        activeId={activeSlug}
                        onNavigate={handleNavigate}
                        isOpenMobile={isMobileMenuOpen}
                    />
                </div>

                <main className="flex-1 min-w-0 overflow-y-auto scrollbar-hide">
                    <div className="px-4 md:px-12 py-8 md:py-16">
                        {isNotFound ? (
                            <NotFound
                                onBackHome={() => handleNavigate('home')}
                                onSearch={() => setIsSearchOpen(true)}
                            />
                        ) : (
                            <div className={`${isWindowsPage ? 'max-w-none' : 'max-w-5xl'} mx-auto animate-fade-in`}>
                                <div className="mb-10 md:mb-12">
                                    <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tighter text-[var(--text-primary)]">
                                        {activePage.title}
                                    </h1>
                                    <p className={`text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed ${isWindowsPage ? 'max-w-none' : 'max-w-3xl'}`}>
                                        {activePage.description}
                                    </p>
                                </div>

                                <div className="space-y-12 md:space-y-16">
                                    {activePage.blocks.map((block: any, index: number) => renderBlock(block, index))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {!isNotFound && <SidebarRight headings={headings} />}
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onNavigate={handleNavigate}
            />

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[25] md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}

export default App;
