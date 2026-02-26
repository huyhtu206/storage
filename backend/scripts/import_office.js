const fs = require('fs');
const path = require('path');

const csvFiles = [
    { path: path.join(__dirname, '..', '..', 'Office C2R.csv'), type: 'C2R' },
    { path: path.join(__dirname, '..', '..', 'Office For Mac.csv'), type: 'MAC' },
    { path: path.join(__dirname, '..', '..', 'Office MSI VL.csv'), type: 'MSI' }
];

const sqlOutputPath = path.join(__dirname, 'import_office.sql');
const sqlStatements = [];

sqlStatements.push('DELETE FROM office_products;');

csvFiles.forEach(fileInfo => {
    if (!fs.existsSync(fileInfo.path)) {
        console.warn(`File not found: ${fileInfo.path}`);
        return;
    }

    const content = fs.readFileSync(fileInfo.path, 'utf8');
    const lines = content.split('\n');

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Simple CSV parser
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < 5) continue;

        const category = matches[0].replace(/"/g, '');
        const product_id = matches[1].replace(/"/g, '');
        const apps = matches[2].replace(/"/g, '');
        const label = matches[3].replace(/"/g, '');
        const url = matches[4].replace(/"/g, '');

        let platform = 'x64';
        let language = 'en-us';
        let version_tag = 'O16GA';

        try {
            if (url.includes('?')) {
                const urlObj = new URL(url);
                platform = urlObj.searchParams.get('platform') || platform;
                language = urlObj.searchParams.get('language') || language;
                version_tag = urlObj.searchParams.get('version') || version_tag;
            } else {
                // Heuristics for non-standard URLs (like Buzzheavier or Archive)
                if (fileInfo.type === 'MAC') {
                    language = 'macos';
                    platform = 'universal';
                    version_tag = product_id;
                } else if (fileInfo.type === 'MSI') {
                    language = product_id; // For MSI, product_id is often the language in the CSV structure viewed
                    platform = apps;      // apps is x64/x32 in MSI CSV
                    version_tag = 'MSI-VL';
                }
            }
        } catch (e) { }

        const escape = (str) => str ? str.replace(/'/g, "''") : '';

        sqlStatements.push(`INSERT INTO office_products (category, product_id, apps, label, language, version_tag, platform, url) VALUES ('${escape(category)}', '${escape(product_id)}', '${escape(apps)}', '${escape(label)}', '${escape(language)}', '${escape(version_tag)}', '${escape(platform)}', '${escape(url)}');`);
    }
});

fs.writeFileSync(sqlOutputPath, sqlStatements.join('\n'));
console.log(`Generated ${sqlStatements.length} SQL statements in ${sqlOutputPath}`);
