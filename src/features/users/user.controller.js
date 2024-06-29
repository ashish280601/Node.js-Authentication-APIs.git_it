import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserRepository from "./user.repository.js";
import "../../../env.js";
import emailServiceSignUp, {
  OPTVerifyEmail,
} from "../../services/emailService.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  // Social Authentication Function
  async googleLogin(req, res) {
    try {
      // Check if req.user is populated
      if (!req.user) {
        res.json({
          data: {
            message: "User not found",
            status: false,
          }
        });
      }

      console.log("Authenticated user:", req.user);

      // Generate a token with the user information
      // const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.SECRET_KEY, { expiresIn: '24h' }); // Ensure you have JWT_SECRET in your environment variables
      const status = true;

      // Correctly format the redirection URL with query parameters
      const redirectUrl = `http://localhost:5173/?status=${status}`;

      console.log("Redirecting to:", redirectUrl);
      // Redirect to frontend with the token and status as query parameters
      res.redirect(redirectUrl);

    } catch (error) {
      console.error("Error during Google login:", error);

      res.json({
        data: {
          message: "Login Failed",
          status: false,
        }
      });
    }
  }

  // Manual Authentication Function  

  async signUp(req, res) {
    // write your code here
    try {
      // console.log(req.body);
      const { name, email, password } = req.body;

      if (!password) {
        return res.status(400).json({
          message: "Password is required",
          status: false,
        });
      }
      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(password, saltRound);
      console.log("hashedPassword", hashedPassword);
      const userData = {
        name,
        email,
        password: hashedPassword,
      };
      // console.log("userData", userData);
      const newUser = await this.userRepository.signUp(userData);
      // console.log("newUser", newUser);
      await emailServiceSignUp(newUser.email, newUser.name);
      return res.status(200).json({
        newUser,
        message: "User created successfully",
        status: true,
      });
    } catch (error) {
      // console.log("Error in signUp", error);
      return res.status(500).json({
        message: "Something went wrongs",
        status: 500,
      });
    }
  }

  async signIn(req, res) {
    // write your code here
    console.log(req.body);
    try {
      const { email, password, isAuth } = req.body;

      if (req.recaptcha.error) {
        return res.status(400).json({
          message: "reCAPTCHA verification failed. Please try again.",
          status: false,
        });
      }

      // finding the email user is present or not
      const user = await this.userRepository.findByEmail(email);
      // if email user is not found send error
      if (!user) {
        return res.status(400).json({
          message: "Invalid user email credentials",
          status: false,
        });
      } else {
        // compare the passowrd
        const result = await bcrypt.compare(password, user.password);
        // password matches then generate a token
        if (result) {
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
              name: user.name,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "1hr",
            }
          );
          return res.status(200).json({
            data: {
              message: "User Login Successful",
              status: true,
              userID: user._id,
              email: user.email,
              token,
            }
          });
        }
        return res.status(400).json({
          message: "Invalid user password credentials",
          status: false,
        });
      }
    } catch (error) {
      console.log("Error in signIn", error);
      return res.status(500).json({
        message: "Something went wrongs",
        status: 500,
      });
    }
  }

  async requestResetPassword(req, res) {
    console.log(req.body);
    try {
      const userID = req.userID;

      // generate otp
      const otp = Math.floor(100000 + Math.random() * 900000);

      const resetPasswordRequest =
        await this.userRepository.requestResetPassword(userID, otp.toString());
      // console.log("resetPasswordRequest", resetPasswordRequest);
      await OPTVerifyEmail(resetPasswordRequest.email, otp.toString());
      return res.status(200).json({
        message: "OTP send successfully",
        status: true,
      });
    } catch (error) {
      // console.log("Error while generating request reset password", error);
      return res.status(500).json({
        message: "Something went wrongs",
        status: 500,
      });
    }
  }

  async VerifyOTP(req, res, next) {
    try {
      const { otp } = req.body;
      const userID = req.userID;

      const isValid = await this.userRepository.verifyOTP(userID);
      if (otp !== isValid.otp) {
        return res.status(400).json({
          message: "OTP is not valid",
          status: false,
        });
      } else {
        return res.status(200).json({
          message: "OTP verified successfully",
          status: true,
        });
      }
    } catch (error) {
      // console.log("Error while reset password", error);
      return res.status(500).json({
        message: "Something went wrong",
        status: 500,
      });
    }
    next();
  }

  async resetPassword(req, res) {
    try {
      // console.log(req.body);
      const { newPassword } = req.body;
      const userID = req.userID;

      // checking if newUpdate password is provided or not
      if (!newPassword) {
        return res.status(400).json({
          message: "New Password is required",
          status: false,
        });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updateUserPassword = await this.userRepository.resetPassword(
        userID,
        hashedNewPassword
      );
      return res.status(200).json({
        updateUserPassword,
        message: "Password updated successfully",
        status: true,
      });
    } catch (error) {
      // console.log("Error while reset password", error);
      return res.status(500).json({
        message: "Something went wrong",
        status: 500,
      });
    }
  }
}
