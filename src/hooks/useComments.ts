import { useState, useEffect } from 'react';
import client from '../config/encore';

export interface Comment {
  id: string;
  user_id: string;
  news_id: string;
  comment: string;
  createdAt?: string;
}

export const useNewsComments = (newsId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    let isSubscribed = true;

    const fetchComments = async () => {
      try {
        const response = await client.news_reaction.getCommentsByNewsIdRoute(newsId);
        if (isSubscribed) {
          setComments(response.items);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed && err instanceof Error && err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch comments');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      isSubscribed = false;
      abortController.abort();
    };
  }, [newsId]);

  return { comments, loading, error };
};
