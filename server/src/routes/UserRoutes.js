import express from "express";
import { activateUser, registerUser, getUser, userLogin, userLogout, addBookToShelf, getBookShelfByUserId, sendOtp, resetPassword, getUserByClgId, updatePassword, deleteBookFromShelfByUserId, uploadBulkStudents } from "../controllers/UserController.js";
import { updatePageCounter, getReadCounterByUserId, getTotalPagesReadByMonth } from "../controllers/SessionController.js";
import { authenticate } from "../middleware/auth.js";
import { addCollege, updateCollege, getCollegesData, getNotifications } from "../controllers/CollegeController.js";
import { StartReadingSession, stopReadingSession, getCurrentReaders } from "../controllers/ReadingController.js";
import { createPackage, getPackagesByCategory, updateAllPackagesPrice, getAllPackages } from "../controllers/PackageController.js";

const userRouter = express.Router();

userRouter.post("/uploadBulkStudents", authenticate, uploadBulkStudents)
userRouter.post("/registerUser", registerUser)
userRouter.post("/activateUser",authenticate, activateUser);
userRouter.get("/getUsers", authenticate,  getUser);
userRouter.post("/login", userLogin);
userRouter.post("/logout", userLogout)
userRouter.post("/addToShelf", authenticate, addBookToShelf)
userRouter.post("/bookShelf", authenticate, getBookShelfByUserId)
userRouter.post("/deleteBookFromShelfByUserId", authenticate, deleteBookFromShelfByUserId)
userRouter.post("/sendOTP", sendOtp)
userRouter.post("/resetPassword", resetPassword)
userRouter.post("/getUserByClgId", authenticate ,getUserByClgId)
userRouter.post("/updatePassword",authenticate, updatePassword)


//session routes
userRouter.post("/updatePageCounter", updatePageCounter)
userRouter.post("/getUserReadData", getReadCounterByUserId)
userRouter.get("/getTotalPagesByMonth", getTotalPagesReadByMonth)


//college routes
userRouter.post("/addCollege", addCollege)
userRouter.post("/updateCollege", updateCollege)
userRouter.get("/fetchCollegeData", getCollegesData)
userRouter.get("/getNotification",getNotifications);


//ReadingSession routes
userRouter.post("/StartReadingSession", StartReadingSession)
userRouter.post("/stopReadingSession", stopReadingSession)
userRouter.get("/getCurrentReaders", getCurrentReaders)


//Package Routes
userRouter.post("/createPackage", createPackage)
userRouter.get("/getAllPackages", getAllPackages)

userRouter.get("/getPackagesByCategory", getPackagesByCategory)
userRouter.post("/updateAllPackagesPrice", updateAllPackagesPrice)



export { userRouter }