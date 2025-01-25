import express from "express";
import { registerUser, getUser, userLogin, userLogout, addBookToShelf, getBookShelfByUserId, sendOtp, resetPassword } from "../controllers/UserController.js";
import { updatePageCounter, getReadCounterByUserId, getTotalPagesReadByMonth } from "../controllers/SessionController.js";
import { authenticate } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/getUsers", getUser);
userRouter.post("/login", userLogin);
userRouter.post("/logout", userLogout)
userRouter.post("/addToShelf", authenticate, addBookToShelf)
userRouter.post("/bookShelf", getBookShelfByUserId)
userRouter.post("/sendOTP", sendOtp)
userRouter.post("/resetPassword", resetPassword)


//session routes
userRouter.post("/updatePageCounter", updatePageCounter)
userRouter.post("/getUserReadData", getReadCounterByUserId)
userRouter.get("/getTotalPagesByMonth", getTotalPagesReadByMonth)

export { userRouter }