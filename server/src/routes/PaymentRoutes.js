import express from 'express'
import { createPayment, updatePaymentStatus,getPaymentDetailsByUserId } from '../controllers/PaymentController.js'

const PaymentRouter = express.Router()

PaymentRouter.post("/createPayment",createPayment);
 PaymentRouter.get("/paymentDetailsById",getPaymentDetailsByUserId);
PaymentRouter.post("/updatePaymentStatus",updatePaymentStatus);

export {PaymentRouter}