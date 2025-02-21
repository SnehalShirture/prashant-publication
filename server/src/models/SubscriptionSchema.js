import mongoose from "mongoose";
import { createOrder } from "../controllers/PaymentController.js";

const SubscriptionSchema = mongoose.Schema({
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College"
    },
    package: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package"
    }],
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: false
    },
    // paymentId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Payment',
    //     required: true
    // },
    subscribedBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        }
    ],
    status: {
        type: String,
        default: "pending"

    },
    totalAmount: {
        type: Number,
    },
    maxReaders: {
        type: Number
    }
});


SubscriptionSchema.post("save", async function (doc, next) {
    try {
        console.log("Subscription created successfully:", doc);

        // Example: Automatically create a payment after subscription
        /*await Payment.create({
            user_id: doc.collegeId,
            amount: doc.totalAmount,
            status: "Pending",
            paymentMethod: "UPI",
        });*/
        await createRazorpayOrder(doc.collegeId, doc.totalAmount);
       
    } catch (error) {
        console.error("Error in post-save subscription trigger:", error);
        return next(error);
    }
    next();
});


export const Subscription = mongoose.model("Subscription", SubscriptionSchema) 