import mongoose from "mongoose";

const BookSchema = mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    publisher: { type: String, required: true },
    otherPublisher: { type: String },
    yearPublished: { type: Number, required: true },
    coverImage: { type: String, required: true },
    indexImage1: { type: String, required: true },
    indexImage2: { type: String, required: true },
    bookPdf: { type: String, required: true }

});

export const Book = mongoose.model('Book', BookSchema);
