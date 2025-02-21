import mongoose from "mongoose";

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

export const Payment = mongoose.model("Payment", PaymentSchema)