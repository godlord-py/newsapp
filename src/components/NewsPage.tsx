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
import PDFViewer from "./PDFviewer";

const Pages = () => {
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedName, setSelectedName] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  const publicationContainerRef = useRef(null);

  const handleCrossButtonClick = () => {
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
                className="w-60 mr-10 p-2 border-2 border-gray-400 rounded-xl"
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
                className="searchname w-60 p-2 border-2 border-gray-400 rounded-xl"
              >
                <option value="All">All Names</option>
                {filteredPublications.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mobilegrid w-11/12 ml-4 grid grid-cols-1 md:grid-cols-4 gap-8">
              {filteredNames.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg"
                  onClick={() => handlePublicationClick(item)}
                >
                  <h3 className="p-4 text-3xl text-center font-semibold capitalize transition-all duration-300 text-gray-800 dark:text-white hover:text-blue-500 transform hover:scale-105">
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
            />
          )}
        </div>
            )}
          </>
        );
      };

export default Pages;
 