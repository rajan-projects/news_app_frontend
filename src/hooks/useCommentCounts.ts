import { useState, useEffect } from 'react';
import client from '../config/encore';
import { NewsItem } from './useNews';

export const useCommentCounts = (newsItems: NewsItem[]) => {
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    let isSubscribed = true;

    const fetchCommentCounts = async () => {
      try {
        const counts: Record<string, number> = {};
        await Promise.all(
          newsItems.map(async (item) => {
            try {
              const response = await client.news_reaction.getCommentsByNewsIdRoute(item.id);
              if (isSubscribed) {
                counts[item.id] = response.items.length;
              }
            } catch (err) {
              console.error(`Failed to fetch comments for news ${item.id}:`, err);
            }
          })
        );
        if (isSubscribed) {
          setCommentCounts(counts);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed && err instanceof Error && err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch comment counts');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    if (newsItems.length > 0) {
      fetchCommentCounts();
    }

    return () => {
      isSubscribed = false;
      abortController.abort();
    };
  }, [newsItems]);

  return { commentCounts, loading, error };
};
