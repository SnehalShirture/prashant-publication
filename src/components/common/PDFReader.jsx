import React, { useRef, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { zoomPlugin } from "@react-pdf-viewer/zoom"; // Correct import for zoom plugin
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close"; // Importing Material UI close icon
import { DisableScreenshot } from "../../App";

const PDFReader = ({ fileUrl, sessionId, onClose }) => {
    
    const zoomPluginInstance = zoomPlugin();
    const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

    const [pagesRead, setPagesRead] = useState(0);
    const currentPageRef = useRef(null);
    const readTimer = useRef(null);

    const handlePageChange = (event) => {
        const currentPage = event.currentPage;

        if (readTimer.current) {
            clearTimeout(readTimer.current);
        }

        readTimer.current = setTimeout(() => {
            if (currentPageRef.current !== currentPage) {
                currentPageRef.current = currentPage;
                setPagesRead((prev) => prev + 1);
            }
        }, 2000); // Trigger after 2 seconds of inactivity
    };

    const handleClose = async () => {
        console.log(sessionId);
        try {
            const res = await axios.post("http://localhost:5000/api/updatePageCounter", {
                sessionId,
                pagesRead,
            });
            console.log(res);
            console.log("Progress updated", pagesRead);
        } catch (error) {
            console.error("Error updating progress", error.message);
        }
        onClose();
    };

    return (
        <>
        <DisableScreenshot/>
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "white",
                zIndex: 1000,
                padding: "10px",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        cursor: "pointer",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "50%",
                        padding: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onClick={handleClose}
                >
                    <CloseIcon style={{ fontSize: "24px", color: "#000" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <ZoomOutButton />
                    <ZoomPopover />
                    <ZoomInButton />
                </div>
            </div>

            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={fileUrl} onPageChange={handlePageChange} plugins={[zoomPluginInstance]} />
            </Worker>
        </div>
        </>
    );
};

export default PDFReader;
