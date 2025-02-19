import React, { useEffect, useState } from 'react';
import client from '../config/encore';
import { getAuthToken, getUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import './ReactionForm.css';
import { utils } from '../lib/client';

interface ReactionFormProps {
  newsId: string;
  onReactionChange: () => void;
}

type ReactionList = utils.iReactionList;
type ReactionCount = utils.iNewsReactionCount;

const ReactionForm: React.FC<ReactionFormProps> = ({ newsId, onReactionChange }) => {
  const [reactionLists, setReactionLists] = useState<ReactionList[]>([]);
  const [reactionCounts, setReactionCounts] = useState<ReactionCount[]>([]);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReactionLists = async () => {
    try {
      const response = await client.news_reaction.getReactionListsRoute();
      setReactionLists(response.items);
    } catch (err) {
      setError('Failed to load reaction types');
    }
  };

  const fetchReactionCounts = async () => {
    try {
      const response = await client.news_reaction.getReactionsByNewsIdRoute(newsId);
      setReactionCounts(response.items);
    } catch (err) {
      setError('Failed to load reaction counts');
    }
  };

  const fetchUserReactions = async () => {
    const token = getAuthToken();
    const user = getUser();
    if (!token || !user) return;

    try {
      const response = await client.news_reaction.getUserReactionsForNewsRoute(newsId);
      setUserReactions(new Set(response.reactions.map(r => r.reaction_list_id)));
    } catch (err) {
      setError('Failed to load user reactions');
    }
  };

  useEffect(() => {
    fetchReactionLists();
    fetchReactionCounts();
    fetchUserReactions();
  }, [newsId]);

  const handleReactionClick = async (reactionId: string) => {
    const token = getAuthToken();
    const user = getUser();
    if (!token || !user) {
      navigate('/signin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (userReactions.has(reactionId)) {
        await client.news_reaction.removeReactionRoute(newsId, reactionId);
        setUserReactions(prev => {
          const newSet = new Set(prev);
          newSet.delete(reactionId);
          return newSet;
        });
      } else {
        await client.news_reaction.addReactionRoute(newsId, reactionId);
        setUserReactions(prev => new Set([...prev, reactionId]));
      }
      await fetchReactionCounts();
      onReactionChange();
    } catch (err) {
      setError('Failed to update reaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!getAuthToken()) {
    return (
      <div className="reaction-form-container">
        <div className="reaction-counts">
          {reactionCounts.map(reaction => (
            <span key={reaction.reaction_list_id} className="reaction-count">
              {reaction.title}: {reaction.count}
            </span>
          ))}
        </div>
        <p className="login-prompt">
          Please <a href="/signin">sign in</a> to react to this news.
        </p>
      </div>
    );
  }

  return (
    <div className="reaction-form">
      {error && <div className="error-message">{error}</div>}
      <div className="reaction-buttons">
        {reactionLists.map(reaction => (
          <button
            key={reaction.id}
            onClick={() => handleReactionClick(reaction.id)}
            className={`reaction-button ${userReactions.has(reaction.id) ? 'active' : ''}`}
            disabled={isLoading}
          >
            {reaction.title}
            <span className="reaction-count">
              {reactionCounts.find(r => r.reaction_list_id === reaction.id)?.count || '0'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReactionForm;
