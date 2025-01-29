import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { ImageIcon } from 'lucide-react';

const NewsDisplay = () => {
  const host = 'http://localhost:5000';
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news data from the server
  const fetchNews = async () => {
    setLoading(true);
    try {
      // Fetch news from local storage if present
      const storedNews = localStorage.getItem('news');
      if (storedNews) {
        setNews(JSON.parse(storedNews));
        setLoading(false);
        return;
      }
      const response = await axios.get(`${host}/api/news`);
      setNews(response.data.articles || []); // Ensure articles exist
      localStorage.setItem('news', JSON.stringify(response.data.articles || []));
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Format date to be more readable
  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Unknown date';
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading news...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (news.length === 0) {
    return <div className="text-center text-gray-400">No news articles available.</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <Card 
            key={index} 
            className="bg-gray-700 border-gray-600 hover:bg-gray-600 transition-colors flex flex-col"
          >
            <div className="w-full h-48 overflow-hidden rounded-t-lg">
              <img
                src={article.urlToImage || '/placeholder.jpg'}
                alt={article.title || 'No title available'}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="flex-grow">
              <CardTitle className="text-xl text-blue-300 line-clamp-2">
                {article.title || 'No title available'}
              </CardTitle>
              <CardDescription className="text-sm text-gray-400">
                {article.source?.name || 'Unknown source'} | {formatDate(article.publishedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-200 line-clamp-3">
                {article.description || 'No description available.'}
              </p>
              {article.author && (
                <p className="text-sm text-gray-400 mt-2">By {article.author}</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {!article.urlToImage && (
                  <ImageIcon className="inline-block mr-2 text-gray-600" size={16} />
                )}
                {!article.urlToImage && 'No image available'}
              </span>
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Read more
                </a>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Total news articles: {news.length}
      </div>
    </div>
  );
};

export default NewsDisplay;