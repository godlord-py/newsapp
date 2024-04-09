import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { RxCross2 } from "react-icons/rx";
import { BiSolidNews } from "react-icons/bi";
import PDFview from "./pdfview";
import Dainik from "/src/assets/Dainik.jpg"
import Hitavada from "/src/assets/Hitavada.jpg"
import Lokmat from "/src/assets/LOKMAT.jpg"
import Hindustan from "/src/assets/Hindu Times.jpg"
import Times1 from "/src/assets/ToI Delhi 07 Apr 2024.pdf"
import Times2 from "/src/assets/ToI Delhi 07 Apr 2024.pdf"
import Times3 from "/src/assets/ToI Delhi 07 Apr 2024.pdf"
import Times4 from "/src/assets/ToI Delhi 07 Apr 2024.pdf"
import Navarashtra from "/src/assets/Navbharat.jpg"
import Marathi from "/src/assets/Marathi.jpg"
import Das from "/src/assets/DAA 7th.pdf"
import NavBar from "../layouts/Navbar";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const newspapers = [
  { id: 1, name: "Lokmat Times", imageUrl: Lokmat, dates: ["2024-04-07", "2024-04-08", "2024-04-09", "2024-04-10"], pdfFiles: [{ date: "2024-04-07", path: Das }, { date: "2024-04-08", path: Times2 }, { date: "2024-04-09", path: Times3 }] },
  { id: 2, name: "Hindustan Times", imageUrl: Hindustan, dates: ["2024-04-07"], pdfFiles: [{ date: "2024-04-07", path: Times1 }, { date: "2024-04-08", path: Times2 }] },
  { id: 3, name: "Dainik Bhaskar", imageUrl: Dainik, dates: ["2024-04-07"], pdfFiles: [{ date: "2024-04-07", path: Times1 }, { date: "2024-04-08", path: Times2 }] },
  { id: 4, name: "The Hitvada", imageUrl: Hitavada, dates: ["2024-04-08", "2024-04-09", "2024-04-10"], pdfFiles: [{ date: "2024-04-08", path: Das }, { date: "2024-04-09", path: Times2 }, { date: "2024-04-10", path: Times3 }, { date: "2024-04-11", path: Times4 }] },
  { id: 5, name: "Navarashtra", imageUrl: Navarashtra, dates: ["2024-04-06"], pdfFiles: [{ date: "2024-04-06", path: Times1 }, { date: "2024-04-07", path: Times2 }] },
  { id: 6, name: "Maharashtra Times", imageUrl: Marathi, dates: ["2024-04-06"], pdfFiles: [{ date: "2024-04-06", path: Times1 }, { date: "2024-04-07", path: Times2 }] },
];

const Pages = () => {
  const [selectedNewspaper, setSelectedNewspaper] = useState(null);
  const [selectedName, setSelectedName] = useState("All");
  const [selectedDate, setSelectedDate] = useState(""); // Initialize as an empty string

  const handleNewspaperClick = (newspaper) => {
    setSelectedNewspaper(newspaper); // Set the selected newspaper
    setSelectedDate(""); // Reset selected date when a new newspaper is selected
  };

  const handleDropdownChange = (e) => {
    setSelectedName(e.target.value); // Set the selected newspaper name
    setSelectedDate(""); // Reset selected date when a newspaper filter changes
    setSelectedNewspaper(null); // Reset selected newspaper when the filter changes
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value); // Set the selected date
  };

  const filteredNewspapers = selectedName === "All" ?
    newspapers :
    newspapers.filter((newspaper) => newspaper.name === selectedName);

  const dates = selectedNewspaper ? selectedNewspaper.dates : [];

  return (
    <>
    <div className="dark:bg-[#111010] min-h-screen relative">
      <div className="first container mx-auto">
        <div className="mb-4">
          <span className="flex mr-2 mb-2 font-semibold"><BiSolidNews className="mr-2 text-2xl" />Filter by Newspaper</span>
          <select
            value={selectedName}
            onChange={handleDropdownChange}
            className="w-3/2 p-2 border-2 border-gray-400 rounded-xl"
          >
            <option value="All">All Newspapers</option>
            {newspapers.map((newspaper) => (
              <option key={newspaper.id} value={newspaper.name}>
                {newspaper.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mobilegrid w-11/12 ml-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredNewspapers.map((newspaper) => (
            <div
              key={newspaper.id}
              className="rounded-md overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleNewspaperClick(newspaper)}
            >
              <div className="">
                <h3 className="dark:text-white text-black text-3xl py-2 text-center font-semibold capitalize mt-4 transition-all duration-300 dark:hover:text-blue-500 hover:text-blue-500 transform hover:scale-105">{newspaper.name}</h3>
              </div>
              <img src={newspaper.imageUrl} alt={newspaper.name} className="w-full h-auto" />
            </div>
          ))}
        </div>
      </div>
      {selectedNewspaper && (
        <div className="mobilepdf fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-scroll">
          <button
            onClick={() => setSelectedNewspaper(null)}
            className="absolute top-8 right-10 bg-gray-200 hover:bg-gray-300 rounded-full text-red-600 text-3xl px-3 py-2"
          >
            <RxCross2 />
          </button>
          <div className="max-w-screen-lg py-8">
            <div className="mb-4">
              <span className="mr-2 font-semibold">Filter by Date:</span>
              <select
                value={selectedDate}
                onChange={handleDateChange}
                className="w-3/2 p-2 border-2 border-gray-400 rounded-xl"
              >
                <option value="">Select Date</option>
                {dates.map((date, index) => (
                  <option key={index} value={date}>{date}</option>
                ))}
              </select>
            </div>
            <h3 className="text-3xl font-semibold mb-4">{selectedNewspaper.name}</h3>
            {selectedDate ? (
              selectedNewspaper.pdfFiles.find((file) => file.date === selectedDate) ? (
                <PDFview pdfFiles={selectedNewspaper.pdfFiles.find((file) => file.date === selectedDate).path} />
              ) : (
                <p className="text-4xl text-black font-serif text-center">⚫No newspaper available for the selected date, Stay Tuned.</p>
              )
            ) : (
              <p className="text-4xl text-black font-serif text-center">⚫Please select a date.</p>
            )}
          </div>
        </div>
      )}
    </div></>
  );
};

export default Pages;
