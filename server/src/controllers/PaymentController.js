import { Payment } from "../models/PaymentSchema.js";
import { User } from "../models/UserSchema.js";
import { createSubscription } from "./SubscriptionController.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { BadReqError } from "../utils/BadReqError.js";
import Razorpay from 'razorpay'
import shortid from 'shortid'
import crypto from 'crypto'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

/*const createOrder = async (req, res) => {
    try {
        const { collegeId, amount } = req.body;
        console.log(collegeId);

        // if (plan === "6Months") {
        //     amount = 999;
        // } else if (plan === "1Year") {
        //     amount = 1999;
        // } else {
        //     throw new BadReqError("Invalid subscription plan selected.");
        // }

        // Create Razorpay order
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: shortid.generate(),
            payment_capture: 1,
        };

        const razorpayOrder = await razorpay.orders.create(options);
        console.log(razorpayOrder);

        const payment = new Payment({
            collegeId: collegeId,
            amount: amount * 100,
            paymentMethod: "UPI",
            transactionId: razorpayOrder.id, 
            status: "Pending",
        });
        console.log(payment);
        await payment.save();

        res.status(201).json(new APiResponse(true, 201, { razorpayOrder, payment }, "Payment initiated successfully."));
    }
    catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }

}*/

export const createRazorpayOrder = async (collegeId, totalAmount, _id) => {
    try {
        // Create a Razorpay order
        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: shortid.generate(),
            payment_capture: 1,
        };

        // Razorpay order is created
        const razorpayOrder = await razorpay.orders.create(options);
        console.log("razorpayOrder : ",razorpayOrder);

        const payment = await Payment.create({
            collegeId,
            amount: totalAmount * 100,
            paymentMethod: "UPI",
            transactionId: razorpayOrder.id, // Razorpay order ID
            subscriptionId: _id,
            status:"paid"
        });

        console.log("payment created successfully",payment);
        return { razorpayOrder, payment };
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw error;
    }
};


const verifyRazorPay = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        const shasum = crypto.createHmac("sha256", secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        console.log(digest, req.headers["x-razorpay-signature"]);

        if (shasum !== req.headers["x-razorpay-signature"]) {
            throw new BadReqError("Invalid Razorpay signature.");
        }

        const event = req.body; 
        console.log("event", event);
        // Handle payment captured event
        if (event.event === "payment.captured") {
            const { order_id, payment_id } = event.payload.payment.entity;

            const payment = await Payment.findOneAndUpdate(
                { transactionId: order_id },
                { status: "Paid", transactionId: payment_id },
                { new: true }
            );

            if (!payment) {
                throw new BadReqError("Payment record not found for order ID.");
            }

        }

        res.status(200).json(new APiResponse(true, 200, null, "Webhook verified and processed."));
    } catch (error) {
        const status = error.statusCode || 500;
        const message = error.message || "An unexpected error occurred.";
        res.status(status).json(new APiResponse(false, status, null, message));
    }
}


const getPaymentDetailsByUserId = async (req, res) => {
    try {
        const { collegeId } = req.body;

        const payment = await Payment.findOne({ collegeId: collegeId })
            .populate("collegeId")

        if (!payment) {
            throw new BadReqError("No payments found for this user.");
        }

        res.status(200).json(new APiResponse(true, 200, payment, "Payments fetched successfully."));
    } catch (error) {
        res.status(500).json(new APiResponse(false, 500, null, error.message));
    }
};


export { getPaymentDetailsByUserId, verifyRazorPay }