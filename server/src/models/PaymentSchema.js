import mongoose from "mongoose";

const PaymentSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true
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
    }
});

export const Payment = mongoose.model("Payment", PaymentSchema)