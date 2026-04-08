/**
 * Converts the master CSV into seda-supported-feeds.json.
 * Source of truth: SEDA_All_Available_Assets APRIL 2026 - All Available Assets.csv
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(
  process.env.HOME,
  'Downloads',
  'SEDA_All_Available_Assets APRIL 2026 - All Available Assets.csv',
);

const OUTPUT = path.join(__dirname, '..', 'public', 'seda-supported-feeds.json');

// Proper CSV parser handling quoted fields with commas
function parseCSV(text) {
  const rows = [];
  let i = 0;
  while (i < text.length) {
    const row = [];
    while (i < text.length && text[i] !== '\n' && text[i] !== '\r') {
      if (text[i] === '"') {
        // Quoted field
        i++; // skip opening quote
        let field = '';
        while (i < text.length) {
          if (text[i] === '"') {
            if (i + 1 < text.length && text[i + 1] === '"') {
              field += '"';
              i += 2;
            } else {
              i++; // skip closing quote
              break;
            }
          } else {
            field += text[i];
            i++;
          }
        }
        row.push(field);
        if (i < text.length && text[i] === ',') i++; // skip comma
      } else {
        // Unquoted field
        let field = '';
        while (i < text.length && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
          field += text[i];
          i++;
        }
        row.push(field);
        if (i < text.length && text[i] === ',') i++;
      }
    }
    // Skip line endings
    while (i < text.length && (text[i] === '\n' || text[i] === '\r')) i++;
    if (row.length > 0) rows.push(row);
  }
  return rows;
}

function normalizeType(t) {
  const map = {
    'Carbon allowances Bid Ask': 'Commodity',
    'Money Market Fund': 'Fixed Income',
    'Institutional Funds': 'Fixed Income',
    'Private Credit Fund': 'Fixed Income',
    'U.S. Treasuries': 'Fixed Income',
    'US Treasuries': 'Fixed Income',
    'Metal': 'Metals',
    'NAV': 'Crypto NAV',
    'Reinsurance': 'Other',
    'Tokenized Asset': 'Tokenized',
    'Tokenized Fund': 'Tokenized',
    'Tokenized CLO': 'Tokenized',
    'Tokenized Debt': 'Tokenized',
    'Tokenized Treasuries': 'Tokenized',
    'Tokenized Treasury Fund': 'Tokenized',
    'custom': 'Other',
    'deprecating': 'Other',
    'high': 'Other',
    'medium': 'Other',
  };
  return map[t] || t;
}

// ---- Main ----

console.log('Reading CSV...');
const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
const rows = parseCSV(csvText);
console.log(`Parsed ${rows.length} rows (including header)`);
console.log('Header:', JSON.stringify(rows[0]));

// Columns: Asset, Name, Asset Type, Nobi, Blocksize, dxFeed, Pyth, Chainlink, # Providers
const feeds = [];
const typeCounts = {};
const sourceCounts = {};

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (r.length < 9) continue;

  const base = r[0].trim();
  const name = r[1].trim();
  const rawType = r[2].trim();
  const nobi = r[3].trim() === 'YES';
  const blocksize = r[4].trim() === 'YES';
  const dxfeed = r[5].trim() === 'YES';
  const pyth = r[6].trim() === 'YES';
  const chainlink = r[7].trim() === 'YES';

  if (!base) continue;
  // Skip numeric-only entries (e.g. "000005", "1305") — not real assets
  if (/^\d+$/.test(base)) continue;

  const feedType = normalizeType(rawType);
  typeCounts[feedType] = (typeCounts[feedType] || 0) + 1;

  // Build identifiers — one per provider that supports this asset
  const identifiers = [];

  if (nobi) {
    identifiers.push({ kind: 'symbol', id: `${base}`, quote: 'USD', data_source: 'Nobi Labs' });
    sourceCounts['Nobi Labs'] = (sourceCounts['Nobi Labs'] || 0) + 1;
  }
  if (blocksize) {
    identifiers.push({ kind: 'endpoint', id: `${base}`, quote: 'USD', data_source: 'Blocksize' });
    sourceCounts['Blocksize'] = (sourceCounts['Blocksize'] || 0) + 1;
  }
  if (dxfeed) {
    identifiers.push({ kind: 'symbol', id: `${base}`, quote: 'USD', data_source: 'dxFeed' });
    sourceCounts['dxFeed'] = (sourceCounts['dxFeed'] || 0) + 1;
  }
  if (pyth) {
    identifiers.push({ kind: 'symbol', id: `${base}`, quote: 'USD', data_source: 'Pyth' });
    sourceCounts['Pyth'] = (sourceCounts['Pyth'] || 0) + 1;
  }
  if (chainlink) {
    identifiers.push({ kind: 'endpoint', id: `${base}`, quote: 'USD', data_source: 'Chainlink' });
    sourceCounts['Chainlink'] = (sourceCounts['Chainlink'] || 0) + 1;
  }

  // If no provider marked YES, still include with a placeholder
  if (identifiers.length === 0) {
    identifiers.push({ kind: 'symbol', id: base, quote: 'USD', data_source: 'Unknown' });
    sourceCounts['Unknown'] = (sourceCounts['Unknown'] || 0) + 1;
  }

  const endpoints = identifiers.filter(id => id.kind === 'endpoint');
  const symbols = identifiers.filter(id => id.kind === 'symbol');

  feeds.push({
    feed_type: feedType,
    base,
    asset_name: name || base,
    identifiers,
    endpoints,
    symbols,
  });
}

console.log(`\nResults:`);
console.log(`  Total feeds: ${feeds.length}`);
console.log(`\nFeed types:`, JSON.stringify(typeCounts, null, 2));
console.log(`\nSource counts:`, JSON.stringify(sourceCounts, null, 2));

fs.writeFileSync(OUTPUT, JSON.stringify(feeds, null, 2));
console.log(`\nWritten to ${OUTPUT}`);
