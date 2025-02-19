import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNewsList } from '../hooks/useNews';
import { useCommentCounts } from '../hooks/useCommentCounts';
import { useReactionCounts } from '../hooks/useReactionCounts';
import client from '../config/encore';
import './News.css';

interface ReactionList {
  id: string;
  title: string;
  is_active: boolean;
}

const News: React.FC = () => {
  const { news, loading: newsLoading, error: newsError } = useNewsList();
  const { commentCounts, loading: commentsLoading } = useCommentCounts(news);
  const { reactionCounts, loading: reactionsLoading } = useReactionCounts(news);
  const [reactionLists, setReactionLists] = useState<ReactionList[]>([]);

  useEffect(() => {
    const fetchReactionLists = async () => {
      try {
        const response = await client.news_reaction.getReactionListsRoute();
        setReactionLists(response.items);
      } catch (err) {
        console.error('Failed to load reaction types:', err);
      }
    };
    fetchReactionLists();
  }, []);

  if (newsLoading) {
    return (
      <div className="container">
        <div className="loading">Loading news...</div>
      </div>
    );
  }

  if (newsError) {
    return (
      <div className="container">
        <div className="error">{newsError}</div>
      </div>
    );
  }

  const loading = newsLoading || commentsLoading || reactionsLoading;

  return (
    <div className="container">
      <h1>Latest News</h1>
      <div className={`news-grid ${loading ? 'loading-overlay' : ''}`}>
        {news.map((item) => (
          <Link to={`/news/${item.id}`} key={item.id} className="news-item-link">
            <div className="news-item">
              {item.content.image && (
                <img src={item.content.image} alt={item.title} className="news-image" />
              )}
              <h3>{item.title}</h3>
              <div className="news-date">
                {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <p>{item.content.shortContent.length > 100 
                 ? `${item.content.shortContent.substring(0, 100)}...` 
                 : item.content.shortContent}</p>
              <div className="news-meta">
                <div className="categories">
                  {item.content.categories.map((category, index) => (
                    <span key={index} className="category">{category}</span>
                  ))}
                </div>
                <div className="interaction-counts">
                  <span className="comments-count">💬 {commentCounts[item.id] || 0}</span>
                  {reactionLists.map(reaction => (
                    <span key={reaction.id} className="reaction-count" title={reaction.title}>
                      {reaction.title} {reactionCounts[item.id]?.[reaction.id] || 0}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default News;
