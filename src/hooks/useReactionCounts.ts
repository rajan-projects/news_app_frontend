import { useState, useEffect } from 'react';
import client from '../config/encore';
import { utils } from '../lib/client';

export const useReactionCounts = (news: utils.iNews[]) => {
  const [reactionCounts, setReactionCounts] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReactionCounts = async () => {
      if (!news.length) {
        setLoading(false);
        return;
      }

      try {
        const counts = await Promise.all(
          news.map(async (item) => {
            const response = await client.news_reaction.getReactionsByNewsIdRoute(item.id);
            return { 
              id: item.id, 
              reactions: response.items.reduce((acc, reaction) => {
                acc[reaction.reaction_list_id] = reaction.count;
                return acc;
              }, {} as Record<string, string>)
            };
          })
        );

        const countsMap = counts.reduce((acc, item) => {
          acc[item.id] = item.reactions;
          return acc;
        }, {} as Record<string, Record<string, string>>);

        setReactionCounts(countsMap);
      } catch (error) {
        console.error('Error fetching reaction counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReactionCounts();
  }, [news]);

  return { reactionCounts, loading };
};
