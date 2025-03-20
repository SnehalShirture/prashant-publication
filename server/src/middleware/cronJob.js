
// import cron from 'node-cron'
// import { Subscription } from '../models/SubscriptionSchema.js';
// import { Notification } from '../models/NotificationSchema.js';
// import { College } from '../models/CollegeSchema.js'

// const scheduleSubscriptionNotifications = () => {
//     console.log("Cron Job Initialized"); // Confirm the function is loaded

//     // Run immediately for testing
//     (async () => {
//         await checkExpiringSubscriptions();
//     })();
//     cron.schedule("15 18 * * *", async () => {
//         await checkExpiringSubscriptions();
//     });
// };
// const checkExpiringSubscriptions = async () => {
//     try {
//         const collegeId="679793fc16b8a94eebea22e2";
//         console.log("Checking expiring subscriptions...")
//         const today = new Date();
//         const next30Days = new Date();
//         next30Days.setDate(today.getDate() + 30);

//         const next15Days = new Date();
//         next15Days.setDate(today.getDate() + 15);

//         const next5Days = new Date();
//         next5Days.setDate(today.getDate() + 5);

//         const next1Day = new Date();
//         next1Day.setDate(today.getDate() + 1);

//         // Check for subscriptions nearing expiration
//         const expiringSubscriptions = await Subscription.find({
//             endDate: { $in: [next30Days, next15Days, next5Days, next1Day] }
//         }).populate("collegeId");

//         for (const subscription of expiringSubscriptions) {
//             let daysRemaining = Math.ceil((subscription.endDate - today) / (1000 * 60 * 60 * 24));

//             // Message based on remaining days
//             let message = `Your subscription will expire in ${daysRemaining} days. Please renew it soon.`;

//             // Save notification
//             await Notification.create({
//                 collegeId: subscription.collegeId._id,
//                 message: message,
//                 isRead: false
//             });

//             console.log(`Notification sent to College: ${subscription.collegeId.name} - ${message}`);
//         }
//     } catch (error) {
//         console.error("Error checking expiring subscriptions:", error);
//     }
// }


// export { scheduleSubscriptionNotifications };

import cron from 'node-cron';
import { Subscription } from '../models/SubscriptionSchema.js';
import { Notification } from '../models/NotificationSchema.js';

const scheduleSubscriptionNotifications = () => {
   
    cron.schedule("15 19 * * *", async () => {
    try {
        const today = new Date();
        const next15Days = new Date();
         next15Days.setDate(today.getDate() + 15);
         console.log(next15Days);

         const startOfDay = new Date(next15Days.setUTCHours(0, 0, 0, 0));
         const endOfDay = new Date(next15Days.setUTCHours(23, 59, 59, 999));
         
         const expiringSubscriptions = await Subscription.find({
             endDate: { $gte: startOfDay, $lte: endOfDay }
         }).populate("collegeId")

        console.log(`🔍 Found ${expiringSubscriptions.length} subscriptions expiring in 15 days.`);

        if (expiringSubscriptions.length === 0) return;

        for (const subscription of expiringSubscriptions) {
            const college = subscription.collegeId;

            // Create the notification message
            const message = `Your subscription will expire in 15 days. Please renew it soon.`;

            // Save the notification
            await Notification.create({
                collegeId: college._id,
                message: message,
                isRead: false
            });

            console.log(`📩 Notification sent to College: ${college.clgName} - ${message}`);
        }
    } catch (error) {
        console.error("❌ Error checking expiring subscriptions:", error);
    }
});
};

export { scheduleSubscriptionNotifications };

