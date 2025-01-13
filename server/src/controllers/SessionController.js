import { Session } from "../models/SessionSchema.js";
import { APiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
const createSession = async ({ userId, ipAddress, userAgent }) => {
    try {

        const activeSession = await Session.findOne({
            user_id: userId,
            isActive: true,
        });

        if (activeSession) {
            return { success: false, message: 'You are already logged in on another device.', activeSession };
        }

        const newSession = new Session({
            user_id: userId,
            ipAddress: ipAddress,
            userAgent: userAgent,
            isActive: true,
        });

        await newSession.save();
        return { success: true, session: newSession };

    } catch (error) {
        throw new ApiError("Error creating session.", 500);
    }
}

const getSession = async () => {
    try {
        const logs = await Session.find({ user_id: req.params.userId });
        if (logs.length === 0) {
            throw new ApiError("No session logs found for the user.", 404);
        }

       
        res.status(200).json(new APiResponse(true, 200, logs, "Session logs fetched successfully."));
       
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}





export { createSession, getSession }