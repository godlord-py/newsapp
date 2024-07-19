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
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
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
   
    AOS.init({
      duration: 1000,
      once: false,
    });

    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      setSelectedDate(new Date(savedDate));
      setPassedDate(new Date(savedDate));
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (window.pageYOffset > 100) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  
  useEffect(() => {
    const handleOverflow = () => {
      document.body.style.overflow = selectedPublication ? 'hidden' : 'unset';
    };
  
    handleOverflow();
  
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPublication]);
  
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/newspapers');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

    return (
      <>
        {loading ? (
          !isMobile ? (
            <PagesSkeleton />
          ) : (
            <div className="flex justify-center items-center h-screen">
              <CircularProgress className="text-blue-500" />
            </div>
          )
        ) : (
          <div className="min-h-screen bg-gray-100 dark:bg-[#111010] py-12">
            <div className="blurup z-0"></div>
            <div className="container z-50 mx-auto px-4">
              <h1 className="text-4xl font-bold text-center z-[100] text-gray-900 dark:text-white mb-12 font-custom3">
                Explore Newspapers & Magazines
              </h1>
              <p className="flex justify-center font-custom3 mb-12 text-lg dark:text-yellow-500 text-slate-900">Stay updated with the latest news & stay one step ahead! </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Filter by Type */}
                <div className="bg-gray-300 z-40 dark:bg-gray-800 rounded-lg shadow-md p-6 dark:bg-opacity-40 backdrop-blur-3xl">
                  <div className="flex items-center mb-4">
                    <BiSolidNews className="text-2xl text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Filter by Type
                    </h2>
                  </div>
                  <div className="flex flex-wrap -m-1">
                    <button
                      onClick={() => handleTypeChange({ value: "All" })}
                      className={`m-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        ${selectedType === "All"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                      All Types
                    </button>
                    {options.map((option) =>
                      option.value !== "All" && (
                        <button
                          key={option.value}
                          onClick={() => handleTypeChange(option)}
                          className={`m-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                            ${selectedType === option.value
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            }`}
                        >
                          {option.label}
                        </button>
                      )
                    )}
                  </div>
                </div>
    
                {/* Filter by Date */}
                <div className="bg-gray-300 dark:bg-gray-800 z-40 rounded-lg shadow-md p-6 dark:bg-opacity-40 backdrop-blur-3xl">
                  <div className="flex items-center mb-4">
                    <MdDateRange className="text-2xl text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Filter by Date
                    </h2>
                  </div>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    includeDates={availableDates}
                    placeholderText="Select a date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
    
                {/* Filter by Name */}
                <div className="bg-gray-300 dark:bg-gray-800 rounded-lg shadow-md p-6 dark:bg-opacity-40 backdrop-blur-3xl">
                  <div className="flex items-center mb-4">
                    <MdOutlineDynamicFeed className="text-2xl text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900 z-50 dark:text-white">
                      Filter by Name
                    </h2>
                  </div>
                  <Select
                    options={nameOptions}
                    value={{
                      value: selectedName,
                      label: selectedName === "All" ? "All Names" : selectedName,
                    }}
                    onChange={handleNameChange}
                    className="w-full border border-gray-300 z-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
    
                {/* Filter by Language */}
                <div className="bg-gray-300 dark:bg-gray-800 rounded-lg shadow-md p-6 dark:bg-opacity-40 backdrop-blur-3xl">
                  <div className="flex items-center mb-4">
                    <MdOutlineDynamicFeed className="text-2xl text-blue-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white ">
                      Filter by Language
                    </h2>
                  </div>
                  <div className="flex flex-wrap -m-1">
                    <button
                      onClick={() => handleLanguageChange({ value: "All" })}
                      className={`m-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        ${selectedLanguage === "All"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                      All Languages
                    </button>
                    {languageOptions.map((option) =>
                      option.value !== "All" && (
                        <button
                          key={option.value}
                          onClick={() => handleLanguageChange(option)}
                          className={`m-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                            ${selectedLanguage === option.value
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            }`}
                        >
                          {option.label}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
    
            <hr className="w-full  px-4 mt-20 border-t-4 pt-8 border-black dark:border-white"></hr>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredLanguages.map((item) => (
                <div
                  key={item.id}
                  className=" rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 bg-gray-300 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg"
                  onClick={() => handlePublicationClick(item)}
                >
                  {formattedSelectedDate && (
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      Selected Date: {formattedSelectedDate}
                    </span>
                  )}
                  <h3 className="p-2 text-lg sm:text-3xl text-center font-semibold capitalize transition-all duration-300 text-gray-800 dark:text-white hover:text-blue-500 transform hover:scale-105">
                    {item.name}
                  </h3>
                  <img src={item.imageUrl} alt={item.name} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        {/* PDF UI */}
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


