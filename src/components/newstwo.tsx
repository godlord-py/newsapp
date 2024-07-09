import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from "../config/constants";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  url: string;
  image: string;
}

interface NewsItem {
  article_id: string;
  title: string;
  link: string;
  description: string;
  image_url: string;
  pubDate: string;
}

const shuffleArray = (array: NewsArticle[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const Newsworld: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const articlesPerPage = 3;
  const apiKey = API_ENDPOINT;
  const latestNewsUrl = `https://newsdata.io/api/1/news?apikey=pub_47580f2bce2cf06a479ce2af8c829401ec79c&country=in&language=en,hi`;

  useEffect(() => {
    const fetchWorldNews = async () => {
      console.log('API Endpoint:', apiKey);
      const url = `https://api.worldnewsapi.com/top-news?source-country=in&language=en&api-key=${apiKey}`;
  
      console.log('Fetching world news data...');
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('Data fetched successfully:', data);
        const shuffledNews = shuffleArray(data.top_news[0].news || []);
        setNewsData(shuffledNews);
        localStorage.setItem('newsData', JSON.stringify(shuffledNews));
      } catch (error) {
        console.error('Error fetching world news data:', error);
        setError('Failed to fetch world news. Showing cached data.');
        const cachedData = localStorage.getItem('newsData');
        if (cachedData) {
          console.log('Using cached data');
          setNewsData(JSON.parse(cachedData));
        } else {
          console.log('No cached data available');
        }
      }
    };
  
    fetchWorldNews();
  }, [apiKey]);
  

  const fetchLatestNews = async (page: string | null) => {
    console.log('Fetching latest news data...');
    const fetchUrl = page ? `${latestNewsUrl}&page=${page}` : latestNewsUrl;
    console.log('Latest news URL:', fetchUrl);
    try {
      const response = await axios.get(fetchUrl);
      setLatestNews(prevNews => [...prevNews, ...response.data.results]);
      setNextPage(response.data.nextPage);
    } catch (err) {
      console.error('Error fetching latest news data:', err);
      setError('Failed to fetch latest news.');
    }
  };

  useEffect(() => {
    fetchLatestNews(null); // Fetch the first page of latest news on initial load
  }, []);

  const loadMoreLatestNews = () => {
    if (nextPage) {
      fetchLatestNews(nextPage); // Fetch the next page of latest news when button is clicked
    }
  };

  const nextPageHandler = () => {
    console.log('Navigating to next page');
    setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPageHandler = () => {
    console.log('Navigating to previous page');
    setCurrentPage(prevPage => prevPage - 1);
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = newsData.slice(indexOfFirstArticle, indexOfLastArticle);

  console.log('Current page:', currentPage);
  console.log('Displaying articles:', currentArticles);
  console.log('Latest News:', latestNews);

  return (
    <div className="container mx-auto py-8 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h2 className="text-5xl font-bold mb-8 text-center font-serif text-gray-800 dark:text-white">India News</h2>
      {error && <p className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.length > 0 ? (
          currentArticles.map((article, index) => (
            <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold p-4 text-gray-800 dark:text-white">{article.title}</h3>
              <p className="px-4 pb-4 text-gray-600 dark:text-gray-300">{article.summary ? article.summary.split(' ').slice(0,30).join(' ') : ''}</p>
              <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
            </a>
          ))
        ) : (
          <p className="text-center text-lg col-span-full text-gray-600 dark:text-gray-400">No news available at the moment.</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {latestNews.length > 0 ? (
          latestNews.map((item, index) => (
            <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold p-4 text-gray-800 dark:text-white">{item.title}</h3>
              <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
              <p className="p-4 text-gray-600 dark:text-gray-300">
                {item.description ? item.description.split(' ').slice(0, 30).join(' ') : ''}
              </p>
            </a>
          ))
        ) : (
          <p className="text-center text-lg col-span-full text-gray-600 dark:text-gray-400">No latest news available at the moment.</p>
        )}
      </div>
  
      <div className="flex justify-center mt-8 space-x-4">
        <button
          className={`px-6 py-2 bg-blue-500 text-white rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          onClick={prevPageHandler}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className={`px-6 py-2 bg-blue-500 text-white rounded-md ${indexOfLastArticle >= newsData.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          onClick={nextPageHandler}
          disabled={indexOfLastArticle >= newsData.length}
        >
          Next
        </button>
      </div>
  
      <div className="flex justify-center mt-4">
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={loadMoreLatestNews}
        >
          Load More Latest News
        </button>
      </div>
    </div>
  );
};

export default Newsworld;
