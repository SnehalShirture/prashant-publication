import express from "express";
import { registerUser,getUser,userLogin, userLogout ,addBookToShelf,sendOtp,resetPassword} from "../controllers/UserController.js";
import { authenticate } from "../middleware/auth.js";

const userRouter=express.Router();

userRouter.post("/register",registerUser);
userRouter.get("/getUsers",getUser);
userRouter.post("/login",userLogin);
userRouter.post("/logout",userLogout)
userRouter.post("/addToShelf",authenticate,addBookToShelf)
userRouter.post("/sendOTP",sendOtp)
userRouter.post("/resetPassword",resetPassword)

export {userRouter}

