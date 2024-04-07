import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Modal from "react-modal";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { RxCross2 } from "react-icons/rx";
import PDFview from "./pdfview";
import Dainik from "/src/assets/Dainik.jpg"
import Hitavada from "/src/assets/Hitavada.jpg"
import Navarashtra from "/src/assets/navarashtra.jpg"
import Lokmat from "/src/assets/LOKMAT.jpg"
import Hindustan from "/src/assets/Hindu Times.jpg"
import Times from "/src/assets/ToI Delhi 07 Apr 2024.pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const newspapers = [
  { id: 1, name: "Lokmat Times", imageUrl: Lokmat, pdfFilePath: Times },
  { id: 2, name: "Hindustan Times", imageUrl: Hindustan, pdfFilePath: Times },
  { id: 3, name: "Dainik Bhaskar", imageUrl: Dainik, pdfFilePath: Times },
  { id: 4, name: "The Hitvada", imageUrl: Hitavada, pdfFilePath: Times },
  { id: 5, name: "navarashtra", imageUrl: Navarashtra, pdfFilePath: Times },
];

const Pages = () => {
  const [selectedNewspaper, setSelectedNewspaper] = useState(null);

  const handleNewspaperClick = (newspaper) => {
    setSelectedNewspaper(newspaper); // Set the selected newspaper
  };

  return (
    <div className="dark:bg-[#111010] min-h-screen relative">
      <div className="first container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newspapers.map((newspaper) => (
            <div
              key={newspaper.id}
              className="rounded-md overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleNewspaperClick(newspaper)}
            >
              <div className="p-4">
              <h3 className="dark:text-white text-black text-xl text-center mr-20 font-semibold capitalize mt-4 transition-all duration-300 hover:text-blue-500 transform hover:scale-105">{newspaper.name}</h3>
              </div>
              <img src={newspaper.imageUrl} alt={newspaper.name} className="w-3/4 h-auto" />
            </div>
          ))}
        </div>
        <PDFModal selectedNewspaper={selectedNewspaper} onClose={() => setSelectedNewspaper(null)} />
      </div>
    </div>
  );
};

const PDFModal = ({ selectedNewspaper, onClose }) => {
  return (
    <Modal
      isOpen={selectedNewspaper !== null}
      onRequestClose={onClose}
      contentLabel="PDF Modal"
      ariaHideApp={false} 
      style={{
        content: {
          width: '80%', 
          height: '100%',
          margin: 'auto', 
        }
      }}
    >
      <button onClick={onClose}><RxCross2 className="absolute right-4 top-4 hover:bg-gray-300 rounded-full text-red-600 text-3xl"/></button>
      {selectedNewspaper && <PDFview pdfFiles={selectedNewspaper.pdfFilePath} />}
    </Modal>
  );
};


export default Pages;
