import express from "express"
import { getEditProfilePage, getEditPwPage, getLoginPage, getSignupPage } from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.get('/login', getLoginPage);

userRouter.get('/signin', getSignupPage);

userRouter.get('/edit_profile', getEditProfilePage);

userRouter.get('/edit_pw', getEditPwPage);



export default userRouter