import express from 'express'
import { getPaymentDetailsByUserId, verifyRazorPay } from '../controllers/PaymentController.js'
import { authenticate } from '../middleware/auth.js';

const PaymentRouter = express.Router()


PaymentRouter.get("/paymentDetailsById", getPaymentDetailsByUserId);

PaymentRouter.post("/verifyrazorpay", authenticate, verifyRazorPay);


export { PaymentRouter }