import express from 'express'
import { getPaymentDetailsByUserId, createOrder, verifyRazorPay } from '../controllers/PaymentController.js'
import { authenticate } from '../middleware/auth.js';

const PaymentRouter = express.Router()


PaymentRouter.get("/paymentDetailsById", getPaymentDetailsByUserId);
PaymentRouter.post("/createorder", createOrder);
PaymentRouter.post("/verifyrazorpay", authenticate, verifyRazorPay);


export { PaymentRouter }