import mongoose from "mongoose";
import validator from 'validator'

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: [validator.isEmail, "Invalid Email Address"]
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
        minLength: [10, "number should have minimum 10 digit"],
        maxLength: [10, "number should have maximum 10 digit"],
        match: [/\d{10}/, "number should only have digit"],
        required: true,
        unique: true,
    },
    isBLock: { type: Boolean, default: false },
    role: { type: String, enum: ["SuperAdmin", "CollegeAdmin", "user"] },
    totalRevenue: { type: Number, default: 0 },
    bookShelf: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",

        }
    ],
    // MACAddress: [
    //     {
    //         type: String,
    //     }
    // ]

    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College"
    }
    
})

export const User = mongoose.model("User", UserSchema)
