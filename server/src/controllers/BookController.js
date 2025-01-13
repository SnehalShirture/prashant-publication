import { Book } from "../models/BookSchema.js";
import fs from "fs";
import { APiResponse } from "../utils/ApiResponse.js";
import axios from "axios";
import path from "path";
import { ServicePrincipalCredentials, PDFServices, CompressPDFJob, CompressPDFResult } from "@adobe/pdfservices-node-sdk"; 


const compressPDF = async (bookPdf) => {

    // Set up credentials
    const credentials = new ServicePrincipalCredentials({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRETS,
    });

    const pdfServices = new PDFServices({ credentials });

    // Upload the original PDF
    const readStream = fs.createReadStream(bookPdf);
    const inputAsset = await pdfServices.upload({
        readStream,
        mimeType: "application/pdf",
    });

    // Compress the PDF
    const job = new CompressPDFJob({ inputAsset });
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
        pollingURL,
        resultType: CompressPDFResult,
    });

    const resultAsset = pdfServicesResponse.result.asset;

    // Fetch the compressed PDF content from _downloadURI
    if (!resultAsset || !resultAsset._downloadURI) {
        throw new Error("Download URI for compressed PDF is not available.");
    }

    const downloadURI = resultAsset._downloadURI;

    // Download the compressed PDF and save it to the local file system
    const compressedPdfFolder = path.join("uploads", "pdf");
    if (!fs.existsSync(compressedPdfFolder)) {
        fs.mkdirSync(compressedPdfFolder, { recursive: true });
    }

    const compressedPdfPath = path.join(compressedPdfFolder, `${Date.now()}_compressed.pdf`);

    const response = await axios({
        method: "GET",
        url: downloadURI,
        responseType: "arraybuffer", 
    });

    // Save the compressed PDF
    fs.writeFileSync(compressedPdfPath, response.data);
    return compressedPdfPath;
}



const createBook = async (req, res) => {
    try {
        const { name, author, category, price, publisher, otherPublisher, yearPublished } = req.body;

        const coverImage = req.files.coverImage ? req.files.coverImage[0].path : null;
        const indexImage1 = req.files.indexImage1 ? req.files.indexImage1[0].path : null;
        const indexImage2 = req.files.indexImage2 ? req.files.indexImage2[0].path : null;
        const bookPdf = req.files?.bookPdf?.[0]?.path || null;

        //const compressedPdfPath = await compressPDF(bookPdf);

        //compressed PDF size
        // const compressedPdfSizeBytes = fs.statSync(compressedPdfPath).size;
        // const compressedPdfSizeMB = (compressedPdfSizeBytes / (1024 * 1024)).toFixed(2);

        // console.log(`Compressed PDF saved to ${compressedPdfPath} with size ${compressedPdfSizeMB} MB.`);
        // fs.unlinkSync(bookPdf);

        const book = await Book.create({
            name,
            author,
            category,
            price,
            publisher,
            otherPublisher,
            yearPublished,
            coverImage,
            indexImage1,
            indexImage2,
            bookPdf,
        })
        res.status(201).json(
            new APiResponse(true, 201, book, "Book added successfully.")
        );
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        console.log(error);
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}

const getAllBook = async (req, res) => {
    try {
        const books = await Book.find()
        res.status(200).json(
            new APiResponse(true, 200, books, "Books fetched successfully.")
        );
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}


const updateBook = async (req, res) => {
    try {
        const updateBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(
            new APiResponse(true, 200, updateBook, "Book updated successfully.")
        );
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}


const deleteBook = async (req, res) => {
    try {
        const deleteBook = await Book.findByIdAndDelete(req.params.id);
        res.status(200).json(
            new APiResponse(true, 200, deleteBook, "Book deleted successfully.")
        );
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}

export { createBook, getAllBook, updateBook, deleteBook };
