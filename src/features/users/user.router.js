import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";
import { googlePassportConfig } from "../../middleware/authGoogle.middleware.js";
import recaptcha from "../../services/recaptcha.js";

const userRouter = express.Router();
const userController = new UserController();

// Social Authentication 

userRouter.get(
  "/auth/google",
  googlePassportConfig.authenticate("google", { scope: ["profile", "email"] })
);


userRouter.get(
  "/auth/google/callback",
  googlePassportConfig.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    userController.googleLogin(req, res);
  }
);

userRouter.get("/auth/google/logout", 
  (req, res) => {
  // Call logout function with a callback
  req.logout((err) => { // Provide a callback function
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    console.log("User logged out successfully");
    // Redirect or send a response as needed
    // res.redirect("https://node-js-authentication-git-it.onrender.com/login"); // For example, redirect to the home page
    res.redirect("http://localhost:5173/login"); // For example, redirect to the home page
  });
});

// Manual Authentication

userRouter.post("/signup", recaptcha.middleware.verify, (req, res) => {
  userController.signUp(req, res);
});

userRouter.post("/login", recaptcha.middleware.verify, (req, res) => {
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
