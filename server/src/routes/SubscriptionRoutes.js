import express from 'express'
import {createSubscription,getActiveSubscription,cancelSubscription,getsubscriptionByUserId} from '../controllers/SubscriptionController.js'
import { authenticate } from '../middleware/auth.js';

const SubscriptionRouter= express.Router();

SubscriptionRouter.post("/createsubscription",authenticate,createSubscription);
SubscriptionRouter.get("/getsubscription",getActiveSubscription);
SubscriptionRouter.post("/cancelsubscription",cancelSubscription);
SubscriptionRouter.post("/getsubscriptionbyUserId",getsubscriptionByUserId);

export {SubscriptionRouter}
