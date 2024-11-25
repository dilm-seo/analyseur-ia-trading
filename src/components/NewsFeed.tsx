import React from 'react';
import type { FeedItem } from '../types/feed';
import { Clock, User, Tag, MessageSquare } from 'lucide-react';

interface NewsFeedProps {
  items: FeedItem[];
  isLoading: boolean;
}

export default function NewsFeed({ items, isLoading }: NewsFeedProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-700 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
          <h3 className="font-semibold text-lg mb-2 text-blue-300">{item.title}</h3>
          <p className="text-gray-300 text-sm mb-3" dangerouslySetInnerHTML={{ 
            __html: item.contentSnippet
          }} />
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(item.pubDate).toLocaleString('fr-FR')}</span>
            </div>
            
            {item.creator && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{item.creator}</span>
              </div>
            )}
            
            {item.category && (
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>{item.category}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <a
                href={item.comments}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300"
              >
                Commentaires
              </a>
            </div>
            
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-blue-400 hover:text-blue-300 font-medium"
            >
              Lire plus →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}