import { useState, useEffect, useCallback } from 'react';
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

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await client.news_reaction.getCommentsByNewsIdRoute(newsId);
      setComments(response.items);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to fetch comments');
      }
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, refetch: fetchComments };
};
