import { User } from '../models/UserSchema.js'
import { createSession } from './SessionController.js';
import jwt from 'jsonwebtoken'
import { Session } from '../models/SessionSchema.js';
import bcrypt from 'bcrypt'

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
        // Get the token from the Authorization header
        // const token = req.headers.authorization?.split(' ')[1];

        // if (!token) {
        //     return res.status(401).json({ message: 'No token provided, unauthorized.' });
        // }

        // const decoded = jwt.verify(token, 'Secret Key');
        // console.log(decoded);

        // if (!decoded) {
        //     return res.status(401).json({ message: 'Invalid or expired token.' });
        // }

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


export { registerUser, getUser, userLogin, userLogout, addBookToShelf }


