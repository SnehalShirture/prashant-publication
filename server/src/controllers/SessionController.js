import { Session } from "../models/SessionSchema.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
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


/*const getReadCounterByUserId = async (req, res) => {

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
                    yearMonth: {
                        $dateToString: { format: "%Y-%m", date: "$loginTime" }
                    }
                }
            },
            {
                $group: {
                    _id: "$yearMonth",
                    totalPageCounter: { $sum: "$pageCounter" }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $addFields: {
                    fullDate: {
                        $concat: ["$_id", "-01"] // Convert "YYYY-MM" to "YYYY-MM-01"
                    }
                }
            },
            {
                $addFields: {
                    formattedMonthYear: {
                        $dateFromString: { dateString: "$fullDate", format: "%Y-%m-%d`" }
                    }
                }
            },
            {
                $addFields: {
                    monthYear: {
                        $dateToString: { format: "%b %Y", date: "$formattedMonthYear" }
                    }
                }
            },
            {
                $project: {
                    monthYear: 1,
                    totalPageCounter: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json(new APiResponse(true, 200, readCounter, "Page reading data"))
    } catch (error) {

        res.status(500).json(new APiResponse(false, 500, null, error.message))
    }
}*/

const getReadCounterByUserId = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.body.userId);

        const readCounter = await Session.aggregate([
            {
                $match: { user_id: userId }
            },
            {
                $addFields: {
                    yearMonth: {
                        $dateToString: { format: "%Y-%m", date: "$loginTime" } // Get "YYYY-MM"
                    }
                }
            },
            {
                $group: {
                    _id: "$yearMonth",
                    totalPageCounter: { $sum: "$pageCounter" }
                }
            },
            {
                $sort: { _id: 1 } 
            },
            {
                $addFields: {
                    fullDate: {
                        $concat: ["$_id", "-01"] 
                    }
                }
            },
            {
                $addFields: {
                    formattedMonthYear: {
                        $dateFromString: { dateString: "$fullDate", format: "%Y-%m-%d" } 
                    }
                }
            },
            {
                $addFields: {
                    monthYear: {
                        $dateToString: { format: "%b %Y", date: "$formattedMonthYear" } 
                    }
                }
            },
            {
                $project: {
                    monthYear: 1,
                    totalPageCounter: 1,
                    _id: 0
                }
            }
        ]);

        console.log(readCounter);
        res.status(200).json(new APiResponse(true, 200, readCounter, "Page reading data"));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const getTotalPagesReadByMonth = async (req, res) => {
    try {
        const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const result = await Session.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$loginTime" }, year: { $year: "$loginTime" } },
                    totalPagesRead: { $sum: "$pageCounter" },
                    totalUsers: { $addToSet: "$user_id" }
                }
            },
            {
                $addFields: {
                    totalUsers: { $size: "$totalUsers" },
                    formattedMonthYear: {
                        $concat: [
                            { $arrayElemAt: [months, "$_id.month"] }, " ",
                            { $toString: "$_id.year" }
                        ]
                    }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
            {
                $project: {
                    monthYear: "$formattedMonthYear",
                    totalPagesRead: 1,
                    totalUsers: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json({ success: true, status: 200, data: result, message: "Data by month" });
    } catch (error) {
        res.status(500).json({ success: false, status: 500, message: error.message });
    }
};


export { createSession, getSession, updatePageCounter, getReadCounterByUserId, getTotalPagesReadByMonth }



