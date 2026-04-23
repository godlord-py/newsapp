import React, { useEffect, useRef, useState } from "react";
import { BiSolidNews } from "react-icons/bi";
import { MdOutlineDynamicFeed, MdDateRange } from "react-icons/md";
import "aos/dist/aos.css";
import AOS from "aos";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "/src/styles/Pages.css";
import PDFViewer from "./PDFviewer";
import Select from "react-select";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PagesSkeleton from "./UI/Pagesskeleton";
import { CircularProgress } from "@nextui-org/react";
import { pdfjs } from "react-pdf";

const PG_STYLES = `
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
  .pg-root {
    background: var(--paper);
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }

  .pg-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* ── Page Header ── */
  .pg-page-header {
    border-top: 5px solid var(--ink);
    border-bottom: 4px double var(--ink);
    padding: 28px 48px 22px;
    text-align: center;
    position: relative;
    background: var(--paper);
    z-index: 10;
    animation: pg-fadeDown 0.6s ease both;
  }

  @keyframes pg-fadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .pg-masthead-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 11px;
    letter-spacing: 0.45em;
    color: var(--red);
    text-transform: uppercase;
    margin-bottom: 8px;
    display: block;
    animation: pg-fadeDown 0.5s ease 0.1s both;
  }

  .pg-page-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5.5vw, 72px);
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
    letter-spacing: -0.02em;
    animation: pg-fadeDown 0.6s ease 0.15s both;
  }

  .pg-page-title span {
    color: var(--red);
    font-style: italic;
  }

  .pg-header-sub {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 12px;
    animation: pg-fadeDown 0.6s ease 0.25s both;
  }

  .pg-header-rule {
    flex: 1;
    max-width: 180px;
    height: 1px;
    background: var(--ink);
    opacity: 0.2;
  }

  .pg-header-tagline {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 12px;
    letter-spacing: 0.1em;
    color: var(--muted);
    white-space: nowrap;
  }

  /* ── Filter Bar ── */
  .pg-filter-section {
    padding: 32px 48px 0;
    position: relative;
    z-index: 20;
    animation: pg-fadeUp 0.6s ease 0.3s both;
  }

  @keyframes pg-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .pg-filter-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .pg-filter-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px;
    letter-spacing: 0.4em;
    color: var(--red);
    text-transform: uppercase;
    white-space: nowrap;
  }

  .pg-filter-rule {
    flex: 1;
    height: 1px;
    background: var(--ink);
    opacity: 0.15;
  }

  .pg-filter-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--rule);
    border: 1px solid var(--rule);
    margin-bottom: 0;
  }

  .pg-filter-card {
    background: var(--paper);
    padding: 24px;
    position: relative;
  }

  .pg-filter-card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--rule);
  }

  .pg-filter-card-title svg {
    color: var(--red);
    font-size: 16px;
    flex-shrink: 0;
  }

  .pg-filter-card-title span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px;
    letter-spacing: 0.25em;
    color: var(--ink);
    text-transform: uppercase;
  }

  /* Filter pills */
  .pg-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .pg-pill {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 6px 14px;
    border: 1px solid var(--rule);
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    line-height: 1;
  }

  .pg-pill:hover {
    background: var(--ink);
    color: var(--paper);
    border-color: var(--ink);
  }

  .pg-pill.active {
    background: var(--red);
    color: white;
    border-color: var(--red);
  }

  /* React Select override */
  .pg-select-wrap .react-select__control {
    border: 1px solid var(--rule) !important;
    border-radius: 0 !important;
    background: var(--paper) !important;
    box-shadow: none !important;
    min-height: 36px !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 12px !important;
  }

  .pg-select-wrap .react-select__control:hover {
    border-color: var(--ink) !important;
  }

  .pg-select-wrap .react-select__menu {
    border-radius: 0 !important;
    border: 1px solid var(--ink) !important;
    box-shadow: 4px 4px 0 rgba(10,10,10,0.08) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 12px !important;
  }

  .pg-select-wrap .react-select__option--is-selected {
    background: var(--red) !important;
  }

  .pg-select-wrap .react-select__option--is-focused {
    background: rgba(192,57,43,0.08) !important;
  }

  .pg-select-wrap .react-select__indicator-separator {
    background: var(--rule) !important;
  }

  /* DatePicker override */
  .pg-datepicker-wrap .react-datepicker-wrapper,
  .pg-datepicker-wrap .react-datepicker__input-container {
    width: 100%;
  }

  .pg-datepicker-wrap input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--rule);
    background: var(--paper);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: var(--ink);
    outline: none;
    letter-spacing: 0.05em;
    transition: border-color 0.2s;
  }

  .pg-datepicker-wrap input:focus {
    border-color: var(--ink);
  }

  .pg-datepicker-wrap input::placeholder {
    color: var(--muted);
  }

  .pg-datepicker-wrap .react-datepicker {
    border-radius: 0;
    border: 1px solid var(--ink);
    font-family: 'DM Sans', sans-serif;
    box-shadow: 4px 4px 0 rgba(10,10,10,0.08);
  }

  .pg-datepicker-wrap .react-datepicker__header {
    background: var(--ink);
    border-radius: 0;
    color: var(--paper);
  }

  .pg-datepicker-wrap .react-datepicker__current-month,
  .pg-datepicker-wrap .react-datepicker__day-name {
    color: var(--paper);
  }

  .pg-datepicker-wrap .react-datepicker__day--highlighted {
    background: rgba(192,57,43,0.15);
    color: var(--red);
    font-weight: 700;
  }

  .pg-datepicker-wrap .react-datepicker__day--selected {
    background: var(--red) !important;
    border-radius: 0 !important;
    color: white !important;
  }

  .pg-datepicker-wrap .react-datepicker__day:hover {
    border-radius: 0 !important;
    background: rgba(10,10,10,0.08) !important;
  }

  /* ── Section divider ── */
  .pg-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 32px 48px 24px;
    position: relative;
    z-index: 5;
  }

  .pg-divider-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 13px;
    letter-spacing: 0.4em;
    color: var(--red);
    white-space: nowrap;
    text-transform: uppercase;
  }

  .pg-divider-rule {
    flex: 1;
    height: 1px;
    background: var(--ink);
    opacity: 0.15;
  }

  .pg-divider-count {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 500;
  }

  .pg-selected-date-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 12px;
    letter-spacing: 0.2em;
    color: var(--blue);
    border: 1px solid var(--blue);
    padding: 4px 12px;
  }

  /* ── Publications Grid ── */
  .pg-publications-wrap {
    padding: 0 48px 48px;
    position: relative;
    z-index: 5;
  }

  .pg-pub-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--rule);
    border: 1px solid var(--rule);
  }

  .pg-pub-card {
    background: var(--paper);
    cursor: pointer;
    transition: background 0.2s;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: pg-fadeUp 0.5s ease both;
  }

  .pg-pub-card:hover { background: #ede8dc; }

  .pg-pub-card-header {
    padding: 16px 16px 10px;
    border-bottom: 1px solid var(--rule);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  .pg-pub-name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.3;
    transition: color 0.2s;
    text-transform: capitalize;
  }

  .pg-pub-card:hover .pg-pub-name { color: var(--red); }

  .pg-pub-type-badge {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 9px;
    letter-spacing: 0.2em;
    padding: 3px 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .pg-pub-type-badge.newspaper {
    background: var(--blue);
    color: white;
  }

  .pg-pub-type-badge.magazine {
    background: var(--gold);
    color: white;
  }

  .pg-pub-img-wrap {
    overflow: hidden;
    position: relative;
    flex: 1;
  }

  .pg-pub-img {
    width: 100%;
    height: auto;
    display: block;
    filter: sepia(5%) contrast(1.04);
    transition: filter 0.3s, transform 0.5s;
  }

  .pg-pub-card:hover .pg-pub-img {
    filter: sepia(0%) contrast(1.08);
    transform: scale(1.03);
  }

  .pg-pub-img-placeholder {
    width: 100%;
    aspect-ratio: 3/4;
    background: linear-gradient(145deg, #1a3a5c, #0a0a0a);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pg-pub-img-placeholder span {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 10px;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.15);
  }

  .pg-pub-footer {
    padding: 10px 16px;
    border-top: 1px solid var(--rule);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pg-pub-date-label {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 500;
  }

  .pg-pub-open-hint {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--red);
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .pg-pub-card:hover .pg-pub-open-hint { opacity: 1; }

  /* ── Empty state ── */
  .pg-empty {
    grid-column: 1 / -1;
    padding: 80px 32px;
    text-align: center;
    background: var(--paper);
  }

  .pg-empty-glyph {
    font-family: 'Playfair Display', serif;
    font-size: 64px;
    color: var(--ink);
    opacity: 0.07;
    line-height: 1;
    margin-bottom: 20px;
  }

  .pg-empty-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 20px;
    color: var(--muted);
  }

  /* ── Mobile loading ── */
  .pg-mobile-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--paper);
  }

  /* ── Footer rule ── */
  .pg-footer-rule {
    border: none;
    border-top: 4px double var(--ink);
    opacity: 0.12;
    margin: 0 48px 32px;
  }

  /* ── Stagger animation delays ── */
  .pg-pub-card:nth-child(4n+1) { animation-delay: 0.05s; }
  .pg-pub-card:nth-child(4n+2) { animation-delay: 0.12s; }
  .pg-pub-card:nth-child(4n+3) { animation-delay: 0.19s; }
  .pg-pub-card:nth-child(4n+4) { animation-delay: 0.26s; }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .pg-filter-grid { grid-template-columns: repeat(2, 1fr); }
    .pg-pub-grid { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 768px) {
    .pg-page-header { padding: 20px 20px 16px; }
    .pg-filter-section { padding: 24px 20px 0; }
    .pg-filter-grid { grid-template-columns: 1fr; }
    .pg-pub-grid { grid-template-columns: repeat(2, 1fr); }
    .pg-publications-wrap { padding: 0 20px 40px; }
    .pg-divider { padding: 24px 20px 20px; }
    .pg-footer-rule { margin: 0 20px 24px; }
  }

  @media (max-width: 480px) {
    .pg-pub-grid { grid-template-columns: repeat(2, 1fr); }
    .pg-page-title { font-size: 28px; }
  }
`;

const Pages = () => {
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedName, setSelectedName] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [passedDate, setPassedDate] = useState(null);
  const [thumbnails, setThumbnails] = useState({});
  const [newspapers, setNewspapers] = useState([]);
  const isMobile = window.innerWidth <= 600;

  const renderPdfThumbnail = async (pdfUrl) => {
    const loadingTask = pdfjs.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = { canvasContext: context, viewport: viewport };
    await page.render(renderContext).promise;
    return canvas.toDataURL();
  };

  const generateThumbnails = async (publications) => {
    const thumbnails = {};
    for (const publication of publications) {
      if (publication.pdfFiles && publication.pdfFiles.length > 0) {
        const pdfUrl = publication.pdfFiles[0].path;
        try {
          thumbnails[publication.id] = await renderPdfThumbnail(pdfUrl);
        } catch (error) {
          console.error(`Error generating thumbnail for ${publication.id}:`, error);
        }
      }
    }
    setThumbnails(thumbnails);
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });

    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(new Date(savedDate));
      setPassedDate(new Date(savedDate));
    }

    window.addEventListener("scroll", handleScroll);
    return () => { window.removeEventListener("scroll", handleScroll); };
  }, []);

  const handleScroll = () => {
    setScrolled(window.pageYOffset > 100);
  };

  useEffect(() => {
    document.body.style.overflow = selectedPublication ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedPublication]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/newspapers');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPublications(data.newspapers.concat(data.magazines));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching publications:', error);
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  const handlePublicationClick = (publication) => {
    setSelectedPublication(publication);
  };

  const handleTypeChange = (option) => {
    if (option) {
      setSelectedType(option.value);
    } else {
      setSelectedType("All");
    }
    setSelectedName("All");
  };

  const handleNameChange = (option) => {
    setSelectedName(option.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setPassedDate(date);
    localStorage.setItem('selectedDate', date.toISOString());
    setSelectedName("All");
  };

  const handleLanguageChange = (option) => {
    setSelectedLanguage(option.value);
  };

  const filteredPublications = selectedType === "All" ? publications : publications.filter((item) => item.type === selectedType);
  const filteredByDate = selectedDate ? publications.filter((item) => item.dates.some((date) => new Date(date).toDateString() === selectedDate.toDateString())) : publications;
  const filteredByType = selectedType === "All" ? filteredByDate : filteredByDate.filter((item) => item.type === selectedType);
  const filteredNames = selectedName === "All" ? filteredByType : filteredByType.filter((item) => item.name === selectedName);
  const filteredLanguages = selectedLanguage === "All" ? filteredNames : filteredNames.filter((item) => item.language === selectedLanguage);

  useEffect(() => {
    if (filteredByDate.length > 0 && !selectedDate) {
      setSelectedDate(new Date(filteredByDate[0].dates[0]));
      setPassedDate(new Date(filteredByDate[0].dates[0]));
    }
  }, [filteredByDate, selectedDate]);

  const publicationContainerRef = useRef(null);

  const handleCrossButtonClick = () => {
    publicationContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedPublication(null);
  };

  const options = [
    { value: "All", label: "All Types" },
    { value: "newspaper", label: "Newspaper" },
    { value: "magazine", label: "Magazine" },
  ];

  const nameOptions = [
    { value: "All", label: "All Names" },
    ...Array.from(new Set(filteredByType.map((item) => item.name))).map((name) => ({
      value: name,
      label: name,
    })),
  ];

  const languageOptions = [
    { value: "All", label: "All Languages" },
    ...Array.from(new Set(publications.map((item) => item.language))).map((language) => ({
      value: language,
      label: language,
    })),
  ];

  const availableDates = publications.reduce((dates, publication) => {
    return dates.concat(publication.dates.map((date) => new Date(date)));
  }, []);

  const formattedSelectedDate =
    selectedDate &&
    selectedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const selectStyles = {
    control: (base) => ({
      ...base,
      border: '1px solid rgba(10,10,10,0.14)',
      borderRadius: 0,
      background: '#f5f0e8',
      boxShadow: 'none',
      minHeight: '36px',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '12px',
      '&:hover': { borderColor: '#0a0a0a' },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      border: '1px solid #0a0a0a',
      boxShadow: '4px 4px 0 rgba(10,10,10,0.08)',
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '12px',
      background: '#f5f0e8',
    }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected ? '#c0392b' : state.isFocused ? 'rgba(192,57,43,0.08)' : 'transparent',
      color: state.isSelected ? 'white' : '#0a0a0a',
      cursor: 'pointer',
    }),
    singleValue: (base) => ({ ...base, color: '#0a0a0a' }),
    indicatorSeparator: (base) => ({ ...base, background: 'rgba(10,10,10,0.14)' }),
  };

  return (
    <>
      <style>{PG_STYLES}</style>

      {loading ? (
        !isMobile ? (
          <PagesSkeleton />
        ) : (
          <div className="pg-mobile-loading">
            <CircularProgress />
          </div>
        )
      ) : (
        <div className="pg-root">

          {/* ── Page Header ── */}
          <div className="pg-page-header">
            <span className="pg-masthead-label">The Daily Chronicle · Archive</span>
            <div className="pg-page-title">
              Explore <span>Newspapers</span> &amp; Magazines
            </div>
            <div className="pg-header-sub">
              <div className="pg-header-rule" />
              <span className="pg-header-tagline">Browse · Filter · Read · Stay Informed</span>
              <div className="pg-header-rule" />
            </div>
          </div>

          {/* ── Filter Bar ── */}
          <div className="pg-filter-section">
            <div className="pg-filter-header">
              <span className="pg-filter-label">Refine Your Selection</span>
              <div className="pg-filter-rule" />
            </div>

            <div className="pg-filter-grid">

              {/* Filter by Type */}
              <div className="pg-filter-card">
                <div className="pg-filter-card-title">
                  <BiSolidNews size={14} />
                  <span>Publication Type</span>
                </div>
                <div className="pg-pills">
                  <button
                    onClick={() => handleTypeChange({ value: "All" })}
                    className={`pg-pill${selectedType === "All" ? " active" : ""}`}
                  >
                    All Types
                  </button>
                  {options.map((option) =>
                    option.value !== "All" && (
                      <button
                        key={option.value}
                        onClick={() => handleTypeChange(option)}
                        className={`pg-pill${selectedType === option.value ? " active" : ""}`}
                      >
                        {option.label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Filter by Date */}
              <div className="pg-filter-card">
                <div className="pg-filter-card-title">
                  <MdDateRange size={14} />
                  <span>Edition Date</span>
                </div>
                <div className="pg-datepicker-wrap">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    includeDates={availableDates}
                    placeholderText="Select a date"
                  />
                </div>
              </div>

              {/* Filter by Name */}
              <div className="pg-filter-card" style={{ zIndex: 30 }}>
                <div className="pg-filter-card-title">
                  <MdOutlineDynamicFeed size={14} />
                  <span>Publication Name</span>
                </div>
                <div className="pg-select-wrap">
                  <Select
                    options={nameOptions}
                    value={{
                      value: selectedName,
                      label: selectedName === "All" ? "All Names" : selectedName,
                    }}
                    onChange={handleNameChange}
                    styles={selectStyles}
                    classNamePrefix="react-select"
                  />
                </div>
              </div>

              {/* Filter by Language */}
              <div className="pg-filter-card">
                <div className="pg-filter-card-title">
                  <MdOutlineDynamicFeed size={14} />
                  <span>Language</span>
                </div>
                <div className="pg-pills">
                  <button
                    onClick={() => handleLanguageChange({ value: "All" })}
                    className={`pg-pill${selectedLanguage === "All" ? " active" : ""}`}
                  >
                    All
                  </button>
                  {languageOptions.map((option) =>
                    option.value !== "All" && (
                      <button
                        key={option.value}
                        onClick={() => handleLanguageChange(option)}
                        className={`pg-pill${selectedLanguage === option.value ? " active" : ""}`}
                      >
                        {option.label}
                      </button>
                    )
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* ── Section divider ── */}
          <div className="pg-divider">
            <span className="pg-divider-label">Publications</span>
            <div className="pg-divider-rule" />
            {formattedSelectedDate && (
              <span className="pg-selected-date-badge">
                <MdDateRange size={10} />
                {formattedSelectedDate}
              </span>
            )}
            <div className="pg-divider-rule" />
            <span className="pg-divider-count">{filteredLanguages.length} found</span>
          </div>

          {/* ── Publications Grid ── */}
          <div className="pg-publications-wrap">
            <div className="pg-pub-grid">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((item) => (
                  <div
                    key={item.id}
                    className="pg-pub-card"
                    onClick={() => handlePublicationClick(item)}
                  >
                    <div className="pg-pub-card-header">
                      <div className="pg-pub-name">{item.name}</div>
                      <span className={`pg-pub-type-badge ${item.type}`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="pg-pub-img-wrap">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="pg-pub-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="pg-pub-img-placeholder">
                          <span>No Preview</span>
                        </div>
                      )}
                    </div>
                    <div className="pg-pub-footer">
                      <span className="pg-pub-date-label">
                        {formattedSelectedDate || 'Latest Edition'}
                      </span>
                      <span className="pg-pub-open-hint">Open →</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="pg-empty">
                  <div className="pg-empty-glyph">✦</div>
                  <p className="pg-empty-text">No publications match your filters.</p>
                </div>
              )}
            </div>
          </div>

          <hr className="pg-footer-rule" />

          {/* ── PDF Viewer ── */}
          {selectedPublication && (
            <PDFViewer
              selectedPublication={selectedPublication}
              onClose={() => setSelectedPublication(null)}
              scrolled={scrolled}
              selectedDate={passedDate}
            />
          )}

        </div>
      )}
    </>
  );
};

export default Pages;