import express from 'express'
import {
        createSubscription, getActiveSubscription, cancelSubscription, removeBooksFromSubscription,
        getBooksByCollegeId, updateSubscriptionStatus, getAllSubscription, getSubscriptionsByStatus, getExpiredSubscription,
        fetchBooksByCollegeId, getSubscriptionByCollegeId, sendQuotation  ,generateQuotationpdf
} from '../controllers/SubscriptionController.js'
import { authenticate } from '../middleware/auth.js';

const SubscriptionRouter = express.Router();

SubscriptionRouter.post("/createsubscription",authenticate,createSubscription);
SubscriptionRouter.post("/removeBooksFromSubscription", removeBooksFromSubscription);
SubscriptionRouter.post("/getBooksByCollegeId",authenticate, getBooksByCollegeId);
SubscriptionRouter.post("/updateSubscriptionStatus",authenticate, updateSubscriptionStatus);
SubscriptionRouter.get("/getAllSubscription",authenticate, getAllSubscription);
SubscriptionRouter.get("/getActiveSubscription", getActiveSubscription);
SubscriptionRouter.post("/getSubscriptionsByStatus", getSubscriptionsByStatus);
SubscriptionRouter.get("/getExpiredSubscription",authenticate, getExpiredSubscription);

SubscriptionRouter.post("/cancelsubscription", cancelSubscription);
SubscriptionRouter.post("/fetchBooksByCollegeId",authenticate, fetchBooksByCollegeId);
SubscriptionRouter.post("/getSubscriptionByCollegeId",authenticate, getSubscriptionByCollegeId);
SubscriptionRouter.post("/sendQuotation",authenticate, sendQuotation);
SubscriptionRouter.post("/generateQuotationpdf", generateQuotationpdf);

export { SubscriptionRouter }
