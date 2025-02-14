import express from "express";
import { registerUser, getUser, userLogin, userLogout, addBookToShelf, getBookShelfByUserId, sendOtp, resetPassword, getUserByClgId, updatePassword } from "../controllers/UserController.js";
import { updatePageCounter, getReadCounterByUserId, getTotalPagesReadByMonth } from "../controllers/SessionController.js";
import { authenticate } from "../middleware/auth.js";
import { addCollege, updateCollege, getCollegesData } from "../controllers/CollegeController.js";
import { StartReadingSession, stopReadingSession ,getCurrentReaders } from "../controllers/ReadingController.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/getUsers", getUser);
userRouter.post("/login", userLogin);
userRouter.post("/logout", userLogout)
userRouter.post("/addToShelf", authenticate, addBookToShelf)
userRouter.post("/bookShelf", authenticate, getBookShelfByUserId)
userRouter.post("/sendOTP", sendOtp)
userRouter.post("/resetPassword", resetPassword)
userRouter.post("/getUserByClgId", getUserByClgId)
userRouter.post("/updatePassword", updatePassword)


//session routes
userRouter.post("/updatePageCounter", updatePageCounter)
userRouter.post("/getUserReadData", getReadCounterByUserId)
userRouter.get("/getTotalPagesByMonth", getTotalPagesReadByMonth)


//college routes
userRouter.post("/addCollege", addCollege)
userRouter.post("/updateCollege", updateCollege)
userRouter.get("/fetchCollegeData", getCollegesData)


//ReadingSession routes
userRouter.post("/StartReadingSession", StartReadingSession)
userRouter.post("/stopReadingSession", stopReadingSession)
userRouter.get("/getCurrentReaders", getCurrentReaders)

export { userRouter }