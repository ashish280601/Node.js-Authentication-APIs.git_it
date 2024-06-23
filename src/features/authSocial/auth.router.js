// Server Using Express
import express from "express";
import { googlePassportConfig } from "../../middleware/authGoogle.middleware.js";

const authRouter = express.Router();

authRouter.get(
  "/google",
  googlePassportConfig.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  googlePassportConfig.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log(req.body);
    // Successful authentication, redirect to dashboard or user profile
    res.redirect("https://node-js-authentication-git-it.onrender.com/");
  }
);

authRouter.get("/logout", (req, res) => {
  // Call logout function with a callback
  req.logout((err) => { // Provide a callback function
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    console.log("User logged out successfully");
    // Redirect or send a response as needed
    res.redirect("https://node-js-authentication-git-it.onrender.com/login"); // For example, redirect to the home page
  });
});

export default authRouter;
