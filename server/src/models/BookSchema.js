import mongoose from "mongoose";

const BookSchema = mongoose.Schema({
    name: { type: String, },
    author: { type: String, },
    category: { type: String, },
    price: { type: String, },
    publisher: { type: String, },
    otherPublisher: { type: String },
    yearPublished: { type: Number, },
    coverImage: { type: String },
    indexImage1: { type: String },
    indexImage2: { type: String },
    bookPdf: { type: String }

});

export const Book = mongoose.model('Book', BookSchema);
