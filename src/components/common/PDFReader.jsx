import React, { useRef, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import axios from "axios";

const PDFReader = ({ fileUrl,  sessionId, onClose }) => {

  const [pagesRead, setPagesRead] = useState(0);
  const currentPageRef = useRef(null);
  const readTimer = useRef(null);


  const handlePageChange = async (event) => {
    const currentPage = event.currentPage;

    if (readTimer.current) {
      clearTimeout(readTimer.current);
    }
    readTimer.current = setTimeout(() => {
      if (currentPageRef.current !== currentPage) {
        currentPageRef.current = currentPage;
        setPagesRead((prev) => prev + 1);
      }
    }, 2000);
  };



  const handleClose = async () => {
    console.log(sessionId);
    try {
     const res= await axios.post("http://localhost:5000/api/updatePageCounter", {
         sessionId, pagesRead
      })
      console.log(res)
      console.log("progress updated", pagesRead)
    } catch (error) {
      console.log("error", error.message)
    }
    onClose();
  }


  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "white", zIndex: 1000 }}>
      <button onClick={handleClose}>Close</button>
    
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js" >
        <Viewer fileUrl={fileUrl} onPageChange={handlePageChange} />
      </Worker>
      
    </div >
  );
};

export default PDFReader;