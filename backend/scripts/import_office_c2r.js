const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', '..', 'Office C2R.csv');
const sqlOutputPath = path.join(__dirname, 'import_office.sql');

const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

const sqlStatements = [];
sqlStatements.push('DELETE FROM office_products;');

// Skip header
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser for this specific format (handles quoted strings)
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (!matches || matches.length < 5) continue;

    const category = matches[0].replace(/"/g, '');
    const product_id = matches[1].replace(/"/g, '');
    const apps = matches[2].replace(/"/g, '');
    const label = matches[3].replace(/"/g, '');
    const url = matches[4].replace(/"/g, '');

    // Extract metadata from URL
    const urlObj = new URL(url);
    const platform = urlObj.searchParams.get('platform') || 'x64';
    const language = urlObj.searchParams.get('language') || 'en-us';
    const version_tag = urlObj.searchParams.get('version') || 'O16GA';

    // Escape single quotes for SQL
    const escape = (str) => str ? str.replace(/'/g, "''") : '';

    sqlStatements.push(`INSERT INTO office_products (category, product_id, apps, label, language, version_tag, platform, url) VALUES ('${escape(category)}', '${escape(product_id)}', '${escape(apps)}', '${escape(label)}', '${escape(language)}', '${escape(version_tag)}', '${escape(platform)}', '${escape(url)}');`);
}

fs.writeFileSync(sqlOutputPath, sqlStatements.join('\n'));
console.log(`Generated ${sqlStatements.length} SQL statements in ${sqlOutputPath}`);
