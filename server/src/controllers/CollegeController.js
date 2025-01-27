import { generatePassword } from "../middleware/generatePassword.js";
import { sendMessage } from "../middleware/MessageMiddleware.js";
import { College } from "../models/CollegeSchema.js";
import { User } from "../models/UserSchema.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { ApiError } from '../utils/ApiError.js';

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
            password: generatedPassword,
            role: "CollegeAdmin",
            collegeId: newCollege._id
        });

        const message = `Logged in with password ${generatedPassword}`;
        const info = await sendMessage(newCollege.librarianEmail, message);

        res.status(200).json(new APiResponse(true, 200, newCollege, "College Added SUccessfully"))
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}

const updateCollege = async (req, res) => {
    try {
        
        const { updateData } = req.body;

        const updatedCollege = await College.findByIdAndUpdate(id, {updateData}, {
            new: true,
            runValidators: true
        });

        if (!updatedCollege) {
            throw new ApiError("College not found", 404)
        }

        res.status(200).json(new APiResponse(true, 200, updatedCollege, "College updated successfully."));
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
};


const getCollegesData = async (req, res) => {
    try {
        const fetchCollegeData = await College.find()

        res.status(200).json(new APiResponse(true, 200, fetchCollegeData, "College Data"))
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}



export { addCollege, updateCollege ,getCollegesData}