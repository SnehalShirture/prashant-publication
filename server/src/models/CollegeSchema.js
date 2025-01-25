import mongoose from "mongoose";

const CollegeSchema = mongoose.Schema({
    clgName: {
        type: String,
        required: true
    },
    clgStream: {
        type: String,
        required: true
    },
    clgAddress: {
        type: String,
        required: true
    },
    directorName: {
        
        type: String,
        required: true
    },
    librarianName: {
        type: String,
        required: true
    },
    librarianMobile: {
        type: String,
        required: true
    },
    librarianEmail: {
        type: String,
        required: true
    }
})

export const College = mongoose.model("College", CollegeSchema)