import mongoose from "mongoose";

const SubscriptionSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    plan: {
        type: String,
        enum: ['6Months', '1Year'],
    },
    startDate: {
        type: Date,
        default: new Date()
    },
    endDate: {
        type: Date,

    },
    isActive: {
        type: Boolean,
        default: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    }
});

export const Subscription = mongoose.model("Subscription", SubscriptionSchema) 