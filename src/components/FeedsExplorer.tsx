'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { FeedEntry, FeedRow } from '@/lib/types';

const FEED_TYPE_ORDER = [
  'All',
  'Crypto',
  'Equities',
  'Forex',
  'ETF',
  'Commodities',
  'Metals',
  'Crypto Redemption Rate',
  'Crypto Index',
  'Crypto NAV',
  'Crypto xStock',
];

const SOURCES = ['Nobi Labs', 'Pyth Core', 'dxFeed'];

const PAGE_SIZE = 50;

type SortCol = 'base' | 'asset_name' | 'feed_type' | 'data_source' | 'identifier' | 'kind' | 'quote';

function getTypeBadgeClass(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('crypto')) return 'feed-type-badge--crypto';
  if (t === 'equities') return 'feed-type-badge--equities';
  if (t === 'forex') return 'feed-type-badge--forex';
  if (t === 'commodities') return 'feed-type-badge--commodities';
  if (t === 'etf') return 'feed-type-badge--etf';
  if (t === 'metals') return 'feed-type-badge--metals';
  return 'feed-type-badge--default';
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/** Flatten grouped FeedEntry[] into one row per identifier */
function flattenFeeds(feeds: FeedEntry[]): FeedRow[] {
  const rows: FeedRow[] = [];
  for (const feed of feeds) {
    for (const id of feed.identifiers) {
      rows.push({
        base: feed.base,
        asset_name: feed.asset_name,
        feed_type: feed.feed_type,
        data_source: id.data_source,
        identifier: id.id,
        kind: id.kind,
        quote: id.quote,
      });
    }
  }
  return rows;
}

interface Props {
  feeds: FeedEntry[];
}

export default function FeedsExplorer({ feeds }: Props) {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [activeSources, setActiveSources] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState<SortCol>('base');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Flatten once
  const allRows = useMemo(() => flattenFeeds(feeds), [feeds]);

  // Type counts (on flat rows)
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allRows.length };
    for (const r of allRows) {
      counts[r.feed_type] = (counts[r.feed_type] || 0) + 1;
    }
    return counts;
  }, [allRows]);

  // Source counts
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of allRows) {
      counts[r.data_source] = (counts[r.data_source] || 0) + 1;
    }
    return counts;
  }, [allRows]);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = allRows;

    if (activeType !== 'All') {
      result = result.filter((r) => r.feed_type === activeType);
    }

    if (activeSources.size > 0) {
      result = result.filter((r) => activeSources.has(r.data_source));
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.base.toLowerCase().includes(q) ||
          r.asset_name.toLowerCase().includes(q) ||
          r.identifier.toLowerCase().includes(q) ||
          r.quote.toLowerCase().includes(q) ||
          r.data_source.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      const cmp = (a[sortCol] ?? '').localeCompare(b[sortCol] ?? '');
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [allRows, activeType, activeSources, search, sortCol, sortDir]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [activeType, activeSources, search]);

  const toggleSource = useCallback((source: string) => {
    setActiveSources((prev) => {
      const next = new Set(prev);
      if (next.has(source)) next.delete(source);
      else next.add(source);
      return next;
    });
  }, []);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortCol(col); setSortDir('asc'); }
  };

  const sortArrowHtml = (col: SortCol) =>
    sortCol === col ? (sortDir === 'asc' ? '&#8593;' : '&#8595;') : '&#8597;';

  const pageButtons = useMemo(() => {
    const buttons: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) buttons.push(i);
    return buttons;
  }, [page, totalPages]);

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="hero fade-up">
        <h1 className="hero__title">
          <svg className="hero__logo" viewBox="0 0 398 373" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M203.749 0C202.098 4.43118 200.39 9.8963 199.283 15.7307C196.093 32.4768 199.114 44.5703 208.29 51.6417C216.921 58.3069 241.952 69.0894 268.446 80.4997C277.096 84.2293 285.953 88.0327 294.959 92.0023C284.658 58.0669 233.583 19.2018 203.749 0Z" fill="currentColor"/>
            <path d="M151.118 31.4064C118.113 59.1751 100.662 84.119 100.662 103.561C100.662 142.223 173.409 168.847 201.424 175.844C205.739 176.915 297.963 200.456 315.788 251.654C325.095 245.968 338.061 237.789 351.008 228.797C395.966 197.557 397.429 186.682 397.467 186.221C397.467 180.276 391.8 166.945 353.879 144.974C326.071 128.874 290.758 113.66 259.61 100.237C229.419 87.2393 205.57 76.9552 194.781 68.6283C174.948 53.3038 174.104 29.8555 177.913 10.8014C169.713 16.5989 160.387 23.6149 151.118 31.4064Z" fill="currentColor"/>
            <path d="M189.153 321.002C180.522 314.337 155.51 303.554 129.016 292.144C120.366 288.414 111.509 284.611 102.503 280.623C112.804 314.558 163.879 353.423 193.713 372.625C195.364 368.194 197.072 362.729 198.179 356.913C201.369 340.167 198.348 328.073 189.172 321.002H189.153Z" fill="currentColor"/>
            <path d="M246.349 341.219C279.354 313.45 296.804 288.507 296.804 269.046C296.804 230.384 224.076 203.76 196.043 196.763C191.728 195.692 99.504 172.151 81.6785 120.953C72.3717 126.639 59.4059 134.819 46.459 143.81C1.5011 175.05 0.0375274 185.925 0 186.368C0 192.313 5.66664 205.644 43.5881 227.615C71.3959 243.715 106.709 258.928 137.857 272.351C168.048 285.349 191.897 295.633 202.704 303.96C222.538 319.285 223.382 342.733 219.573 361.787C227.773 355.99 237.098 348.974 246.368 341.182L246.349 341.219Z" fill="currentColor"/>
          </svg>
          {' '}Explore Feeds
        </h1>
        <p className="hero__subtitle">
          Explore {allRows.length.toLocaleString()} data feed identifiers across crypto, equities, forex, commodities, and more.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-bar fade-up" style={{ animationDelay: '0.06s' }}>
        {FEED_TYPE_ORDER.slice(1, 7).map((type) => (
          <div className="stat-pill" key={type}>
            <span
              className="stat-pill__dot"
              style={{
                background:
                  type === 'Crypto' ? '#10B981'
                  : type === 'Equities' ? '#a78bfa'
                  : type === 'Forex' ? '#60a5fa'
                  : type === 'Commodities' ? '#ffcc00'
                  : type === 'ETF' ? '#f97316'
                  : '#fbbf24',
              }}
            />
            <span className="stat-pill__value">{(typeCounts[type] || 0).toLocaleString()}</span>
            {type}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar fade-up" style={{ animationDelay: '0.12s' }}>
        <div className="filter-bar__search-wrap">
          <span className="filter-bar__search-icon"><SearchIcon /></span>
          <input
            className="filter-bar__search"
            type="text"
            placeholder="Search by symbol, name, identifier, or quote..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-bar__controls">
          {FEED_TYPE_ORDER.map((type) => (
            <button
              key={type}
              className={`filter-pill ${activeType === type ? 'active' : ''}`}
              onClick={() => setActiveType(type)}
            >
              {type}
              <span className="filter-pill__count">{(typeCounts[type] || 0).toLocaleString()}</span>
            </button>
          ))}
        </div>

        <div className="filter-bar__source-pills">
          {SOURCES.map((source) => (
            <button
              key={source}
              className={`source-pill ${activeSources.has(source) ? 'active' : ''}`}
              onClick={() => toggleSource(source)}
            >
              {source}
              <span className="filter-pill__count">{(sourceCounts[source] || 0).toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results info */}
      <div className="results-info fade-up" style={{ animationDelay: '0.18s' }}>
        <span className="results-info__count">
          Showing <strong>{paginated.length}</strong> of <strong>{filtered.length.toLocaleString()}</strong> feeds
          {activeType !== 'All' && <> in <strong>{activeType}</strong></>}
        </span>
      </div>

      {/* Desktop Table */}
      <div className="desktop-table fade-up" style={{ animationDelay: '0.24s' }}>
        <div className="feed-table-wrap">
          <div className="feed-table-scroll">
            <table className="feed-table feed-table--flat">
              <thead>
                <tr>
                  {([
                    ['base', 'Symbol'],
                    ['asset_name', 'Name'],
                    ['feed_type', 'Type'],
                    ['data_source', 'Source'],
                    ['identifier', 'Identifier'],
                    ['kind', 'Kind'],
                    ['quote', 'Quote'],
                  ] as [SortCol, string][]).map(([col, label]) => (
                    <th
                      key={col}
                      className={`col-${col} sortable ${sortCol === col ? 'sorted' : ''}`}
                      onClick={() => handleSort(col)}
                    >
                      {label}{' '}
                      <span className="sort-arrow" dangerouslySetInnerHTML={{ __html: sortArrowHtml(col) }} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, i) => (
                  <tr key={`${row.base}-${row.identifier}-${row.data_source}-${i}`}>
                    <td><span className="feed-base">{row.base}</span></td>
                    <td><span className="feed-name">{row.asset_name}</span></td>
                    <td>
                      <span className={`feed-type-badge ${getTypeBadgeClass(row.feed_type)}`}>
                        {row.feed_type}
                      </span>
                    </td>
                    <td><span className="feed-source-tag">{row.data_source}</span></td>
                    <td><span className="feed-identifier">{row.identifier}</span></td>
                    <td><span className="feed-kind-badge">{row.kind}</span></td>
                    <td><span className="feed-quotes">{row.quote}</span></td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <div className="empty-state__icon">&#x1F50D;</div>
                        <p className="empty-state__title">No feeds found</p>
                        <p className="empty-state__text">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards fade-up" style={{ animationDelay: '0.24s' }}>
        <div className="feed-cards">
          {paginated.map((row, i) => (
            <div key={`${row.base}-${row.identifier}-${row.data_source}-${i}`} className="feed-card">
              <div className="feed-card__header">
                <span className="feed-card__base">{row.base}</span>
                <span className={`feed-type-badge ${getTypeBadgeClass(row.feed_type)}`}>
                  {row.feed_type}
                </span>
              </div>
              <p className="feed-card__name">{row.asset_name}</p>
              <div className="feed-card__identifier">
                <span className="feed-identifier">{row.identifier}</span>
              </div>
              <div className="feed-card__meta">
                <span className="feed-source-tag">{row.data_source}</span>
                <span className="feed-kind-badge">{row.kind}</span>
                <span className="feed-quotes">{row.quote}</span>
              </div>
            </div>
          ))}
          {paginated.length === 0 && (
            <div className="empty-state">
              <div className="empty-state__icon">&#x1F50D;</div>
              <p className="empty-state__title">No feeds found</p>
              <p className="empty-state__text">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination fade-up">
          <button className="pagination__btn" disabled={page === 1} onClick={() => setPage(1)}>
            &laquo;
          </button>
          <button className="pagination__btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
            &lsaquo;
          </button>
          {pageButtons[0] > 1 && <span className="pagination__info">...</span>}
          {pageButtons.map((p) => (
            <button
              key={p}
              className={`pagination__btn ${page === p ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          {pageButtons[pageButtons.length - 1] < totalPages && <span className="pagination__info">...</span>}
          <button className="pagination__btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            &rsaquo;
          </button>
          <button className="pagination__btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}
