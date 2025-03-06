import { Payment } from "../models/PaymentSchema.js";
import { Subscription } from "../models/SubscriptionSchema.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import mongoose from "mongoose";
import { sendMessage } from "../middleware/MessageMiddleware.js";


const cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        const subscription = await Subscription.findOneAndUpdate(
            { _id: subscriptionId, isActive: true },
            { isActive: false },
            { new: true }
        );

        if (!subscription) {
            throw new ApiError("Subscription not found or already canceled.", 404);
        }

        res.status(200).json(new APiResponse(true, 200, subscription, "Subscription canceled successfully."));
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json(new APiResponse(false, status, null, error.message || "An error occurred."));
    }
};


const createSubscription = async (req, res) => {
    try {
        //collegeId,package,totalAmount

        const subscription = await Subscription.create(req.body)

        res.status(200).json(new APiResponse(true, 200, subscription, "Subscription created successfully."));

    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message))
    }
}


const removeBooksFromSubscription = async (req, res) => {
    try {
        const { subscriptionId, subscribedBooks } = req.body;

        const subscription = await Subscription.findOneAndUpdate(
            { _id: subscriptionId },
            { $pull: { subscribedBooks: { $in: subscribedBooks } } },
            { new: true }
        );

        if (!subscription) {
            throw new ApiError("Subscription not found", 404)
        }
        res.status(200).json(new APiResponse(true, 200, subscription, "books removed successfully"));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const getBooksByCollegeId = async (req, res) => {
    try {
        const { collegeId } = req.body;

        const subscriptions = await Subscription.aggregate([
            { $match: { collegeId: new mongoose.Types.ObjectId(collegeId) } },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $addFields: {
                    books: {
                        $map: {
                            input: "$books",
                            as: "book",
                            in: {
                                _id: "$$book._id",
                                name: "$$book.name",
                                author: "$$book.author",
                                category: "$$book.category",
                                price: "$$book.price",
                                publisher: "$$book.publisher",
                                otherPublisher: "$$book.otherPublisher",
                                yearPublished: "$$book.yearPublished",
                                coverImage: "$$book.coverImage",
                                indexImage1: "$$book.indexImage1",
                                indexImage2: "$$book.indexImage2",
                                bookPdf: { $cond: { if: "$isActive", then: "$$book.bookPdf", else: "$$REMOVE" } } // Remove bookPdf if isActive is false
                            }
                        }
                    }
                }
            },
            { $project: { subscribedBooks: 0 } }
        ]);

        const books = subscriptions.flatMap(sub => sub.books);

        res.status(200).json(new APiResponse(true, 200, books, "Books retrieved successfully"));
    } catch (error) {

        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const updateSubscriptionStatus = async (subscriptionId) => {
    try {
        const startDate = new Date();
        let endDate = new Date(startDate);

        endDate.setFullYear(endDate.getFullYear() + 1);
        /*switch (plan) {
            case "6months":
                endDate.setMonth(endDate.getMonth() + 6);
                break;
            case "2year":
                endDate.setFullYear(endDate.getFullYear() + 2);
                break;
            case "1year":
                endDate.setFullYear(endDate.getFullYear() + 1);
        }*/

        const subscription = await Subscription.findOneAndUpdate(
            { _id: subscriptionId },
            {
                status: "approved",
                startDate,
                endDate,
                isActive: true,
                plan: "1year",

            },
            { new: true }
        );

        if (!subscription) {
            throw new ApiError("Subscription not found", 404)
        }

        res.status(200).json(new APiResponse(true, 200, subscription, "Subscription updated Successfully"));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const getAllSubscription = async (req, res) => {
    try {
        const subscriptions = await Subscription.aggregate([
            {
                $lookup: {
                    from: "colleges",
                    localField: "collegeId",
                    foreignField: "_id",
                    as: "college"
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $addFields: {
                    totalBooks: { $size: "$books" }
                }
            },
            {
                $sort: { startDate: -1 } // Sort newest first (descending order)
            },

            {
                $project: {
                    subscribedBooks: 0,
                }
            }
        ]);

        res.status(200).json(new APiResponse(true, 200, subscriptions, "Fetched All Subscriptions"));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


const getActiveSubscription = async (req, res) => {
    try {
        const subscriptions = await Subscription.aggregate([
            {
                $match: {
                    isActive: true,
                    endDate: { $gte: new Date() }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $lookup: {
                    from: "colleges",
                    localField: "collegeId",
                    foreignField: "_id",
                    as: "college"
                }
            },
            {
                $addFields: {
                    bookCount: { $size: "$books" }
                }
            },
            {
                $project: {
                    "user.password": 0,
                    "user.__v": 0,
                    "user.otp": 0,
                    "user.otpExpires": 0,
                    "user.bookShelf": 0,
                    "user.totalRevenue": 0,
                    subscribedBooks: 0,
                    __v: 0
                }
            }
        ]);

        if (!subscriptions.length) {
            return res.status(404).json(new APiResponse(false, 404, null, "No active subscriptions found."));
        }

        res.status(200).json(new APiResponse(true, 200, subscriptions, "Active subscriptions fetched successfully."));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message || "An error occurred."));
    }
};


const getSubscriptionsByStatus = async (req, res) => {
    try {
        const subscription = await Subscription.aggregate([
            { $match: req.body },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $lookup: {
                    from: "colleges",
                    localField: "collegeId",
                    foreignField: "_id",
                    as: "college"
                }
            },
            {
                $addFields: {
                    bookCount: { $size: "$books" }
                }
            },
            {
                $project: {
                    "user.password": 0,
                    "user.otp": 0,
                    "user.otpExpires": 0,
                    "user.__v": 0,
                    "college.__v": 0,
                    subscribedBooks: 0,
                    __v: 0
                }
            }
        ]);
        res.status(200).json(new APiResponse(true, 200, subscription, " subscriptions fetched successfully."));

    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message || "An error occurred."));

    }
}


const getExpiredSubscription = async (req, res) => {
    try {
        const expiredSubscriptions = await Subscription.aggregate([
            {
                $match: {
                    endDate: { $lt: new Date() }
                }
            },
            {
                $set: {
                    isActive: false
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $lookup: {
                    from: "colleges",
                    localField: "collegeId",
                    foreignField: "_id",
                    as: "college"
                }
            },
            {
                $addFields: {
                    bookCount: { $size: "$books" }
                }
            },
            {
                $project: {
                    "user.password": 0,
                    "user.otp": 0,
                    "user.otpExpires": 0,
                    "user.__v": 0,
                    "college.__v": 0,
                    subscribedBooks: 0,
                    __v: 0
                }
            }
        ]);

        res.status(200).json(new APiResponse(true, 200, expiredSubscriptions, "Expired subscriptions fetched successfully."));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message || "An error occurred."));
    }
};


const fetchBooksByCollegeId = async (req, res) => {
    try {
        const collegeId = req.body.collegeId;
        const booksData = await Subscription.aggregate([
            { $match: { collegeId: new mongoose.Types.ObjectId(collegeId) } },
            {
                $lookup: {
                    from: "packages",
                    localField: "package",
                    foreignField: "_id",
                    as: "packageDetails"
                }
            },
            {
                $unwind: "$packageDetails"
            },
            {
                $lookup: {
                    from: "books",
                    localField: "packageDetails.booksIncluded",
                    foreignField: "_id",
                    as: "packageBooks"
                }
            },
            {
                $unwind: "$packageBooks"
            },
            // {
            //     $match: { "packageBooks.type": "textbook" }
            // },
            {
                $group: {
                    _id: null,
                    books: { $addToSet: "$packageBooks" }
                }
            },
            {
                $project: {
                    _id: 0,
                    books: 1
                }
            }
        ]);
        res.status(200).json(new APiResponse(true, 200, booksData, "Books Data"))

    } catch (error) {
        console.log(error);
    }
}


const getSubscriptionByCollegeId = async (req, res) => {
    try {
        const { collegeId } = req.body;

        const subscriptions = await Subscription.aggregate([
            {
                $match: { collegeId: new mongoose.Types.ObjectId(collegeId) }
            },
            {
                $lookup: {
                    from: "colleges",
                    localField: "collegeId",
                    foreignField: "_id",
                    as: "college"
                }
            },

            {
                $lookup: {
                    from: "packages",
                    localField: "package",
                    foreignField: "_id",
                    as: "package"
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "subscribedBooks",
                    foreignField: "_id",
                    as: "books"
                }
            },
            {
                $addFields: {
                    totalBooks: { $size: "$books" }
                }
            },
            {
                $project: {
                    subscribedBooks: 0, // Exclude the subscribedBooks array
                }
            }
        ]);

        if (!subscriptions.length) {
            return res.status(404).json(new APiResponse(false, 404, null, "No subscriptions found for this college"));
        }

        res.status(200).json(new APiResponse(true, 200, subscriptions, "Fetched Subscriptions for College"));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }


}

export const sendQuotation = async (req, res) => {
    try {
        const { email, pdfurl ,pdfname} = req.body;
        const quotation = await Subscription.findOneAndUpdate(req.body);

        const message = "your Quotation is : ";
        await sendMessage(email, message, pdfurl,pdfname);
        res.status(200).json(new APiResponse(true,200,quotation,"quotation send successfully"))
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message))
    }
}

export const updateSubscriptionQuotation = async (req, res) => {
    try {
        const { _id,  subscriptionQuotation } = req.body;

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            _id,
            { subscriptionQuotation },
            { new: true }
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json(updatedSubscription);
    } catch (error) {
        console.error('Error updating subscription quotation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export {
    getActiveSubscription, createSubscription, cancelSubscription, getAllSubscription, updateSubscriptionStatus,
    getBooksByCollegeId, removeBooksFromSubscription, getSubscriptionsByStatus, getExpiredSubscription, fetchBooksByCollegeId,
    getSubscriptionByCollegeId
}
