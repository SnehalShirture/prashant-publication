import express from 'express'
import {createSubscription,getActiveSubscription,cancelSubscription} from '../controllers/SubscriptionController.js'

const SubscriptionRouter= express.Router();

SubscriptionRouter.post("/createsubscription",createSubscription);
SubscriptionRouter.get("/getsubscription",getActiveSubscription);
SubscriptionRouter.post("/cancelsubscription",cancelSubscription);

export {SubscriptionRouter}
