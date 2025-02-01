import mongoose from "mongoose";

const SubscriptionSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    plan: {
        type: String,
        
    },
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
        default:"pending"
        
    },
    totalAmount:{
        type:Number,
    }
});

export const Subscription = mongoose.model("Subscription", SubscriptionSchema) 