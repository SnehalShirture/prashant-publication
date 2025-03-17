import mongoose from "mongoose";
import { updateSubscriptionStatus } from "../controllers/SubscriptionController.js";

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
    },
    subscriptionQuotation: {
        type: String
    },
    maintenanceCost:{
        type:Number
    }
});


 SubscriptionSchema.post("update", async function (doc, next) {
     try {

         console.log("doc",doc);
         await updateSubscriptionStatus(_id);

     } catch (error) {
         console.error("Error in post-save subscription trigger:", error);
         return next(error);
     }
     next();
 });


export const Subscription = mongoose.model("Subscription", SubscriptionSchema) 