import { User } from '../models/UserSchema.js'
import { createSession } from './SessionController.js';
import jwt from 'jsonwebtoken'
import { Session } from '../models/SessionSchema.js';
import bcrypt from 'bcrypt'
import { sendMessage } from '../middleware/MessageMiddleware.js';

const registerUser = async (req, res) => {
    try {

        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword

        const newUser = await User.create(req.body);
        console.log(newUser);
        res.status(200).json({ message: "User Registered Successfully. Please Login.", result: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message })
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
        console.log(req.body);
        const { email, password, ipAddress, userAgent } = req.body;

        const user = await User.findOne({ email })
        console.log("user", user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        let isCorrectPassword = await bcrypt.compare(password, user.password)

        if (!isCorrectPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const sessionResponse = await createSession({
            userId: user._id,
            ipAddress,
            userAgent,
        });

        if (!sessionResponse.success) {
            return res.status(403).json({ message: sessionResponse.message });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, 'Secret Key', { expiresIn: '7d' });

        res.status(200).json({
            message: 'Login successful',
            token,
            session: sessionResponse.session,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
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
        console.log("session", session);

         if (!session) {
             return res.status(400).json({ message: 'No active session found.' });
         }

        res.status(200).json({ message: 'Successfully logged out.' });

    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'An error occurred during logout.' });
    }
};

const addBookToShelf = async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { bookShelf: bookId } },
            { new: true }
        ).populate('bookShelf');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Book added to shelf.', user });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book to shelf.', error });
    }
};

const sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 15 * 60 * 1000;
        await user.save();
        const message = `Your OTP is ${otp}. It will expire in 15 minutes`;
       const info= await sendMessage(user.email, message);
        res.status(200).json({ message: 'OTP sent successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const resetPassword = async (req, res) => {
    const { mobile, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
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

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { registerUser, getUser, userLogin, userLogout, addBookToShelf, sendOtp,resetPassword }



