import mongoose from "mongoose";

const SessionSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    loginTime: {
        type: Date,
        default: new Date(),
    },
    logoutTime: {
        type: Date,
    },
    ipAddress: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,  // Indicates if the session is active
    },
}   
)

export const Session=mongoose.model("Session",SessionSchema);
