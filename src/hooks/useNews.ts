import { useState, useEffect } from 'react';
import client from '../config/encore';
import { utils } from '../lib/client';

export interface NewsItem {
  id: string;
  title: string;
  content: utils.iNewsContent;
  createdAt: string;
  updatedAt: string;
  is_active: boolean;
}

export const useNewsList = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await client.news.getActiveNewsListRoute();
        setNews(response.items);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading, error };
};

export const useNewsDetail = (id: string) => {
  const [newsDetail, setNewsDetail] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await client.news.getNewsByIdRoute(id);
        setNewsDetail(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news detail');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    }
  }, [id]);

  return { newsDetail, loading, error };
};
