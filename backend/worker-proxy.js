/**
 * Cloudflare Worker: HuynhTu API & Download Proxy (Stable JS Version)
 * Merged version supporting both dynamic Office/Drivers and legacy static routes.
 */

const NAVIGATION_DATA = [
    {
        id: "folder-1",
        title: "Windows",
        type: "folder",
        children: [
            { id: "windows-11", title: "Windows 11", type: "page" },
            { id: "windows-10", title: "Windows 10", type: "page" },
            { id: "windows-ltsc", title: "Windows LTSC", type: "page" },
            { id: "windows-server", title: "Windows Server", type: "page" },
        ],
    },
    {
        id: "folder-2",
        title: "Office",
        type: "folder",
        children: [
            { id: "office-c2r", title: "Office C2R", type: "page" },
            { id: "office-msi", title: "Office MSI VL", type: "page" },
            { id: "office-mac", title: "Office cho Mac", type: "page" },
        ],
    },
    {
        id: "sponsor",
        title: "Ủng hộ / Tài trợ",
        type: "page",
    },
];

const SOFTWARE_DATA = [
    {
        id: "vlc",
        title: "VLC Media Player",
        version: "3.0.21",
        description: "Trình phát đa phương tiện mạnh mẽ, hỗ trợ mọi định dạng video/audio.",
        category: "Multimedia",
        platforms: ["windows", "mac", "linux"],
        link: "https://www.videolan.org/vlc/",
        size: "42 MB",
    },
    {
        id: "vscode",
        title: "Visual Studio Code",
        version: "1.87",
        description: "Trình soạn thảo code mạnh mẽ từ Microsoft với hàng nghìn extension.",
        category: "Development",
        platforms: ["windows", "mac", "linux"],
        link: "https://code.visualstudio.com/",
        size: "90 MB",
    },
    {
        id: "7zip",
        title: "7-Zip",
        version: "24.06",
        description: "Công cụ nén/giải nén file miễn phí, hỗ trợ 7z, ZIP, RAR và nhiều định dạng.",
        category: "Utilities",
        platforms: ["windows"],
        link: "https://www.7-zip.org/",
        size: "1.5 MB",
    },
    {
        id: "firefox",
        title: "Mozilla Firefox",
        version: "124.0",
        description: "Trình duyệt web bảo mật cao, mã nguồn mở từ Mozilla Foundation.",
        category: "Web Browsers",
        platforms: ["windows", "mac", "linux"],
        link: "https://www.mozilla.org/firefox/",
        size: "55 MB",
    },
];

const NEWS_DATA = [
    {
        id: "win11-24h2",
        title: "Windows 11 24H2 phát hành chính thức",
        date: "2024-10-15",
        summary: "Microsoft chính thức phát hành Windows 11 phiên bản 24H2 với nhiều cải tiến hiệu suất.",
        category: "Windows",
    },
    {
        id: "office-2024-release",
        title: "Microsoft Office 2024 ra mắt",
        date: "2024-10-03",
        summary: "Microsoft phát hành Office 2024 với nhiều tính năng AI mới nhúng trong Word, Excel và PowerPoint.",
        category: "Office",
    },
    {
        id: "macos-sequoia",
        title: "macOS Sequoia chính thức ra mắt",
        date: "2024-09-16",
        summary: "Apple phát hành macOS Sequoia với iPhone Mirroring và cải tiến Stage Manager.",
        category: "MacOS",
    },
];

const SECRET_TOKEN = "ht-secure-v1"; // Internal secret for signing

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // CORS Headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Signature",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // --- SECURITY LAYER: Anti-Bot & Domain Protection ---
        if (path.startsWith("/api/office/") || path.startsWith("/api/products/") || path.startsWith("/token=")) {
            const referer = request.headers.get("Referer");
            const origin = request.headers.get("Origin");
            const isSelf = (referer && referer.includes("huynhtu.com")) ||
                (origin && origin.includes("huynhtu.com")) ||
                (url.hostname === "localhost");

            if (!isSelf) {
                return new Response("Unauthorized access.", { status: 403 });
            }

            // Verify Signature for dynamic API calls
            if (path.startsWith("/api/office/") || path.startsWith("/api/products/")) {
                const signature = request.headers.get("X-Signature");
                const timestamp = request.headers.get("X-Timestamp");
                if (!signature || !timestamp || !await verifySignature(signature, timestamp)) {
                    return new Response("Invalid request signature.", { status: 401 });
                }
            }
        }

        const jsonResp = (data, status = 200) => new Response(JSON.stringify(data), {
            status,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

        // --- REFACTORED PRODUCT & TOKEN ROUTES ---
        if (path === "/api/products/list") return await handleProductList(request, env, corsHeaders);
        if (path === "/api/products/languages") return await handleProductLanguages(request, env, corsHeaders);
        if (path === "/api/products/get-token") return await handleProductGetToken(request, env, corsHeaders);
        if (path.startsWith("/token=")) return await handleTokenResolve(path, env, request);

        // Keep legacy office routes for compatibility during transition
        if (path.startsWith("/api/office/")) {
            if (path === "/api/office/list") return await handleProductList(request, env, corsHeaders, "OFFICE");
            if (path === "/api/office/get-token") return await handleProductGetToken(request, env, corsHeaders);
        }

        // --- DRIVER ROUTES ---
        if (path === "/api/download/driver") return await handleDriverRequest(request, env);
        if (path.startsWith("/api/proxy")) {
            const urlParam = url.searchParams.get('url');
            if (urlParam) return await proxyRequest(urlParam, request);
        }

        // --- LEGACY STATIC ROUTES (Ported from Rust) ---
        if (path === "/api/navigation") return jsonResp(NAVIGATION_DATA);
        if (path === "/api/software") return jsonResp(SOFTWARE_DATA);
        if (path === "/api/news") return jsonResp(NEWS_DATA);

        // Short Link Resolver
        const code = path.slice(1);
        if (code && code.length > 2 && !path.startsWith("/api/")) {
            const targetUrl = await env.LINKS.get(code);
            if (targetUrl) return await proxyRequest(targetUrl, request);
        }

        return new Response("Route not found.", { status: 404, headers: corsHeaders });
    },
};

// --- HANDLER FUNCTIONS ---

async function handleProductList(request, env, corsHeaders, forceCategory) {
    const { searchParams } = new URL(request.url);
    const category = forceCategory || searchParams.get("category");
    const lang = searchParams.get("lang");
    const q = searchParams.get("q");
    const platform = searchParams.get("platform");

    let query = "SELECT * FROM products WHERE 1=1";
    let params = [];

    if (category) {
        query += " AND category = ?";
        params.push(category);
    }
    if (lang) {
        query += " AND language = ?";
        params.push(lang);
    }
    if (platform) {
        query += " AND platform = ?";
        params.push(platform);
    }
    if (q) {
        query += " AND (product_id LIKE ? OR apps LIKE ? OR label LIKE ? OR filename LIKE ?)";
        params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }

    query += " LIMIT 100";

    try {
        const { results } = await env.DB.prepare(query).bind(...params).all();
        return new Response(JSON.stringify(results), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

async function handleProductLanguages(request, env, corsHeaders) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    let query = "SELECT DISTINCT language FROM products";
    let params = [];
    if (category) {
        query += " WHERE category = ?";
        params.push(category);
    }
    query += " ORDER BY language ASC";

    try {
        const { results } = await env.DB.prepare(query).bind(...params).all();
        return new Response(JSON.stringify(results.map(r => r.language)), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

async function handleProductGetToken(request, env, corsHeaders) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return new Response("Missing product id", { status: 400, headers: corsHeaders });

    try {
        const product = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
        if (!product) return new Response("Product not found", { status: 404, headers: corsHeaders });

        let targetUrl = product.url;
        // Apply Windows ISDN rule if URL is missing and it's Windows
        if (!targetUrl && product.category === "WINDOWS" && product.filename) {
            targetUrl = `https://archive.isdn.network/windows/${product.filename}?`;
        }

        if (!targetUrl) return new Response("Download URL not available", { status: 404, headers: corsHeaders });

        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const expiresAt = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

        await env.DB.prepare("INSERT INTO download_tokens (token, real_url, expires_at) VALUES (?, ?, ?)")
            .bind(token, targetUrl, expiresAt)
            .run();

        return new Response(JSON.stringify({ token, expiresAt }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
}

async function handleTokenResolve(path, env, request) {
    const token = decodeURIComponent(path.replace("/token=", ""));
    const now = Math.floor(Date.now() / 1000);
    try {
        const record = await env.DB.prepare("SELECT real_url FROM download_tokens WHERE token = ? AND expires_at > ?")
            .bind(token, now)
            .first();
        if (!record) return new Response("Token expired or invalid", { status: 403 });
        return await proxyRequest(record.real_url, request);
    } catch (e) {
        return new Response(`Error: ${e.message}`, { status: 500 });
    }
}

async function handleDriverRequest(request, env) {
    const url = new URL(request.url);
    const vendor = url.searchParams.get("vendor")?.toUpperCase();
    const version = url.searchParams.get("version") || "latest";
    const model = url.searchParams.get("model") || "X541UA";
    const osid = url.searchParams.get("osid") || "45";
    const check = url.searchParams.has("check");
    const hide = url.searchParams.has("hide");

    if (!vendor) return new Response("Missing vendor", { status: 400 });

    let downloadUrl = "";
    switch (vendor) {
        case "NVIDIA": downloadUrl = `https://us.download.nvidia.com/Windows/${version}/${version}-desktop-win10-win11-64bit-international-dch-whql.exe`; break;
        case "AMD": downloadUrl = `https://drivers.amd.com/drivers/whql-amd-software-adrenalin-edition-${version}-win10-win11-oct2024.exe`; break;
        case "INTEL_GFX": downloadUrl = `https://downloadmirror.intel.com/823385/gfx_win_101.${version}.exe`; break;
        case "INTEL_WIFI": downloadUrl = `https://downloadmirror.intel.com/820549/WiFi-${version}-Driver64-Win10-Win11.exe`; break;
        case "ASUS":
            const asusApi = `https://www.asus.com/support/api/product.asmx/GetPDDrivers?cpu=&osid=${osid}&website=vn&model=${model}`;
            try { const resp = await fetch(asusApi); const json = await resp.json(); downloadUrl = json.Result?.Obj?.[0]?.Files?.[0]?.DownloadUrl?.Global || asusApi; } catch (e) { downloadUrl = asusApi; }
            break;
        case "LENOVO":
            const lenovoUrl = `https://pcsupport.lenovo.com/vn/vi/products/${model}/downloads/driver-list`;
            try {
                const resp = await fetch(lenovoUrl); const text = await resp.text();
                const patterns = ["https://download.lenovo.com/pccbbs/", "https://download.lenovo.com/consumer/", "https://download.lenovo.com/km/media/attachment/"];
                for (const p of patterns) {
                    const start = text.indexOf(p);
                    if (start !== -1) { const rest = text.substring(start); const end = rest.indexOf(".exe"); if (end !== -1) { downloadUrl = rest.substring(0, end + 4); break; } }
                }
                if (!downloadUrl) downloadUrl = lenovoUrl;
            } catch (e) { downloadUrl = lenovoUrl; }
            break;
        case "HP_UPD": downloadUrl = `https://ftp.hp.com/pub/softlib/software13/upd-pcl6-x64-${version}.exe`; break;
        case "REALTEK": downloadUrl = `https://cdn.realtek.com/pc/audio/High_Definition_Audio_LinK_${version}.zip`; break;
        default: return new Response("Vendor not supported", { status: 404 });
    }

    if (check) {
        const resp = await fetch(downloadUrl, { method: "HEAD" });
        return new Response(JSON.stringify({ vendor, version, url: downloadUrl, exists: resp.status === 200, status: resp.status }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }

    if (hide) {
        const code = Math.random().toString(36).substring(2, 10);
        await env.LINKS.put(code, downloadUrl);
        return Response.redirect(`${url.origin}/${code}`, 302);
    }

    return await proxyRequest(downloadUrl, request);
}

async function verifySignature(signature, timestamp) {
    const now = Math.floor(Date.now() / 1000);
    const ts = parseInt(timestamp);

    // Signature valid for 60 seconds
    if (isNaN(ts) || Math.abs(now - ts) > 60) return false;

    const msg = `${SECRET_TOKEN}:${timestamp}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(msg);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expected = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    return signature === expected;
}

async function proxyRequest(targetUrl, originalRequest) {
    try {
        // Optimized Streaming Fetch
        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                'User-Agent': originalRequest.headers.get('User-Agent') || 'Mozilla/5.0 Cloudflare-Worker',
                'Range': originalRequest.headers.get('Range') || ''
            },
            redirect: 'follow',
        });

        // Hide Origin Identity & Clean Tracking Headers
        const newHeaders = new Headers();

        // Pass essential headers
        const essentialHeaders = [
            'Content-Type',
            'Content-Length',
            'Content-Range',
            'Accept-Ranges',
            'Last-Modified',
            'ETag',
            'Cache-Control'
        ];

        essentialHeaders.forEach(h => {
            const val = response.headers.get(h);
            if (val) newHeaders.set(h, val);
        });

        const filename = targetUrl.split('/').pop().split('?')[0] || 'download_file';
        newHeaders.set('Content-Disposition', `attachment; filename="${filename}"`);
        newHeaders.set('Access-Control-Allow-Origin', '*');

        // Explicitly hide identity
        newHeaders.set('Server', 'HuynhTu-Secure-CDN');
        newHeaders.delete('x-amz-request-id');
        newHeaders.delete('x-amz-id-2');
        newHeaders.delete('cf-ray');
        newHeaders.delete('cf-cache-status');

        // Streaming response (minimal CPU/Memory usage)
        return new Response(response.body, {
            status: response.status,
            headers: newHeaders
        });
    } catch (err) {
        return new Response("Proxy Error: Unable to fetch file.", { status: 502 });
    }
}
