import { Payment } from "../models/PaymentSchema.js";
import { Subscription } from "../models/SubscriptionSchema.js";

const createSubscription = async (req, res) => {
    try {
        const { userId, plan, paymentId } = req.body;

        // Validate payment
        const payment = await Payment.findById(paymentId)

        if (!payment || payment.status !== 'Success') {
            return res.status(400).json({ message: 'Invalid or unsuccessful payment.' });
        }
        // Define plan duration
        let duration;
        if (plan === '6Months') duration = 182; // 6 months
        else if (plan === '1Year') duration = 365; // 1 year
        else return res.status(400).json({ message: 'Invalid subscription plan.' });

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + duration);

        const subscription = new Subscription({
           user_id: userId,
            plan,
            endDate,
            paymentId,
        });

        await subscription.save();

        res.status(201).json({
            message: 'Subscription created successfully.',
            subscription,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            return res.status(404).json({ message: 'No active subscription found.' });
        }

        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelSubscription = async (req, res) => {
    try {
      const { subscriptionId } = req.body;
  
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription || !subscription.isActive) {
        return res.status(404).json({ message: 'Subscription not found or already canceled.' });
      }
  
      subscription.isActive = false;
      await subscription.save();
  
      res.status(200).json({ message: 'Subscription canceled successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export {getActiveSubscription,createSubscription,cancelSubscription}
