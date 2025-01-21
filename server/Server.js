import express from 'express'
import { userRouter } from './src/routes/UserRoutes.js';
import { bookRouter } from './src/routes/BookRoutes.js';
import { PaymentRouter } from './src/routes/PaymentRoutes.js';
import { SubscriptionRouter } from './src/routes/SubscriptionRoutes.js';
import cors from 'cors'
import bodyParser from 'body-parser';
import { ConnectDB } from './src/DB/connectDB.js';
import dotenv from 'dotenv'
dotenv.config();

let Server = express();

ConnectDB();
Server.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
Server.use(bodyParser.json());
Server.use(express.json())

Server.use("/uploads",express.static("uploads"));

Server.use("/api",userRouter);
Server.use("/api",bookRouter);
Server.use("/api",PaymentRouter);
Server.use("/api",SubscriptionRouter);

Server.listen(process.env.PORT, () => {
    console.log("Server Started...",process.env.PORT);
})