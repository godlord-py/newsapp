import React, { useEffect, useRef, useState } from "react";

const FirstPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const headlines = [
    "BREAKING", "LIVE", "EXCLUSIVE", "WORLD", "POLITICS",
    "TECH", "SCIENCE", "CULTURE", "MARKETS", "SPORT"
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --ink: #0a0a0a;
          --paper: #f5f0e8;
          --red: #c0392b;
          --gold: #b8860b;
          --blue: #1a3a5c;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .fp-root {
          background: var(--paper);
          min-height: 100vh;
          overflow: hidden;
          position: relative;
          font-family: 'DM Sans', sans-serif;
        }

        /* Subtle grain texture */
        .fp-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 999;
          opacity: 0.6;
        }

        /* Top rule bar */
        .fp-topbar {
          border-top: 5px solid var(--ink);
          border-bottom: 1.5px solid var(--ink);
          padding: 8px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--paper);
          position: relative;
          z-index: 10;
        }

        .fp-topbar-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.6;
        }

        .fp-topbar-tag {
          background: var(--red);
          color: white;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 0.2em;
          padding: 3px 12px;
          animation: blink-pulse 2s ease-in-out infinite;
        }

        @keyframes blink-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        /* Masthead */
        .fp-masthead {
          text-align: center;
          padding: 28px 48px 16px;
          border-bottom: 4px double var(--ink);
          position: relative;
          z-index: 10;
        }

        .fp-masthead-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(56px, 10vw, 120px);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--ink);
          line-height: 0.9;
          position: relative;
          display: inline-block;
        }

        .fp-masthead-name::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--red), var(--blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          transition: opacity 0.4s;
        }

        .fp-masthead-name:hover::after { opacity: 1; }

        .fp-masthead-sub {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 8px;
        }

        .fp-masthead-rule { flex: 1; height: 1px; background: var(--ink); opacity: 0.3; max-width: 200px; }

        .fp-masthead-tagline {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 12px;
          letter-spacing: 0.12em;
          color: var(--ink);
          opacity: 0.55;
          white-space: nowrap;
        }

        /* Ticker */
        .fp-ticker {
          background: var(--ink);
          color: var(--paper);
          padding: 8px 0;
          overflow: hidden;
          position: relative;
          z-index: 10;
        }

        .fp-ticker-track {
          display: flex;
          gap: 0;
          animation: ticker-scroll 22s linear infinite;
          width: max-content;
        }

        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .fp-ticker-item {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 0.2em;
          padding: 0 24px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .fp-ticker-dot {
          width: 5px;
          height: 5px;
          background: var(--red);
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }

        /* Hero grid */
        .fp-hero {
          display: grid;
          grid-template-columns: 1fr 2px 1.3fr 2px 1fr;
          min-height: calc(100vh - 220px);
          border-bottom: 2px solid var(--ink);
          position: relative;
          z-index: 5;
        }

        .fp-col-divider {
          background: var(--ink);
          opacity: 0.15;
        }

        /* Left column */
        .fp-col-left {
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          border-right: none;
        }

        .fp-section-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px;
          letter-spacing: 0.35em;
          color: var(--red);
          border-bottom: 1px solid var(--red);
          padding-bottom: 6px;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .fp-brief-item {
          padding: 16px 0;
          border-bottom: 1px solid rgba(10,10,10,0.12);
          cursor: pointer;
          transition: all 0.2s;
        }

        .fp-brief-item:hover { padding-left: 8px; }

        .fp-brief-cat {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--blue);
          margin-bottom: 6px;
        }

        .fp-brief-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--ink);
          line-height: 1.4;
        }

        .fp-brief-meta {
          font-size: 10px;
          color: var(--ink);
          opacity: 0.4;
          margin-top: 6px;
          letter-spacing: 0.05em;
        }

        /* Center column — hero story */
        .fp-col-center {
          padding: 40px 40px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: relative;
        }

        .fp-hero-eyebrow {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 11px;
          letter-spacing: 0.4em;
          color: var(--red);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .fp-hero-eyebrow::before {
          content: '';
          display: block;
          width: 30px;
          height: 2px;
          background: var(--red);
        }

        .fp-hero-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 4.5vw, 72px);
          font-weight: 900;
          line-height: 1.05;
          color: var(--ink);
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          position: relative;
        }

        .fp-hero-headline em {
          font-style: italic;
          color: var(--red);
        }

        .fp-hero-deck {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 17px;
          color: var(--ink);
          opacity: 0.7;
          line-height: 1.65;
          margin-bottom: 32px;
          border-left: 3px solid var(--gold);
          padding-left: 18px;
        }

        .fp-hero-image-placeholder {
          width: 100%;
          aspect-ratio: 16/10;
          background: linear-gradient(145deg, #1a3a5c 0%, #0a0a0a 60%, #c0392b 100%);
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .fp-hero-image-placeholder::after {
          content: 'DAILY CHRONICLE';
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 900;
          color: rgba(245,240,232,0.08);
          letter-spacing: 0.1em;
        }

        .fp-globe {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #2a5f8f, #1a3a5c 40%, #0d1f30 70%, #0a0a0a);
          box-shadow:
            inset -25px -25px 60px rgba(0,0,0,0.7),
            inset 15px 15px 40px rgba(100,160,220,0.15),
            0 30px 80px rgba(10,10,10,0.35),
            0 0 0 1px rgba(10,10,10,0.2);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          overflow: hidden;
          transition: transform 0.1s ease-out;
        }

        .fp-globe::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,0.04) 18px, rgba(255,255,255,0.04) 19px),
            repeating-linear-gradient(90deg, transparent, transparent 26px, rgba(255,255,255,0.04) 26px, rgba(255,255,255,0.04) 27px);
          border-radius: 50%;
        }

        .fp-globe::after {
          content: '';
          position: absolute;
          top: 10%;
          left: 20%;
          width: 30%;
          height: 20%;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
          filter: blur(8px);
        }

        .fp-globe-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(10,10,10,0.15);
        }

        .fp-globe-ring-2 {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          border: 1px dashed rgba(10,10,10,0.08);
        }

        /* Right column */
        .fp-col-right {
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
        }

        .fp-opinion {
          background: var(--ink);
          color: var(--paper);
          padding: 24px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        .fp-opinion::before {
          content: '201C';
          position: absolute;
          top: -20px;
          left: 10px;
          font-family: 'Playfair Display', serif;
          font-size: 120px;
          color: rgba(255,255,255,0.06);
          line-height: 1;
          pointer-events: none;
        }

        .fp-opinion-text {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 15px;
          line-height: 1.65;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .fp-opinion-attr {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          opacity: 0.5;
          font-weight: 500;
        }

        .fp-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: rgba(10,10,10,0.12);
          border: 1px solid rgba(10,10,10,0.12);
          margin-bottom: 24px;
        }

        .fp-stat {
          background: var(--paper);
          padding: 16px;
          text-align: center;
          transition: background 0.2s;
          cursor: default;
        }

        .fp-stat:hover { background: rgba(10,10,10,0.04); }

        .fp-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          color: var(--red);
          line-height: 1;
          display: block;
        }

        .fp-stat-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.5;
          margin-top: 4px;
          display: block;
        }

        .fp-cta {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }

        .fp-btn-primary {
          flex: 1;
          background: var(--ink);
          color: var(--paper);
          border: none;
          padding: 14px 20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .fp-btn-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--red);
          transform: translateX(-101%);
          transition: transform 0.3s ease;
        }

        .fp-btn-primary:hover::after { transform: translateX(0); }
        .fp-btn-primary span { position: relative; z-index: 1; }

        .fp-btn-secondary {
          background: transparent;
          color: var(--ink);
          border: 1.5px solid var(--ink);
          padding: 14px 20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .fp-btn-secondary:hover {
          background: var(--ink);
          color: var(--paper);
        }

        /* Center floating globe area */
        .fp-globe-container {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }

        /* Category pills row */
        .fp-categories {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .fp-cat-pill {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 5px 12px;
          border: 1px solid rgba(10,10,10,0.2);
          cursor: pointer;
          transition: all 0.2s;
          color: var(--ink);
          background: transparent;
        }

        .fp-cat-pill:hover,
        .fp-cat-pill.active {
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
        }

        .fp-cat-pill.red {
          background: var(--red);
          color: white;
          border-color: var(--red);
        }

        /* Animations */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fp-col-left { animation: fadeSlideUp 0.7s ease 0.1s both; }
        .fp-col-center { animation: fadeSlideUp 0.7s ease 0.25s both; }
        .fp-col-right { animation: fadeSlideUp 0.7s ease 0.4s both; }
        .fp-masthead { animation: fadeSlideUp 0.6s ease 0s both; }

        @keyframes globe-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .fp-globe-inner-ring {
          position: absolute;
          inset: 15%;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
          animation: globe-rotate 20s linear infinite;
        }

        @media (max-width: 768px) {
          .fp-hero { grid-template-columns: 1fr; }
          .fp-col-divider { display: none; }
          .fp-col-left, .fp-col-right { display: none; }
          .fp-masthead-name { font-size: 48px; }
          .fp-topbar { padding: 8px 20px; }
          .fp-col-center { padding: 24px 20px; }
        }
      `}</style>

      <div className="fp-root">
        {/* Top bar */}
        <div className="fp-topbar">
          <span className="fp-topbar-date">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
          <span className="fp-topbar-tag">● LIVE</span>
          <span className="fp-topbar-date">Vol. CXLII · Est. 1882</span>
        </div>

        {/* Masthead */}
        <div className="fp-masthead">
          <div className="fp-masthead-name" data-text="THE DAILY CHRONICLE">THE DAILY CHRONICLE</div>
          <div className="fp-masthead-sub">
            <div className="fp-masthead-rule" />
            <span className="fp-masthead-tagline">Truth · Clarity · Independence · All the News Fit to Print</span>
            <div className="fp-masthead-rule" />
          </div>
        </div>

        {/* Ticker */}
        <div className="fp-ticker">
          <div className="fp-ticker-track">
            {[...headlines, ...headlines].map((h, i) => (
              <div key={i} className="fp-ticker-item">
                <span className="fp-ticker-dot" />
                {h}
              </div>
            ))}
          </div>
        </div>

        {/* Hero grid */}
        <div className="fp-hero">
          {/* Left column — briefs */}
          <div className="fp-col-left">
            <div className="fp-section-label">Top Stories</div>

            {[
              { cat: "Politics", title: "Senate passes landmark infrastructure reform bill", time: "2 hrs ago" },
              { cat: "Technology", title: "AI regulation framework unveiled by EU officials", time: "4 hrs ago" },
              { cat: "Markets", title: "Global indices rally as inflation fears ease", time: "5 hrs ago" },
              { cat: "Climate", title: "Arctic ice reaches record low for second year", time: "6 hrs ago" },
              { cat: "Health", title: "WHO declares end to latest outbreak emergency", time: "8 hrs ago" },
            ].map((item, i) => (
              <div key={i} className="fp-brief-item">
                <div className="fp-brief-cat">{item.cat}</div>
                <div className="fp-brief-title">{item.title}</div>
                <div className="fp-brief-meta">{item.time}</div>
              </div>
            ))}
          </div>

          <div className="fp-col-divider" />

          {/* Center column — hero story */}
          <div className="fp-col-center">
            <div className="fp-hero-eyebrow">Breaking News</div>

            <div className="fp-categories">
              {["All", "World", "Politics", "Tech", "Science"].map((c, i) => (
                <button key={c} className={`fp-cat-pill ${i === 0 ? "red" : ""}`}>{c}</button>
              ))}
            </div>

            <h1 className="fp-hero-headline">
              Latest News<br />
              <em>Headlines</em><br />
              Around the World
            </h1>

            <p className="fp-hero-deck">
              Stay informed with in-depth reporting, breaking stories, and exclusive analysis — delivered with the clarity and independence you've come to trust.
            </p>

            {/* Globe visual */}
            <div className="fp-globe-container">
              <div
                className="fp-globe"
                style={{
                  transform: `translate(calc(-50% + ${mousePos.x * 0.3}px), calc(-50% + ${mousePos.y * 0.3}px))`,
                }}
              >
                <div className="fp-globe-inner-ring" />
              </div>
              <div className="fp-globe-ring" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 320, height: 320, position: 'absolute' }} />
              <div className="fp-globe-ring-2" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 320, height: 320, position: 'absolute' }} />
            </div>

            <div className="fp-cta">
              <button className="fp-btn-primary"><span>Read Today's Edition</span></button>
              <button className="fp-btn-secondary">Subscribe</button>
            </div>
          </div>

          <div className="fp-col-divider" />

          {/* Right column */}
          <div className="fp-col-right">
            <div className="fp-section-label">Opinion</div>

            <div className="fp-opinion">
              <p className="fp-opinion-text">
                "News is the first rough draft of history. What we report today shapes the understanding of tomorrow."
              </p>
              <span className="fp-opinion-attr">— Phil Graham, Publisher</span>
            </div>

            <div className="fp-section-label" style={{ marginTop: 8 }}>By the Numbers</div>

            <div className="fp-stats-grid">
              {[
                { num: "190+", label: "Countries Covered" },
                { num: "24/7", label: "Live Reporting" },
                { num: "4.2M", label: "Daily Readers" },
                { num: "142", label: "Years of Trust" },
              ].map((s) => (
                <div key={s.label} className="fp-stat">
                  <span className="fp-stat-num">{s.num}</span>
                  <span className="fp-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="fp-section-label">Editions</div>
            {["Morning Briefing", "Evening Digest", "Weekend Long-Read", "Markets Wrap"].map((e, i) => (
              <div key={i} className="fp-brief-item" style={{ cursor: "pointer" }}>
                <div className="fp-brief-cat">Newsletter</div>
                <div className="fp-brief-title">{e}</div>
                <div className="fp-brief-meta">Free · Delivered daily</div>
              </div>
            ))}

            <div style={{ marginTop: "auto", paddingTop: 24 }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FirstPage;