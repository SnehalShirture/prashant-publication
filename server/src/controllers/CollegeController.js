import { generatePassword } from "../middleware/generatePassword.js";
import { sendMessage } from "../middleware/MessageMiddleware.js";
import { College } from "../models/CollegeSchema.js";
import { User } from "../models/UserSchema.js";
import { Notification } from "../models/NotificationSchema.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';

const addCollege = async (req, res) => {
    try {
        const { librarianName, librarianMobile, librarianEmail } = req.body;

        const existingCollege = await College.findOne({ librarianEmail });
        if (existingCollege) {
            throw new ApiError("A college with this librarian email already exists.", 400);
        }

        const newCollege = await College.create(req.body);
        // Generate password
        const generatedPassword = generatePassword();

        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(generatedPassword, salt)


        const NewUser = await User.create({
            name: librarianName,
            email: librarianEmail,
            mobile: librarianMobile,
            password: hashedPassword,
            role: "CollegeAdmin",
            collegeId: newCollege._id
        });

        const message = `Logged in with password ${generatedPassword}`;
        const info = await sendMessage(newCollege.librarianEmail, message);

        res.status(200).json(new APiResponse(true, 200, newCollege, "College Added SUccessfully"))
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));

    }
}


const updateCollege = async (req, res) => {
    try {

        const { updateData } = req.body;

        const updatedCollege = await College.findByIdAndUpdate(id, { updateData }, {
            new: true,
            runValidators: true
        });

        if (!updatedCollege) {
            throw new ApiError("College not found", 404)
        }

        res.status(200).json(new APiResponse(true, 200, updatedCollege, "College updated successfully."));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const getCollegesData = async (req, res) => {
    try {
        const fetchCollegeData = await College.find()

        res.status(200).json(new APiResponse(true, 200, fetchCollegeData, "College Data"))
    } catch (error) {

        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
}


const getNotifications = async (req, res) => {
    try {
        const { collegeId } = req.body;

        const notifications = await Notification.find({ collegeId })
            .sort({ createdAt: -1 });

        
            await Notification.updateMany(
                { collegeId, isRead: false }, 
                { $set: { isRead: true } }
            );
        res.status(200).json(new APiResponse(true, 200, notifications, "fetched notification successfully"));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};

export { addCollege, updateCollege, getCollegesData, getNotifications }