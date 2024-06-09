import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";
import recaptcha from "../../services/recaptcha.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signup", recaptcha.middleware.verify, (req, res) => {
  userController.signUp(req, res);
});

userRouter.post("/login",recaptcha.middleware.verify, (req, res) => {
  userController.signIn(req, res);
});


userRouter.post("/request-reset-password", jwtAuth, (req, res) => {
  userController.requestResetPassword(req, res);
});

userRouter.post("/verify-otp", jwtAuth, (req, res, next) => {
  userController.VerifyOTP(req, res, next),
    (req, res) => userController.resetPassword(req, res);
});

userRouter.post("/resetPassword", jwtAuth, (req, res) => {
    userController.resetPassword(req, res);
  });

export default userRouter;
