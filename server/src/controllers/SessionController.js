import { Session } from "../models/SessionSchema.js";
import { APiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
import mongoose from "mongoose";

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


const updatePageCounter = async (req, res) => {
    const { sessionId, pagesRead } = req.body;
    try {
        const session = await Session.findByIdAndUpdate(
            { _id: sessionId },
            { $inc: { pageCounter: pagesRead } },
            { new: true }
        )
        if (!session) {
            throw new ApiError("Session not found.", 400);
        }

        res.status(200).json(new APiResponse(true, 200, session, "pageCounter updated"))
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}


const getReadCounterByUserId = async (req, res) => {
   
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    
    try {
        const readCounter = await Session.aggregate([
            {
                $match: {
                    user_id: userId
                }
            },
            {
                $addFields: {
                    monthYear: {
                        $dateToString: {
                            format: "%b %Y",
                            date: "$loginTime"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$monthYear",
                    totalPageCounter: { $sum: "$pageCounter" },
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $project: {
                    monthYear: "$_id",
                    totalPageCounter: 1,
                    _id: 0
                }
            }
        ])

        res.status(200).json(new APiResponse(true, 200, readCounter, "Page reading data"))
    } catch (error) {
        const status = error.status;
        const message = error.message;
        res.status(status).json(new APiResponse(false, status, null, message))
    }
}

const getTotalPagesReadByMonth = async (req, res) => {
    try {
        const Result = await Session.aggregate([
            {
                $addFields: {
                    monthYear: {
                        $dateToString: {
                            format: "%b %Y",
                            date: "$loginTime"
                        }
                    }
                }
            },
    
            {
                $group: {
                    _id: "$monthYear",
                    totalPagesRead: { $sum: "$pageCounter" },
                    totalUsers: { $addToSet: "$user_id" } // Collect unique users
                }
            },
            {
                $addFields: {
                    totalUsers: { $size: "$totalUsers" }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $project: {
                    monthYear: "$_id",
                    totalPagesRead: 1,
                    totalUsers: 1,
                    _id: 0
                }
            }
        ])

        res.status(200).json(new APiResponse(true, 200, Result, "data by month"))

    } catch (error) {
        const status = error.status;
        const message = error.message;
        res.status(status).json(new APiResponse(false, status, null, message))
    }
}



export { createSession, getSession, updatePageCounter ,getReadCounterByUserId,getTotalPagesReadByMonth }



