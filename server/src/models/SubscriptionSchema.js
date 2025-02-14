import mongoose from "mongoose";

const SubscriptionSchema = mongoose.Schema({
    collegeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"College"
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Package"
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
    },
    maxReaders:{
        type:Number
    }
});

export const Subscription = mongoose.model("Subscription", SubscriptionSchema) 