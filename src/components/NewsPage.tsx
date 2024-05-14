import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { BiSolidNews } from "react-icons/bi";
import { MdOutlineDynamicFeed } from "react-icons/md";
import "aos/dist/aos.css";
import AOS from "aos";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "/src/styles/Pages.css";
import PDFViewer from "./PDFviewer";
import Select from "react-select";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdDateRange } from "react-icons/md";
import PagesSkeleton from "./UI/Pagesskeleton";
import { CircularProgress } from "@nextui-org/react";

const Pages = () => {
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedName, setSelectedName] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedType, setSelectedType] = useState("All");
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [passedDate, setPassedDate] = useState(null);
  const isMobile = window.innerWidth <= 600;
  
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
    fetchPublications();
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

  const fetchPublications = async () => {
    try {
      const response = await fetch("/newspapers.json");
      const data = await response.json();
      setPublications(data.newspapers.concat(data.magazines));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching publications:", error);
      setLoading(false);
    }
  };

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

  const formattedSelectedDate =
    selectedDate &&
    selectedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });


  const filteredPublications =
    selectedType === "All"
      ? publications
      : publications.filter((item) => item.type === selectedType);



      const filteredByDate = selectedDate
      ? publications.filter((item) =>
          item.dates.some((date) => new Date(date).toDateString() === selectedDate.toDateString())
        )
      : publications;

      const filteredByType = selectedType === "All" ? filteredByDate : filteredByDate.filter((item) => item.type === selectedType);
      const filteredNames = selectedName === "All" ? filteredByType : filteredByType.filter((item) => item.name === selectedName);
          
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
  const availableDates = publications.reduce((dates, publication) => {
    return dates.concat(publication.dates.map((date) => new Date(date)));
  }, []);
  return (
    <>
    
      {loading ? (
       !isMobile ? <PagesSkeleton /> : <CircularProgress className="mb-[600px] ml-44 mt-64" />
      ) : (
        <div className="dark:bg-[#111010] min-h-screen relative">
          <h1 className="text-3xl mt-6 md:text-4xl font-bold text-center dark:text-white mb-8 font-custom3">
              Explore Newspapers & Magazines
          </h1>
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1000"
            className="container mx-auto flex flex-wrap">
            <div className="w-full mt-8 md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="mobiletype flex items-center mb-4">
                <BiSolidNews className="text-2xl dark:text-white text-gray-600 mr-2" />
                <span className="text-gray-800 dark:text-white font-semibold">
                  Filter by Type
                </span>
              </div>
              <Select
                options={options}
                value={{
                  value: selectedType,
                  label: selectedType === "All" ? "All Types" : selectedType,
                }}
                onChange={handleTypeChange}
                className="w-3/2 border dark:text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2 mt-8 ml-4 md:w-1/4 lg:w-1/4 sm:px-12 mb-8">
              <div className="flex items-center mb-4">
                <MdDateRange className="text-2xl dark:text-white text-gray-600 mr-2" />
                <span className="mobiledate mr-2 text-gray-800 dark:text-white font-semibold">
                  Filter by Date:
                </span>
              </div>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                includeDates={availableDates}
                placeholderText="Select a date"
                className="mobiledate w-3/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full mt-8 md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="flex  items-center mb-4">
                <MdOutlineDynamicFeed className="text-2xl dark:text-white text-gray-600 mr-2" />
                <span className="text-gray-800 dark:text-white font-semibold">
                  Filter by Name
                </span>
              </div>
              <Select
                options={nameOptions}
                value={{
                  value: selectedName,
                  label: selectedName === "All" ? "All Names" : selectedName,
                }}
                onChange={handleNameChange}
                className="w-3/2 border dark:text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full px-4 border-t pt-8">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredNames.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 bg-gray-300 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg"
                  onClick={() => handlePublicationClick(item)}
                >
                   {formattedSelectedDate && (
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      Selected Date: {formattedSelectedDate}
                    </span>
                  )}
                  <h3 className="p-4 text-lg sm:text-3xl text-center font-semibold capitalize transition-all duration-300 text-gray-800 dark:text-white hover:text-blue-500 transform hover:scale-105">
                    {item.name}
                  </h3>
                  <img src={item.imageUrl} alt={item.name} className="w-full h-auto" />
                </div>
              ))}
            </div>
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