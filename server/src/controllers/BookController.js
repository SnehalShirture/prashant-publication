import { Book } from "../models/BookSchema.js";

const createBook = async (req, res) => {
    try {
        const { name, author, category, price, publisher, otherPublisher, yearPublished } = req.body;

        const coverImage = req.files.coverImage ? req.files.coverImage[0].path : null;
        const indexImage1 = req.files.indexImage1 ? req.files.indexImage1[0].path : null;
        const indexImage2 = req.files.indexImage2 ? req.files.indexImage2[0].path : null;
        const bookPdf = req.files.bookPdf ? req.files.bookPdf[0].path : null;

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
        res.status(201).json({message:"Book added successfully",book})
    } catch (error) {
        res.status(500).json(error)
    }
}

const getAllBook = async (req, res) => {
    try {
        const book = await Book.find()
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ message: "something went to wrong", error })
    }
}

const updateBook = async (req, res) => {
    try {
        const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Book updated', data: updateBook });
    } catch (error) {
        res.status(404).json({
            message: 'something went to wrong', error
        })
    }
}


const deleteBook = async (req, res) => {
    try {
        const deleteBook = await Book.findByIdAndDelete(req.params.id, {
            new: true
        });
        res.status(201).json({ message: "Book deleted Successfully!", data: deleteBook });
    } catch (error) {
        res.status(400).json({
            message: "Error in deleting the book", error
        })
    }
}

export { createBook, getAllBook ,updateBook,deleteBook};
