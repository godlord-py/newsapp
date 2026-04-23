import React, { useState, useEffect } from 'react';
import JobCard from '/home/godlord/news/newsapp/src/components/UI/cards';
import "/home/godlord/news/newsapp/src/styles/jobs.css";

const JL_STYLES = `
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

  /* ── Root ── */
  .jl-root {
    background: var(--paper);
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .jl-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* ── Page Header ── */
  .jl-page-header {
    border-top: 5px solid var(--ink);
    border-bottom: 4px double var(--ink);
    padding: 28px 48px 22px;
    text-align: center;
    position: relative;
    background: var(--paper);
    z-index: 10;
    animation: jl-fadeDown 0.6s ease both;
  }

  @keyframes jl-fadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes jl-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .jl-masthead-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 11px;
    letter-spacing: 0.45em;
    color: var(--red);
    text-transform: uppercase;
    margin-bottom: 8px;
    display: block;
    animation: jl-fadeDown 0.5s ease 0.1s both;
  }

  .jl-page-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5.5vw, 72px);
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
    letter-spacing: -0.02em;
    animation: jl-fadeDown 0.6s ease 0.15s both;
  }

  .jl-page-title span {
    color: var(--red);
    font-style: italic;
  }

  .jl-header-sub {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 12px;
    animation: jl-fadeDown 0.6s ease 0.25s both;
  }

  .jl-header-rule {
    flex: 1;
    max-width: 180px;
    height: 1px;
    background: var(--ink);
    opacity: 0.2;
  }

  .jl-header-tagline {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 12px;
    letter-spacing: 0.1em;
    color: var(--muted);
    white-space: nowrap;
  }

  /* ── Inner wrap ── */
  .jl-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 48px;
    position: relative;
    z-index: 5;
  }

  /* ── Filter bar ── */
  .jl-filter-section {
    padding-top: 32px;
    padding-bottom: 0;
    animation: jl-fadeUp 0.6s ease 0.3s both;
  }

  .jl-filter-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .jl-filter-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px;
    letter-spacing: 0.4em;
    color: var(--red);
    text-transform: uppercase;
    white-space: nowrap;
  }

  .jl-filter-rule {
    flex: 1;
    height: 1px;
    background: var(--ink);
    opacity: 0.15;
  }

  .jl-filter-count {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 500;
  }

  .jl-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 0;
  }

  .jl-pill {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 8px 20px;
    border: 1px solid var(--rule);
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    line-height: 1;
  }

  .jl-pill:hover {
    background: var(--ink);
    color: var(--paper);
    border-color: var(--ink);
  }

  .jl-pill.active {
    background: var(--red);
    color: white;
    border-color: var(--red);
  }

  .jl-pill.gov.active {
    background: var(--blue);
    border-color: var(--blue);
  }

  .jl-pill.priv.active {
    background: var(--gold);
    border-color: var(--gold);
  }

  /* ── Section divider ── */
  .jl-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 28px 0 20px;
  }

  .jl-divider-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px;
    letter-spacing: 0.4em;
    color: var(--red);
    white-space: nowrap;
    text-transform: uppercase;
  }

  .jl-divider-rule {
    flex: 1;
    height: 1px;
    background: var(--ink);
    opacity: 0.15;
  }

  /* ── Jobs grid ── */
  .jl-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--rule);
    border: 1px solid var(--rule);
    margin-bottom: 48px;
    animation: jl-fadeUp 0.6s ease 0.4s both;
  }

  /* ── Job card wrapper ── */
  .jl-card-wrap {
    background: var(--paper);
    transition: background 0.2s;
    animation: jl-fadeUp 0.5s ease both;
  }

  .jl-card-wrap:hover { background: #ede8dc; }

  .jl-card-wrap:nth-child(3n+1) { animation-delay: 0.05s; }
  .jl-card-wrap:nth-child(3n+2) { animation-delay: 0.12s; }
  .jl-card-wrap:nth-child(3n+3) { animation-delay: 0.19s; }

  /* ── Empty state ── */
  .jl-empty {
    grid-column: 1 / -1;
    padding: 80px 32px;
    text-align: center;
    background: var(--paper);
  }

  .jl-empty-glyph {
    font-family: 'Playfair Display', serif;
    font-size: 64px;
    color: var(--ink);
    opacity: 0.07;
    line-height: 1;
    margin-bottom: 20px;
  }

  .jl-empty-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 22px;
    color: var(--muted);
  }

  /* ── Footer rule ── */
  .jl-footer-rule {
    border: none;
    border-top: 4px double var(--ink);
    opacity: 0.12;
    margin: 0 0 32px;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .jl-page-header { padding: 20px 20px 16px; }
    .jl-inner { padding: 0 20px; }
    .jl-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 560px) {
    .jl-grid { grid-template-columns: 1fr; }
    .jl-page-title { font-size: 28px; }
    .jl-pill { padding: 7px 14px; font-size: 9px; }
  }
`;

const JobsLayout = () => {
  const [filter, setFilter] = useState('all');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    fetch('https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/jobs')
      .then(response => response.json())
      .then(data => setJobs(data))
      .catch(error => console.error('Error fetching jobs:', error));
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.type === filter;
  });

  const filterLabel = () => {
    if (filter === 'government') return 'Government Jobs';
    if (filter === 'private') return 'Private Jobs';
    return 'All Positions';
  };

  return (
    <>
      <style>{JL_STYLES}</style>

      <div className="jl-root">

        {/* ── Page Header ── */}
        <div className="jl-page-header">
          <span className="jl-masthead-label">The Daily Chronicle · Opportunities</span>
          <div className="jl-page-title">
            Available <span>Jobs</span>
          </div>
          <div className="jl-header-sub">
            <div className="jl-header-rule" />
            <span className="jl-header-tagline">Government · Private · Career Opportunities</span>
            <div className="jl-header-rule" />
          </div>
        </div>

        <div className="jl-inner">

          {/* ── Filter Bar ── */}
          <div className="jl-filter-section">
            <div className="jl-filter-header">
              <span className="jl-filter-label">Filter by Type</span>
              <div className="jl-filter-rule" />
              <span className="jl-filter-count">{filteredJobs.length} positions</span>
            </div>
            <div className="jl-pills">
              <button
                className={`jl-pill${filter === 'all' ? ' active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Jobs
              </button>
              <button
                className={`jl-pill gov${filter === 'government' ? ' active' : ''}`}
                onClick={() => setFilter('government')}
              >
                Government
              </button>
              <button
                className={`jl-pill priv${filter === 'private' ? ' active' : ''}`}
                onClick={() => setFilter('private')}
              >
                Private
              </button>
            </div>
          </div>

          {/* ── Section Divider ── */}
          <div className="jl-divider">
            <span className="jl-divider-label">{filterLabel()}</span>
            <div className="jl-divider-rule" />
          </div>

          {/* ── Jobs Grid ── */}
          <div className="jl-grid">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.id} className="jl-card-wrap">
                  <JobCard
                    title={job.title}
                    company={job.company}
                    description={job.description}
                    logoUrl={job.logoUrl}
                    applyUrl={job.applyUrl}
                  />
                </div>
              ))
            ) : (
              <div className="jl-empty">
                <div className="jl-empty-glyph">✦</div>
                <p className="jl-empty-text">No positions found for this filter.</p>
              </div>
            )}
          </div>

          <hr className="jl-footer-rule" />

        </div>
      </div>
    </>
  );
};

export default JobsLayout;