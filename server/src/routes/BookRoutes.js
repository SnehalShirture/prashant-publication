import express from 'express'
import { createBook, getAllBook, updateBook, deleteBook } from '../controllers/BookController.js'
import { upload } from '../middleware/MulterMiddleware.js';
import { authenticate } from '../middleware/auth.js';

const bookRouter = express.Router()

const uploadFields = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'indexImage1', maxCount: 1 },
    { name: 'indexImage2', maxCount: 1 },
    { name: 'bookPdf', maxCount: 1 },
]);
bookRouter.post("/addBook", uploadFields, createBook);
bookRouter.get("/getBook", getAllBook);
bookRouter.get("/updateBook", authenticate, updateBook);
bookRouter.post("/deleteBook", authenticate, deleteBook);

export { bookRouter }