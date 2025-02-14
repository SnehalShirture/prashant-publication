import mongoose from "mongoose";

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
        { type: mongoose.Schema.Types.ObjectId }
    ],
    prices: [
        {
            maxReaders: { type: Number },
            Price: { type: Number }
        }
    ]
})

export const Package = mongoose.model("Package", PackageSchema)