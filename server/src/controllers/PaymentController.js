import { Payment } from "../models/PaymentSchema.js";
import { User } from "../models/UserSchema.js";

const createPayment = async (req, res) => {
    try {
        const { userId, paymentMethod, transactionId } = req.body;

        const userBookShelf = await User.findOne({ _id: userId }).populate("bookShelf");
        const Shelf = userBookShelf.bookShelf;

        let amount = 0;
        for (let index = 0; index < Shelf.length; index++) {
            const book = Shelf[index];
            console.log(book);
            amount += Number(book.price) 

        }

        // Create a new payment record
        const payment = new Payment({
            user_id: userId,
            amount,
            paymentMethod,
            transactionId,
            status: 'Pending',
        })
        await payment.save();

        res.status(201).json({
            message: 'Payment created successfully.',
            payment,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId, status } = req.body;

        const payment = await Payment.findById(paymentId)
            .populate("user_id")

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found.' });
        }

        payment.status = status;
        await payment.save();

        res.status(200).json({
            message: 'Payment status updated successfully.',
            payment,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPaymentDetailsByUserId = async (req, res) => {
    try {
        const { userId } = req.body;

        const payment = await Payment.findOne({ user_id: userId })
            .populate("user_id")
            
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found.' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getPaymentDetailsByUserId, updatePaymentStatus, createPayment }