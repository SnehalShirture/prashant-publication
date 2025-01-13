import { Payment } from "../models/PaymentSchema.js";
import { Subscription } from "../models/SubscriptionSchema.js";
import { APiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"

const createSubscription = async (req, res) => {
    try {
        const { userId, plan, paymentId } = req.body;

        // Validate payment
        const payment = await Payment.findById(paymentId)

        if (!payment || payment.status !== 'Paid') {
            throw new ApiError("Invalid or unsuccessful payment.", 400);
        }
        // Define plan duration
        let duration;
        if (plan === '6Months') duration = 182;
        else if (plan === '1Year') duration = 365;
        else throw new ApiError("Invalid subscription plan.", 400);

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + duration);

        const subscription = new Subscription({
            user_id: userId,
            plan,
            endDate,
            paymentId,
        });

        await subscription.save();

        return new APiResponse(true, 200, subscription, "Subscription created successfully.");
    } catch (error) {
        throw new ApiError("Error Creating Subscription",500);
    }
};

const getActiveSubscription = async (req, res) => {
    try {
        const { userId } = req.body;

        const subscription = await Subscription.findOne({
            user_id: userId,
            isActive: true,
            endDate: { $gte: new Date() },
        });

        if (!subscription) {
            throw new ApiError("No active subscription found.", 404);
        }


        res.status(200).json(new APiResponse(true, 200, subscription, "Active subscription fetched successfully.")); es.status(200).json(subscription);
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json(new APiResponse(false, status, null, error.message || "An error occurred."));
    }
};

const cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription || !subscription.isActive) {
            throw new ApiError("Subscription not found or already canceled.", 404);
        }

        subscription.isActive = false;
        await subscription.save();

        res.status(200).json(new APiResponse(true, 200, null, "Subscription canceled successfully."));
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json(new APiResponse(false, status, null, error.message || "An error occurred."));
    }
};

const getsubscriptionByUserId = async (req, res) => {
    try {
        const { user_id } = req.body;
        const subscriptions = await Subscription.find({ user_id })

        if (!subscriptions || subscriptions.length === 0) {
            throw new ApiError("No subscriptions found for this user.", 404);
        }

        res.status(200).json(new APiResponse(true, 200, subscriptions, "Subscriptions fetched successfully."));
    } catch (error) {
        const status = error.statusCode || 500;
        res.status(status).json(new APiResponse(false, status, null, error.message || "An error occurred."));
    }
}

export { getActiveSubscription, createSubscription, cancelSubscription, getsubscriptionByUserId }
