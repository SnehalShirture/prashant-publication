import { User } from '../models/UserSchema.js'
import { createSession } from './SessionController.js';
import jwt from 'jsonwebtoken'
import { Session } from '../models/SessionSchema.js';
import bcrypt from 'bcrypt'
import { sendMessage } from '../middleware/MessageMiddleware.js';
import { ApiError } from '../utils/ApiError.js';
import { BadReqError } from '../utils/BadReqError.js';
import { APiResponse } from '../utils/ApiResponse.js';

const registerUser = async (req, res) => {
    try {
        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword

        const newUser = await User.create(req.body);
        console.log(newUser);
        res.status(200).json(new APiResponse(true, 200, newUser, "user created successfully.."));
    } catch (error) {

        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
};


const getUser = async (req, res) => {
    try {
        const users = await User.find().populate("bookShelf")
        res.status(201).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const userLogin = async (req, res) => {
    try {
        const { email, password, ipAddress, userAgent } = req.body;

        const user = await User.findOne({ email })
        if (!user) {
            throw new ApiError("Invalid email or password", 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new ApiError("Invalid email or password", 401);

        const sessionResponse = await createSession({
            userId: user._id,
            ipAddress,
            userAgent,
        });

        if (!sessionResponse.success) {
            throw new ApiError(sessionResponse.message, 403);
        }

        const populatedSession = await sessionResponse.session.populate("user_id");
        // Generate token
        const token = jwt.sign({ userId: user._id }, 'Secret Key', { expiresIn: '1d' });

        res.status(200).json(new APiResponse(true, 200,
            {
                token,
                session: populatedSession,
            },
            "Login successful"
        ));
    } catch (error) {

        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
};

const userLogout = async (req, res) => {
    try {
        const { userId } = req.body;

        const session = await Session.findOneAndUpdate(
            { user_id: userId, isActive: true },
            {
                isActive: false,
                logoutTime: new Date(),
            },
            { new: true }
        );

        if (!session) {
            throw new ApiError("No active session found.", 400);
        }

        res.status(200).json(new APiResponse(true, 200, null, "Successfully logged out."));

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An error occurred during logout.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
};

const addBookToShelf = async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { bookShelf: bookId } },
            { new: true }
        ).populate('bookShelf');

        if (!user) throw new ApiError("User not found.", 404);

        res.status(200).json(new APiResponse(true, 200, { user }, "Book added to shelf."));

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "Error adding book to shelf.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}


const sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) throw new ApiError("User not found.", 404);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 15 * 60 * 1000;
        await user.save();
        const message = `Your OTP is ${otp}. It will expire in 15 minutes`;
        const info = await sendMessage(user.email, message);
        res.status(200).json(new APiResponse(true, 200, null, "OTP sent successfully."));

    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred while sending OTP.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) throw new ApiError("User not found.", 404);

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            throw new ApiError("Invalid or expired OTP.", 400);
        }

        console.log(`New Password: ${newPassword}`);
        const salt = await bcrypt.genSalt(10);
        console.log(`Salt: ${salt}`);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log(`Hashed Password: ${hashedPassword}`);

        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json(new APiResponse(true, 200, null, "Password updated successfully."));
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred while sending OTP.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}

const pageReadCounter = async (req, res) => {
    const { userId, pagesRead } = req.body;
    try {
        const customer = await User.findByIdAndUpdate(
            userId,
            { $inc: { totalPagesRead: pagesRead } },
            { new: true }
        );

        if (!customer) {
            throw new ApiError("Customer not found.", 400);
        }
        console.log("Pages",customer.totalPagesRead);
        res.status(200).json(new APiResponse(true, 200, customer, "Pages read updated successfully"));
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred while sending OTP.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }

}


export { registerUser, getUser, userLogin, userLogout, addBookToShelf, sendOtp, resetPassword, pageReadCounter }


