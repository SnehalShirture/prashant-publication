import mongoose from "mongoose";
import { updateSubscriptionStatus } from "../controllers/SubscriptionController.js";

const PaymentSchema = mongoose.Schema({
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
    },
    amount: {
        type: Number,
    },
    paymentDate: {
        type: Date,
        default: new Date()
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'UPI'],
        required: true
    },
    transactionId: {
        type: String,
    },
    status: {
        type: String,
        default: 'Pending'
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription"
    }
});

PaymentSchema.post("save",async function (doc,next) {
    try {
        console.log("doc",doc);
        if (doc.status === "paid") {
            console.log(`Updating subscription ${doc.subscriptionId} after successful payment...`);
            
            await updateSubscriptionStatus(doc.subscriptionId);
        }
    } catch (error) {
        console.error("Error in post-save payment trigger:", error);
    }
    next();
});

export const Payment = mongoose.model("Payment", PaymentSchema)