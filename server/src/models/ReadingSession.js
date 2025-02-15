import mongoose from "mongoose";

const ReadingSessionSchema = mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College"
    },
    startedAt: {
        type: Date,
        default: Date.now(),
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});

export const ReadingSession = mongoose.model("ReadingSession", ReadingSessionSchema)