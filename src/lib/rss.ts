import type { FeedItem } from '../types/feed';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const RSS_URL = 'https://www.forexlive.com/feed/news';

export const fetchRSSFeed = async (): Promise<FeedItem[]> => {
  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(RSS_URL)}`);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const items = xmlDoc.querySelectorAll('item');
    
    return Array.from(items).map(item => {
      const getTextContent = (selector: string) => 
        item.querySelector(selector)?.textContent?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
      
      return {
        title: getTextContent('title'),
        link: getTextContent('link'),
        pubDate: getTextContent('pubDate'),
        content: getTextContent('description'),
        contentSnippet: getTextContent('description')
          .replace(/<[^>]+>/g, '')
          .split('\n')[0],
        creator: getTextContent('dc\\:creator'),
        category: getTextContent('category'),
        guid: getTextContent('guid'),
        comments: getTextContent('comments')
      };
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw error;
  }
};