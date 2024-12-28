import mongoose from "mongoose";
import validator from 'validator'

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, 
            required: true,
            unique: true,
            index: true,
            validate: [validator.isEmail, "Invalid Email Address"]
    },
    password: { type: String, required: true },
    mobile: { type: String, 
            minLength: [10, "no should have minimum 10 digit"],
            maxLength: [10, "no should have maximum 10 digit"],
            match: [/\d{10}/, "no should only have digit"],
            required: true,
            unique: true,
    },
    isBLock: { type: Boolean, default: false },
    role: { type: String, enum: ["SuperAdmin", "CollegeAdmin"] },
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
})

export const User = mongoose.model("User", UserSchema)
