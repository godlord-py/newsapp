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

const NW_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --ink: #0a0a0a;
    --paper: #f5f0e8;
    --red: #c0392b;
    --gold: #b8860b;
    --blue: #1a3a5c;
    --muted: rgba(10,10,10,0.5);
    --rule: rgba(10,10,10,0.14);
  }

  .nw-root {
    background: var(--paper);
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }

  .nw-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 999;
    opacity: 0.5;
  }

  .nw-page-header {
    border-top: 5px solid var(--ink);
    border-bottom: 4px double var(--ink);
    padding: 24px 48px 20px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: var(--paper);
    z-index: 50;
  }

  .nw-page-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .nw-page-title span { color: var(--red); font-style: italic; }

  .nw-page-meta { text-align: right; }

  .nw-page-meta-date {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    display: block;
    margin-bottom: 4px;
  }

  .nw-live-badge {
    background: var(--red);
    color: white;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 12px;
    letter-spacing: 0.25em;
    padding: 3px 10px;
    display: inline-block;
    animation: nw-pulse 2s ease-in-out infinite;
  }

  @keyframes nw-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }

  .nw-error {
    margin: 16px 48px;
    border-left: 3px solid var(--red);
    background: rgba(192,57,43,0.06);
    padding: 12px 16px;
    font-size: 13px;
    color: var(--red);
    font-weight: 500;
  }

  .nw-section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 32px 48px 0;
    margin-bottom: 20px;
  }

  .nw-section-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px;
    letter-spacing: 0.4em;
    color: var(--red);
    white-space: nowrap;
    text-transform: uppercase;
  }

  .nw-section-rule { flex: 1; height: 1px; background: var(--ink); opacity: 0.15; }

  .nw-section-count {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 500;
  }

  .nw-world-wrap { padding: 0 48px; }

  .nw-world-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--rule);
    border: 1px solid var(--rule);
  }

  .nw-card {
    background: var(--paper);
    display: flex;
    flex-direction: column;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s;
    overflow: hidden;
  }

  .nw-card:hover { background: #f0ebe0; }

  .nw-card-img-wrap { overflow: hidden; position: relative; }

  .nw-card-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    filter: sepia(8%) contrast(1.05);
    transition: filter 0.3s, transform 0.4s;
  }

  .nw-card:hover .nw-card-img {
    filter: sepia(0%) contrast(1.1);
    transform: scale(1.02);
  }

  .nw-card-img-placeholder {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, #1a3a5c 0%, #0a0a0a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nw-card-img-placeholder span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 11px;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.2);
  }

  .nw-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }

  .nw-card-cat {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 8px;
  }

  .nw-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.35;
    margin-bottom: 10px;
    flex: 1;
    transition: color 0.2s;
  }

  .nw-card:hover .nw-card-title { color: var(--red); }

  .nw-card-summary {
    font-size: 12.5px;
    line-height: 1.65;
    color: var(--ink);
    opacity: 0.6;
    margin-bottom: 14px;
  }

  .nw-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid var(--rule);
  }

  .nw-card-date {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 500;
  }

  .nw-card-read {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--red);
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .nw-card:hover .nw-card-read { opacity: 1; }

  .nw-latest-wrap { padding: 0 48px; }

  .nw-latest-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--rule);
    border: 1px solid var(--rule);
  }

  .nw-latest-card {
    background: var(--paper);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    transition: background 0.2s;
    overflow: hidden;
  }

  .nw-latest-card:hover { background: #f0ebe0; }

  .nw-latest-img-wrap { overflow: hidden; }

  .nw-latest-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
    filter: sepia(10%) contrast(1.04);
    transition: filter 0.3s, transform 0.4s;
  }

  .nw-latest-card:hover .nw-latest-img {
    filter: sepia(0%) contrast(1.1);
    transform: scale(1.03);
  }

  .nw-latest-img-placeholder {
    width: 100%;
    height: 180px;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a3a5c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nw-latest-img-placeholder span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 10px;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.15);
  }

  .nw-latest-body { padding: 18px; flex: 1; display: flex; flex-direction: column; }

  .nw-latest-title {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.4;
    margin-bottom: 10px;
    flex: 1;
    transition: color 0.2s;
  }

  .nw-latest-card:hover .nw-latest-title { color: var(--red); }

  .nw-latest-desc {
    font-size: 12px;
    line-height: 1.6;
    color: var(--ink);
    opacity: 0.55;
    margin-bottom: 12px;
  }

  .nw-latest-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid var(--rule);
    margin-top: auto;
  }

  .nw-latest-date {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 500;
  }

  .nw-latest-arrow {
    font-size: 11px;
    color: var(--red);
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    transform: translateX(-4px);
  }

  .nw-latest-card:hover .nw-latest-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .nw-empty {
    grid-column: 1 / -1;
    padding: 64px 32px;
    text-align: center;
    background: var(--paper);
  }

  .nw-empty-icon {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    color: var(--ink);
    opacity: 0.1;
    margin-bottom: 16px;
  }

  .nw-empty-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 18px;
    color: var(--muted);
  }

  .nw-loadmore-wrap {
    padding: 32px 48px 48px;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .nw-loadmore-rule { flex: 1; height: 1px; background: var(--ink); opacity: 0.12; }

  .nw-loadmore-btn {
    background: var(--ink);
    color: var(--paper);
    border: none;
    padding: 13px 32px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 14px;
    letter-spacing: 0.25em;
    cursor: pointer;
    transition: background 0.3s;
    white-space: nowrap;
  }

  .nw-loadmore-btn:hover { background: var(--red); }
  .nw-loadmore-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .nw-footer-rule {
    border: none;
    border-top: 4px double var(--ink);
    opacity: 0.15;
    margin: 0 48px 32px;
  }

  @keyframes nw-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .nw-card { animation: nw-fadeUp 0.5s ease both; }
  .nw-latest-card { animation: nw-fadeUp 0.5s ease both; }

  @media (max-width: 900px) {
    .nw-page-header { padding: 16px 20px 14px; }
    .nw-section-header { padding: 24px 20px 0; }
    .nw-world-wrap, .nw-latest-wrap { padding: 0 20px; }
    .nw-world-grid { grid-template-columns: repeat(2, 1fr); }
    .nw-latest-grid { grid-template-columns: repeat(2, 1fr); }
    .nw-loadmore-wrap { padding: 24px 20px 40px; }
    .nw-footer-rule { margin: 0 20px 24px; }
    .nw-error { margin: 16px 20px; }
  }

  @media (max-width: 580px) {
    .nw-world-grid { grid-template-columns: 1fr; }
    .nw-latest-grid { grid-template-columns: 1fr; }
    .nw-page-title { font-size: 28px; }
  }
`;

const Newsworld: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const articlesPerPage = 3;
  const apiKey = API_ENDPOINT;
  const latestNewsUrl = `https://newsdata.io/api/1/news?apikey=pub_47580f2bce2cf06a479ce2af8c829401ec79c&country=in&language=en,hi`;

  useEffect(() => {
    const fetchWorldNews = async () => {
      const url = `https://api.worldnewsapi.com/top-news?source-country=in&language=en&api-key=${apiKey}`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'x-api-key': apiKey },
        });
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();
        const shuffledNews = shuffleArray(data.top_news[0].news || []);
        setNewsData(shuffledNews);
        localStorage.setItem('newsData', JSON.stringify(shuffledNews));
      } catch (err) {
        setError('Failed to fetch world news. Showing cached data.');
        const cachedData = localStorage.getItem('newsData');
        if (cachedData) setNewsData(JSON.parse(cachedData));
      }
    };
    fetchWorldNews();
  }, [apiKey]);

  const fetchLatestNews = async (page: string | null) => {
    setLoadingLatest(true);
    const fetchUrl = page ? `${latestNewsUrl}&page=${page}` : latestNewsUrl;
    try {
      const response = await axios.get(fetchUrl);
      setLatestNews(prevNews => [...prevNews, ...response.data.results]);
      setNextPage(response.data.nextPage);
    } catch (err) {
      setError('Failed to fetch latest news.');
    } finally {
      setLoadingLatest(false);
    }
  };

  useEffect(() => {
    fetchLatestNews(null);
  }, []);

  const loadMoreLatestNews = () => {
    if (nextPage) fetchLatestNews(nextPage);
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = newsData.slice(indexOfFirstArticle, indexOfLastArticle);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const truncate = (text: string, words: number) => {
    if (!text) return '';
    const parts = text.split(' ');
    return parts.length > words ? parts.slice(0, words).join(' ') + '…' : text;
  };

  return (
    <>
      <style>{NW_STYLES}</style>

      <div className="nw-root">

        {/* Page Header */}
        <div className="nw-page-header">
          <div className="nw-page-title">
            India <span>News</span>
          </div>
          <div className="nw-page-meta">
            <span className="nw-page-meta-date">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
            <span className="nw-live-badge">● Live Updates</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="nw-error">{error}</div>
        )}

        {/* Top Stories */}
        <div className="nw-section-header">
          <span className="nw-section-label">Top Stories</span>
          <div className="nw-section-rule" />
          <span className="nw-section-count">{currentArticles.length} articles</span>
        </div>

        <div className="nw-world-wrap">
          <div className="nw-world-grid">
            {currentArticles.length > 0 ? (
              currentArticles.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nw-card"
                >
                  <div className="nw-card-img-wrap">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="nw-card-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="nw-card-img-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="nw-card-body">
                    <div className="nw-card-cat">India · World</div>
                    <div className="nw-card-title">{article.title}</div>
                    {article.summary && (
                      <p className="nw-card-summary">{truncate(article.summary, 30)}</p>
                    )}
                    <div className="nw-card-footer">
                      <span className="nw-card-date">World News</span>
                      <span className="nw-card-read">Read more →</span>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="nw-empty">
                <div className="nw-empty-icon">✦</div>
                <p className="nw-empty-text">No stories available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Latest News */}
        <div className="nw-section-header" style={{ marginTop: '48px' }}>
          <span className="nw-section-label">Latest News</span>
          <div className="nw-section-rule" />
          <span className="nw-section-count">{latestNews.length} loaded</span>
        </div>

        <div className="nw-latest-wrap">
          <div className="nw-latest-grid">
            {latestNews.length > 0 ? (
              latestNews.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nw-latest-card"
                >
                  <div className="nw-latest-img-wrap">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="nw-latest-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="nw-latest-img-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="nw-latest-body">
                    <div className="nw-latest-title">{item.title}</div>
                    {item.description && (
                      <p className="nw-latest-desc">{truncate(item.description, 30)}</p>
                    )}
                    <div className="nw-latest-footer">
                      <span className="nw-latest-date">
                        {item.pubDate ? formatDate(item.pubDate) : 'Latest'}
                      </span>
                      <span className="nw-latest-arrow">→</span>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="nw-empty">
                <div className="nw-empty-icon">✦</div>
                <p className="nw-empty-text">
                  {loadingLatest ? 'Loading latest stories…' : 'No latest news available.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Load More */}
        <div className="nw-loadmore-wrap">
          <div className="nw-loadmore-rule" />
          <button
            className="nw-loadmore-btn"
            onClick={loadMoreLatestNews}
            disabled={loadingLatest || !nextPage}
          >
            {loadingLatest ? 'Loading…' : 'Load More Stories'}
          </button>
          <div className="nw-loadmore-rule" />
        </div>

        <hr className="nw-footer-rule" />

      </div>
    </>
  );
};

export default Newsworld;