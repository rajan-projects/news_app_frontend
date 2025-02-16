import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNewsDetail } from '../hooks/useNews';
import { useNewsComments } from '../hooks/useComments';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { newsDetail, loading, error } = useNewsDetail(id || '');
  const { comments, loading: commentsLoading, error: commentsError } = useNewsComments(id || '');

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading article...</div>
      </div>
    );
  }

  if (error || !newsDetail) {
    return (
      <div className="container">
        <div className="news-detail-error">
          <h2>{error || 'News article not found'}</h2>
          <button onClick={() => navigate('/news')} className="back-button">
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="news-detail">
        <button onClick={() => navigate('/news')} className="back-button">
          ← Back to News
        </button>
        
        <article>
          {newsDetail.content.image && (
            <img 
              src={newsDetail.content.image} 
              alt={newsDetail.title} 
              className="news-detail-image" 
            />
          )}
          <header>
            <div className="categories">
              {newsDetail.content.categories.map((category, index) => (
                <span key={index} className="category">{category}</span>
              ))}
            </div>
            <h1>{newsDetail.title}</h1>
            <div className="meta">
              <span>Created: {new Date(newsDetail.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              {newsDetail.updatedAt !== newsDetail.createdAt && (
                <>
                  <span className="meta-separator">•</span>
                  <span>Updated: {new Date(newsDetail.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </>
              )}
            </div>
          </header>

          <div className="content">
            <p>{newsDetail.content.shortContent}</p>
            {newsDetail.content.links.length > 0 && (
              <div className="related-links">
                <h3>Related Links</h3>
                <ul>
                  {newsDetail.content.links.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>

        <section className="comments-section">
          <h3>Comments</h3>
          {commentsLoading ? (
            <div className="loading">Loading comments...</div>
          ) : commentsError ? (
            <div className="error">{commentsError}</div>
          ) : comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span className="user-id">User: {comment.user_id}</span>
                    {comment.createdAt && (
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                  <p className="comment-content">{comment.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default NewsDetail;
