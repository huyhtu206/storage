const fs = require('fs');
const path = require('path');

const constantsPath = path.join(__dirname, '..', '..', 'frontend', 'constants.ts');
const sqlOutputPath = path.join(__dirname, 'import_windows.sql');

if (!fs.existsSync(constantsPath)) {
    console.error(`Constants file not found at ${constantsPath}`);
    process.exit(1);
}

const content = fs.readFileSync(constantsPath, 'utf8');
const sqlStatements = [];

// Regex to find isoList entries
// Example: { language: 'Arabic', arch: 'x64', version: '25H2', sha256: 'c975b6ac', filename: 'ar-sa_windows_11_consumer_editions_version_25h2_updated_feb_2026_x64_dvd_c975b6ac.iso', link: '#' }
const isoRegex = /\{\s*language:\s*'([^']+)',\s*arch:\s*'([^']+)',\s*version:\s*'([^']+)',\s*sha256:\s*'([^']*)',\s*filename:\s*'([^']+)',\s*link:\s*'([^']+)'\s*\}/g;

let match;
let count = 0;

const escape = (str) => str ? str.replace(/'/g, "''") : '';

while ((match = isoRegex.exec(content)) !== null) {
    const [_, language, arch, version, sha256, filename, link] = match;

    // We only import if filename is present (Windows ISOs usually have '#' as link initially)
    if (filename && filename.endsWith('.iso')) {
        sqlStatements.push(`INSERT INTO products (category, product_id, label, language, version, platform, filename) VALUES ('WINDOWS', 'windows-${version.toLowerCase()}', 'Windows ISO', '${escape(language)}', '${escape(version)}', '${escape(arch)}', '${escape(filename)}');`);
        count++;
    }
}

fs.writeFileSync(sqlOutputPath, sqlStatements.join('\n'));
console.log(`Generated ${count} SQL statements for Windows ISOs in ${sqlOutputPath}`);
