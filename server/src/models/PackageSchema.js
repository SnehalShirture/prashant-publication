import mongoose from "mongoose";
import { Book } from "./BookSchema.js";

const PackageSchema = mongoose.Schema({
    category: {
        type: String,
        enum: ["arts", "commerce", "science"]
    },
    academicYear: {
        type: String,
        enum: ["FY", "SY", "TY"]
    },
    isActive: {
        type: Boolean,
    },
    booksIncluded: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: "Book"
        }
    ],
    prices: [
        {
            maxReaders: { type: Number },
            Price: { type: Number }
        }
    ]
})



// Pre-save middleware to populate booksIncluded before saving
PackageSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("category") || this.isModified("academicYear")) {
        try {
            // Find books that match the category and academicYear
            const books = await Book.find({ category: this.category, academicYear: this.academicYear }).select("_id");
            this.booksIncluded = books.map(book => book._id);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

export const Package = mongoose.model("Package", PackageSchema)