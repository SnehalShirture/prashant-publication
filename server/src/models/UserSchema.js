import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    mobile: { type: String },
    isBLock: { type: Boolean, default: false },
    role: { type: String, enum: ["SuperAdmin", "CollegeAdmin"] },
    totalRevenue: { type: Number, default: 0 },
    bookShelf: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",

        }
    ],
    MACAddress: [
        {
            type: String,
        }
    ]
})

export const User = mongoose.model("User", UserSchema)
