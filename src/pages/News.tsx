import React from 'react';
import { Link } from 'react-router-dom';
import { useNewsList } from '../hooks/useNews';
import { useCommentCounts } from '../hooks/useCommentCounts';

const News: React.FC = () => {
  const { news, loading: newsLoading, error: newsError } = useNewsList();
  const { commentCounts, loading: commentsLoading } = useCommentCounts(news);

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

  const loading = newsLoading || commentsLoading;

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
                <div className="comments-count">
                  <span>💬 {commentCounts[item.id] || 0}</span>
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
