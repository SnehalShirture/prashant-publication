import { User } from '../models/UserSchema.js'
import { createSession } from './SessionController.js';
import jwt from 'jsonwebtoken'
import { Session } from '../models/SessionSchema.js';
import bcrypt from 'bcrypt'
import { sendMessage } from '../middleware/MessageMiddleware.js';
import { ApiError } from '../utils/ApiError.js';
import { BadReqError } from '../utils/BadReqError.js';
import { APiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

const registerUser = async (req, res) => {
    try {
        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword

        const newUser = await User.create(req.body);

        res.status(200).json(new APiResponse(true, 200, newUser, "user created successfully.."));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const getUser = async (req, res) => {
    try {
        const users = await User.find().populate("bookShelf")
        res.status(201).json(users);
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message))
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
        res.status(500).json(new APiResponse(false, 500, null, error.message));
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
        res.status(500).json(new APiResponse(false, 500, null, error.message));
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
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
}

const getBookShelfByUserId = async (req, res) => {
    try {
        const { _id: userId } = req.body;

        if (!userId) {
            throw new ApiError("User ID is required.", 400);
        }
        const user = await User.findById(userId).populate("bookShelf");

        if (!user) {
            throw new ApiError("User not found.", 404);
        }

        res.status(200).json(new APiResponse(true, 200, user.bookShelf, "Bookshelf retrieved successfully."));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const deleteBookFromShelfByUserId = async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        console.log(req.body);
        const deletedBookFromShelf = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { bookShelf: bookId } },
            { new: true }
        );
        console.log(deletedBookFromShelf);
        res.status(200).json(new APiResponse(true, 200, deletedBookFromShelf, "book successfully deleted from shelf"))
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message))
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
        res.status(500).json(new APiResponse(false, 500, null, error.message));
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json(new APiResponse(true, 200, null, "Password updated successfully."));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
}


const getUserByClgId = async (req, res) => {
    try {
        const fetchUsers = await User.find({ collegeId: req.body.collegeId });
        console.log(fetchUsers);

        res.status(200).json(new APiResponse(true, 200, fetchUsers, "Users By CollegeId"))
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));

    }
}


const updatePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect.' });
        }

        let salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json(new APiResponse(true, 200, user, 'Password updated successfully.'));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
}



export { registerUser, getUser, userLogin, userLogout, addBookToShelf, getBookShelfByUserId, sendOtp, resetPassword, getUserByClgId, updatePassword, deleteBookFromShelfByUserId }


