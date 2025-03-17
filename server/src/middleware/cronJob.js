
import cron from 'node-cron'
import { Subscription } from '../models/SubscriptionSchema.js';
import { Notification } from '../models/NotificationSchema.js';
import { College } from '../models/CollegeSchema.js'

const scheduleSubscriptionNotifications = () => {
    cron.schedule("0 0 * * *", async () => {  // Runs every day at midnight
        try {
            const today = new Date();
            const next30Days = new Date();
            next30Days.setDate(today.getDate() + 30);

            const next15Days = new Date();
            next15Days.setDate(today.getDate() + 15);

            const next5Days = new Date();
            next5Days.setDate(today.getDate() + 5);

            const next1Day = new Date();
            next1Day.setDate(today.getDate() + 1);

            // Check for subscriptions nearing expiration
            const expiringSubscriptions = await Subscription.find({
                endDate: { $in: [next30Days, next15Days, next5Days, next1Day] }
            }).populate("collegeId");

            for (const subscription of expiringSubscriptions) {
                let daysRemaining = Math.ceil((subscription.endDate - today) / (1000 * 60 * 60 * 24));

                // Message based on remaining days
                let message = `Your subscription will expire in ${daysRemaining} days. Please renew it soon.`;

                // Save notification
                await Notification.create({
                    collegeId: subscription.collegeId._id,
                    message: message,
                    isRead: false
                });

                console.log(`Notification sent to College: ${subscription.collegeId.name} - ${message}`);
            }
        } catch (error) {
            console.error("Error checking expiring subscriptions:", error);
        }
    });
};

export { scheduleSubscriptionNotifications };
