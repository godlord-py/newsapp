import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { BiSolidNews } from "react-icons/bi";
import { MdOutlineDynamicFeed } from "react-icons/md";
import PDFview from "./pdfview";
import "aos/dist/aos.css";
import AOS from "aos";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '/src/styles/Pages.css'; 

const Pages = () => {
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedName, setSelectedName] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false); // New state variable to track scrolling

  useEffect(() => {
    fetchPublications();
    AOS.init({
      duration: 1000,
      once: false,
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
    setSelectedDate("");
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedName("All");
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleNameChange = (e) => {
    setSelectedName(e.target.value);
  };

  const filteredPublications =
  selectedType === "All"
    ? publications
    : selectedType === "newspaper"
    ? publications.filter((item) => item.type === "newspaper")
    : publications.filter((item) => item.type === "magazine");

  const filteredNames =
    selectedName === "All"
      ? filteredPublications
      : filteredPublications.filter((item) => item.name === selectedName);

  const dates = selectedPublication ? selectedPublication.dates : [];

  
  // Use a ref to access the container where the publication content is displayed
  const publicationContainerRef = useRef(null);

  const handleCrossButtonClick = () => {
    // Scroll the container to the top
    publicationContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedPublication(null);
  };
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="dark:bg-[#111010] min-h-screen relative">
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1000"
            className="first container mx-auto flex flex-wrap"
          >
            <div className="mobilesearch flex-direction">
              <span className="flex mb-2 mr-10 font-semibold">
                <BiSolidNews className="mr-2 text-2xl" />
                Filter by Type
              </span>
              <select
                value={selectedType}
                onChange={handleTypeChange}
                className="w-40 mr-10 p-2 border-2 border-gray-400 rounded-xl"
              >
                <option value="All">All Types</option>
                <option value="newspaper">Newspapers</option>
                <option value="magazine">Magazines</option>
              </select>
            </div>
            <div className="mobilesearch mb-10 flex-direction">
              <span className="flex mb-2 font-semibold">
                <MdOutlineDynamicFeed className="mr-2 text-2xl" />
                Filter by Name
              </span>
              <select
                value={selectedName}
                onChange={handleNameChange}
                className="w-40 p-2 border-2 border-gray-400 rounded-xl"
              >
                <option value="All">All Names</option>
                {filteredPublications.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mobilegrid w-11/12 ml-4 grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredNames.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handlePublicationClick(item)}
                >
                  <div className="">
                    <h3 className="dark:text-white text-black text-3xl py-2 text-center font-semibold capitalize mt-4 transition-all duration-300 dark:hover:text-blue-500 hover:text-blue-500 transform hover:scale-105">
                      {item.name}
                    </h3>
                  </div>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
          {selectedPublication && (
              <div ref={publicationContainerRef} className={`mobilepdf fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-scroll ${scrolled ? 'scrolled' : ''}`}>
                <button
                  id="cross-button"
                  onClick={handleCrossButtonClick}
                  className={`absolute top-8 right-10 bg-gray-300 hover:bg-gray-200 rounded-full text-red-600 text-3xl px-3 py-2 ${scrolled ? 'floating' : ''}`}
                >
                  <RxCross2 />
              </button>
              <div className="max-w-screen-lg py-8">
                <div className="mb-4">
                  <span className="mr-2 ml-4 text-black font-semibold">
                    Filter by Date:
                  </span>
                  <select
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-3/2 p-2 ml-2 border-2 border-gray-400 rounded-xl"
                  >
                    <option value="">Select Date</option>
                    {dates.map((date, index) => (
                      <option key={index} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
                <h3 className="text-3xl text-black ml-3 font-semibold mb-4">
                  {selectedPublication.name}
                </h3>
                {selectedDate ? (
                  selectedPublication.pdfFiles.find(
                    (file) => file.date === selectedDate
                  ) ? (
                    <PDFview
                    onLoadSuccess={undefined}
                      pdfFiles={selectedPublication.pdfFiles.find(
                        (file) => file.date === selectedDate
                      ).path}
                    />
                  ) : (
                    <p className="text-4xl ml-96 text-black font-serif text-center">
                      ⚫No publication available for the selected date, Stay
                      Tuned.
                    </p>
                  )
                ) : (
                  <p className="text-4xl ml-96 text-black font-serif text-center">
                    ⚫Please select a date.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Pages;
