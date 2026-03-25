export interface FeedIdentifier {
  kind: 'symbol' | 'endpoint';
  id: string;
  quote: string;
  data_source: string;
}

export interface FeedEntry {
  feed_type: string;
  base: string;
  asset_name: string;
  identifiers: FeedIdentifier[];
  endpoints: FeedIdentifier[];
  symbols: FeedIdentifier[];
}

/** Flat row — one per identifier, matching the Airtable structure */
export interface FeedRow {
  base: string;
  asset_name: string;
  feed_type: string;
  data_source: string;
  identifier: string;
  kind: 'symbol' | 'endpoint';
  quote: string;
}
