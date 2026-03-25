import { FeedEntry } from '@/lib/types';
import FeedsExplorer from '@/components/FeedsExplorer';
import fs from 'fs';
import path from 'path';

async function getFeeds(): Promise<FeedEntry[]> {
  const filePath = path.join(process.cwd(), 'public', 'seda-supported-feeds.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as FeedEntry[];
}

export default async function Home() {
  const feeds = await getFeeds();

  return <FeedsExplorer feeds={feeds} />;
}
