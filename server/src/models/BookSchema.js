import mongoose from "mongoose";

const BookSchema = mongoose.Schema({
    subjectCode: { type: String },
    name: { type: String, required: true },
    author: { type: String, required: true },
    category: {
        type: String, required: true,
        enum: ["arts", "commerce", "science"]
    },
    price: { type: String, required: true },
    publisher: { type: String, required: true },
    otherPublisher: { type: String },
    yearPublished: { type: Number, required: true },
    coverImage: { type: String, required: true },
    indexImage1: { type: String, required: true },
    indexImage2: { type: String, required: true },
    bookPdf: { type: String, required: true },
    academicYear: {
        type: String,
        enum: ["FY", "SY", "TY"]
    },
    currentSemester: { type: String, },
    university: { type: String },
    type: { type: String, enum: ["textbook", "reference"] }
});



BookSchema.post("save", async function (doc, next) {
    try {
        const { category, academicYear, type, _id } = doc;

        if (type === "textbook") {
            await mongoose.model("Package").updateMany(
                { category, academicYear },
                { $addToSet: { booksIncluded: _id } }
            );
        }
    } catch (error) {
        return next(error);
    }
    next();
});


// Pre-remove middleware to update packages when a book is deleted
BookSchema.pre("findOneAndDelete", async function (next) {
    try {
        const bookId = this.getQuery()._id;
        await mongoose.model("Package").updateMany(
            {},
            { $pull: { booksIncluded: bookId } }
        );

        await mongoose.model("Bookshelf").updateMany(
            {},
            { $pull: { books: bookId } }
        );

    } catch (error) {
        return next(error);
    }
    next();
});

export const Book = mongoose.model('Book', BookSchema);
