import {
    SERVICES_LIST, SOFTWARE_DATABASE, GHOST_OS_DATABASE,
    WIN11_EDITIONS, WIN10_EDITIONS, WIN81_EDITIONS, WIN7_EDITIONS,
    WINVISTA_EDITIONS, WINXP_EDITIONS, WINSERVER_EDITIONS, WINARM_EDITIONS,
    OFFICE_C2R_DATA, OFFICE_MSI_KEYS_DATA, OFFICE_MAC_APP_DATA
} from '../constants';
import { WindowsEdition, OfficeDownloaderData, DownloadItem, GhostItem, ServiceItem } from '../types';

const PROXY_URL = (import.meta as any).env?.VITE_PROXY_URL;
const BASE_URL: string = (import.meta as any).env?.VITE_API_URL || PROXY_URL || '';

const SECRET_TOKEN = "ht-secure-v1";

async function signRequest(timestamp: string): Promise<string> {
    const msg = `${SECRET_TOKEN}:${timestamp}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(msg);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function fetchJson<T>(path: string): Promise<T | null> {
    const fetchUrl = (import.meta as any).env?.VITE_API_URL;
    if (!fetchUrl) return null;
    try {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const signature = await signRequest(timestamp);

        const res = await fetch(`${fetchUrl}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature,
                'X-Timestamp': timestamp
            },
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json() as T;
    } catch (err) {
        console.warn(`[API] Failed to fetch ${path}:`, err);
        return null;
    }
}

// ------- Public API functions expected by App.tsx -------

export async function getWindowsMenu(): Promise<any[]> {
    const remote = await fetchJson<any[]>('/api/windows-menu');
    if (remote) return remote;

    // Fallback Local Data
    return [
        { id: 'win-11', title: 'Windows 11', editions: WIN11_EDITIONS },
        { id: 'win-10', title: 'Windows 10', editions: WIN10_EDITIONS },
        { id: 'win-81', title: 'Windows 8.1 / 8', editions: WIN81_EDITIONS },
        { id: 'win-7', title: 'Windows 7', editions: WIN7_EDITIONS },
        { id: 'win-vista', title: 'Windows Vista', editions: WINVISTA_EDITIONS },
        { id: 'win-xp', title: 'Windows XP', editions: WINXP_EDITIONS },
        { id: 'win-server', title: 'Windows Server', editions: WINSERVER_EDITIONS },
        { id: 'win-arm', title: 'Windows ARM64', editions: WINARM_EDITIONS },
    ];
}

export async function getOfficeC2RVersions(): Promise<any[]> {
    const remote = await fetchJson<any[]>('/api/office-c2r');
    if (remote) return remote;
    // We can just return the local categories from OFFICE_C2R_DATA
    return OFFICE_C2R_DATA.categories;
}

export async function getSoftware(): Promise<DownloadItem[]> {
    const remote = await fetchJson<DownloadItem[]>('/api/software');
    if (remote) return remote;
    return SOFTWARE_DATABASE;
}

export async function getGhost(): Promise<GhostItem[]> {
    const remote = await fetchJson<GhostItem[]>('/api/ghost');
    if (remote) return remote;
    return GHOST_OS_DATABASE;
}

export async function getNews(): Promise<any[]> {
    const remote = await fetchJson<any[]>('/api/news');
    if (remote) return remote;
    // Local dummy fallback
    return [];
}

export async function getServices(): Promise<ServiceItem[]> {
    const remote = await fetchJson<ServiceItem[]>('/api/services');
    if (remote) return remote;
    return SERVICES_LIST;
}

// Toolings like getResolveUrl
export async function searchCatalog(query: string) {
    return fetchJson<any[]>(`/api/catalog/search?q=${encodeURIComponent(query)}`);
}

export async function getCatalogDownload(updateId: string) {
    return fetchJson<string[]>(`/api/catalog/download?id=${updateId}&hide=true`);
}

export async function checkDriverVersion(vendor: string, version: string) {
    return fetchJson<any>(`/api/download/driver?vendor=${vendor}&version=${version}&check=true`);
}

export function getResolveUrl(category: string, id?: string, name?: string, language?: string) {
    const params = new URLSearchParams();
    params.append('category', category);
    if (id) params.append('id', id);
    if (name) params.append('name', name);
    if (language) params.append('language', language);
    params.append('hide', 'true');

    const domain = BASE_URL;
    return `${domain}/api/download/resolve?${params.toString()}`;
}

export function getDriverUrl(vendor: string, version: string, model?: string, osid?: string) {
    const domain = BASE_URL;
    const params = new URLSearchParams();
    params.append('vendor', vendor);
    params.append('version', version);
    if (model) params.append('model', model);
    if (osid) params.append('osid', osid);
    params.append('hide', 'true');
    return `${domain}/api/download/driver?${params.toString()}`;
}

/**
 * Fetches a 24h token for any product (Office/Windows) and returns the obfuscated link
 */
export async function getProductToken(category: string, identifier: string, platform?: string, lang?: string): Promise<string> {
    const domain = BASE_URL;
    try {
        // Build search query
        let searchPath = `/api/products/list?category=${category}&q=${encodeURIComponent(identifier)}`;
        if (platform) searchPath += `&platform=${platform}`;
        if (lang) searchPath += `&lang=${lang}`;

        const products = await fetchJson<any[]>(searchPath);
        const product = products?.[0]; // Get the first match

        if (!product?.id) {
            // Fallback for Office if D1 lookup fails
            if (category === 'OFFICE' && platform && lang) {
                return `https://c2rsetup.officeapps.live.com/c2r/download.aspx?ProductreleaseID=${identifier}&platform=${platform}&language=${lang}&version=O16GA`;
            }
            // Fallback for Windows if D1 lookup fails (using the provided ISDN rule)
            if (category === 'WINDOWS') {
                return `https://archive.isdn.network/windows/${identifier}?`;
            }
            return "";
        }

        // Get token from backend
        const tokenResp = await fetchJson<{ token: string }>(`/api/products/get-token?id=${product.id}`);
        if (tokenResp?.token) {
            return `${domain}/token=${encodeURIComponent(tokenResp.token)}`;
        }
    } catch (e) {
        console.error("[API] Token fetch error:", e);
    }
    return "";
}

export const api = {
    getWindowsMenu,
    getOfficeC2RVersions,
    getSoftware,
    getGhost,
    getNews,
    getServices,
    getResolveUrl,
    getDriverUrl,
    getProductToken
};

export default api;
