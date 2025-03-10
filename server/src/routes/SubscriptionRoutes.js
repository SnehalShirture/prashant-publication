import express from 'express'
import {
        createSubscription, getActiveSubscription, cancelSubscription, removeBooksFromSubscription,
        getBooksByCollegeId, updateSubscriptionStatus, getAllSubscription, getSubscriptionsByStatus, getExpiredSubscription,
        fetchBooksByCollegeId, getSubscriptionByCollegeId, sendQuotation  ,generateQuotationpdf
} from '../controllers/SubscriptionController.js'
import { authenticate } from '../middleware/auth.js';

const SubscriptionRouter = express.Router();

SubscriptionRouter.post("/createsubscription", createSubscription);
SubscriptionRouter.post("/removeBooksFromSubscription", removeBooksFromSubscription);
SubscriptionRouter.post("/getBooksByCollegeId", getBooksByCollegeId);
SubscriptionRouter.post("/updateSubscriptionStatus", updateSubscriptionStatus);
SubscriptionRouter.get("/getAllSubscription", getAllSubscription);
SubscriptionRouter.get("/getActiveSubscription", getActiveSubscription);
SubscriptionRouter.post("/getSubscriptionsByStatus", getSubscriptionsByStatus);
SubscriptionRouter.get("/getExpiredSubscription", getExpiredSubscription);

SubscriptionRouter.post("/cancelsubscription", cancelSubscription);
SubscriptionRouter.post("/fetchBooksByCollegeId", fetchBooksByCollegeId);
SubscriptionRouter.post("/getSubscriptionByCollegeId", getSubscriptionByCollegeId);
SubscriptionRouter.post("/sendQuotation", sendQuotation);
SubscriptionRouter.get("/generateQuotationpdf", generateQuotationpdf);


export { SubscriptionRouter }
