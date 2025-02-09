import { Payment } from "../models/PaymentSchema.js";
import { Subscription } from "../models/SubscriptionSchema.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import mongoose from "mongoose";


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
        //collegeId,subscribedBooks,totalAmount

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
                                title: "$$book.title",
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


const updateSubscriptionStatus = async (req, res) => {
    try {
        const { subscriptionId, plan } = req.body;

        const startDate = new Date();
        let endDate = new Date(startDate);

        switch (plan) {
            case "6months":
                endDate.setMonth(endDate.getMonth() + 6);
                break;
            case "2year":
                endDate.setFullYear(endDate.getFullYear() + 2);
                break;
            case "1year":
                endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const subscription = await Subscription.findOneAndUpdate(
            { _id: subscriptionId },
            {
                status: "approved",
                startDate,
                endDate,
                isActive: true,
                plan,

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


// const getAllSubscription = async (req, res) => {
//     try {
//         const subscriptions = await Subscription.find()
//         .populate("user_id")
//         res.status(200).json(new APiResponse(true, 200, subscriptions, "fetched All Subscriptions"))
//     } catch (error) {
//         res.status(500).json(new APiResponse(false, 500, null, error.message))
//     }
// }


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





// const getActiveSubscription = async (req, res) => {
//     try {

//         const subscription = await Subscription.find({
//             isActive: true,
//             endDate: { $gte: new Date() },
//         })
//         .populate("user_id")
//         if (!subscription) {
//             throw new ApiError("No active subscription found.", 404);
//         }


//         res.status(200).json(new APiResponse(true, 200, subscription, "Active subscription fetched successfully.")); es.status(200).json(subscription);
//     } catch (error) {

//         res.status(500).json(new APiResponse(false, 500, null, error.message || "An error occurred."));
//     }
// };


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


export { getActiveSubscription, createSubscription, cancelSubscription, getAllSubscription, updateSubscriptionStatus, getBooksByCollegeId, removeBooksFromSubscription, getSubscriptionsByStatus, getExpiredSubscription }
