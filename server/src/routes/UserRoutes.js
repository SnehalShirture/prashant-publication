import express from "express";
import { registerUser,getUser,userLogin, userLogout ,addBookToShelf} from "../controllers/UserController.js";

const userRouter=express.Router();

userRouter.post("/register",registerUser);
userRouter.get("/getUsers",getUser);
userRouter.post("/login",userLogin);
userRouter.post("/logout",userLogout)
userRouter.post("/addToShelf",addBookToShelf)

export {userRouter}

