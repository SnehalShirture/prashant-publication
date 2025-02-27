import express from 'express'
import { getPaymentDetailsByUserId, verifyRazorPay, createRazorpayOrder } from '../controllers/PaymentController.js'
import { authenticate } from '../middleware/auth.js';

const PaymentRouter = express.Router()

PaymentRouter.post("/createRazorpayOrder", createRazorpayOrder);

PaymentRouter.get("/paymentDetailsById", getPaymentDetailsByUserId);

PaymentRouter.post("/verifyrazorpay", authenticate, verifyRazorPay);


export { PaymentRouter }