import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { BiSolidNews } from "react-icons/bi";
import { MdOutlineDynamicFeed } from "react-icons/md";
import PDFview from "./pdfview";
import "aos/dist/aos.css";
import AOS from "aos";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "/src/styles/Pages.css";
import PDFViewer from "./PDFviewer";
import Select from "react-select";
const Pages = () => {
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedName, setSelectedName] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPublications();
    AOS.init({
      duration: 1000,
      once: false,
    });

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

  const handleTypeChange = (option) => {
    if (option) {
      setSelectedType(option.value);
    } else {
      // Handle case where no option is selected (optional)
      setSelectedType("All"); // Or any default value from options
    }
    setSelectedName("All"); // Reset selectedName when type changes
  };
  

  const handleNameChange = (option) => {
    setSelectedName(option.value);
  };

  const filteredPublications =
  selectedType === "All"
    ? publications // Return all publications when "All Types" is selected
    : publications.filter((item) => item.type === selectedType);


  const filteredNames =
    selectedName === "All"
      ? filteredPublications
      : filteredPublications.filter((item) => item.name === selectedName);
  const dates = selectedPublication ? selectedPublication.dates : [];

  const publicationContainerRef = useRef(null);

  const handleCrossButtonClick = () => {
    publicationContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedPublication(null);
  };
  const options = [
    { value: "All", label: "All Types" }, 
    { value: "newspaper", label: "Newspaper"}, 
    { value: "magazine", label: "Magazine" }, 
  ];
  
  const nameOptions = [
    { value: "All", label: "All Names" },
    ...(selectedType === "All"
      ? publications
      : publications.filter((item) => item.type === selectedType)
    ).map((name) => ({ value: name.name, label: name.name })),
  ];
  
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
            className="container mx-auto flex flex-wrap"
          >
            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="flex items-center mb-4">
                <BiSolidNews className="text-2xl dark:text-white text-gray-600 mr-2" />
                <span className="text-gray-800 dark:text-white  font-semibold">
                  Filter by Type
                </span>
              </div>
              <Select
                  options={options}
                  value={{ value: selectedType, label: selectedType === "All" ? "All Types" : selectedType }}
                  onChange={handleTypeChange}
                  className="w-full border dark:text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="flex  items-center mb-4">
                <MdOutlineDynamicFeed className="text-2xl dark:text-white text-gray-600 mr-2" />
                <span className="text-gray-800 dark:text-white font-semibold">
                  Filter by Name
                </span>
              </div>
              <Select
                options={nameOptions}
                value={{ value: selectedName, label: selectedName === "All" ? "All Names" : selectedName }}
                onChange={handleNameChange}
                className="w-full border dark:text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full px-4">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredNames.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-50 backdrop-filter backdrop-blur-lg"
                    onClick={() => handlePublicationClick(item)}
                  >
                    <h3 className="p-4 text-3xl text-center font-semibold capitalize transition-all duration-300 text-gray-800 dark:text-white hover:text-blue-500 transform hover:scale-105">
                      {item.name}
                    </h3>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-auto"
                    />
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
            />
          )}
        </div>
      )}
    </>
  );
};

export default Pages;