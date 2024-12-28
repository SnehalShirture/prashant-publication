import express from 'express'
import { createPayment, updatePaymentStatus,getPaymentDetailsByUserId } from '../controllers/PaymentController.js'
import { authenticate } from '../middleware/auth.js';

const PaymentRouter = express.Router()

PaymentRouter.post("/createPayment",authenticate,createPayment);
 PaymentRouter.get("/paymentDetailsById",getPaymentDetailsByUserId);
PaymentRouter.post("/updatePaymentStatus",updatePaymentStatus);

export {PaymentRouter}