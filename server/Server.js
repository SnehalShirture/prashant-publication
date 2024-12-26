import express from 'express'
import { userRouter } from './src/routes/UserRoutes.js';
import { bookRouter } from './src/routes/BookRoutes.js';
import { PaymentRouter } from './src/routes/PaymentRoutes.js';

import { ConnectDB } from './src/DB/connectDB.js';
import { SubscriptionRouter } from './src/routes/SubscriptionRoutes.js';
let Server = express();

ConnectDB();
Server.use(express.json())
Server.use("/uploads",express.static("uploads"));

Server.use("/api",userRouter);
Server.use("/api",bookRouter);
Server.use("/api",PaymentRouter);
Server.use("/api",SubscriptionRouter);

Server.listen(5000, () => {
    console.log("Server Started...");
})