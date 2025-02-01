import express from 'express'
import { createSubscription, getActiveSubscription, cancelSubscription,removeBooksFromSubscription ,getBooksBySubscription,updateSubscriptionStatus,getAllSubscription} from '../controllers/SubscriptionController.js'
import { authenticate } from '../middleware/auth.js';

const SubscriptionRouter = express.Router();

SubscriptionRouter.post("/createsubscription", createSubscription);
SubscriptionRouter.post("/removeBooksFromSubscription", removeBooksFromSubscription);
SubscriptionRouter.get("/getBooksBySubscription", getBooksBySubscription);
SubscriptionRouter.post("/updateSubscriptionStatus", updateSubscriptionStatus);
SubscriptionRouter.get("/getAllSubscription", getAllSubscription);
SubscriptionRouter.get("/getActiveSubscription", getActiveSubscription);


SubscriptionRouter.post("/cancelsubscription", cancelSubscription);


export { SubscriptionRouter }
