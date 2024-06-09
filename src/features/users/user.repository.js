import mongoose from "mongoose";
import UserModel from "./user.schema.js";
// import "../authSocial/auth.google.js";

// export const UserModel = mongoose.model("Users", userSchema);

export default class UserRepository {
  async signUp(userData) {
    // write your code here
    console.log("database", userData);
    // Verify that required fields are present
    console.log(userData.email);
    console.log(userData.name);
    if (!userData.email || !userData.name) {
      throw new Error("Missing required fields: email and name are required.");
    }
    try {
      const newUser = new UserModel(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      // Log the error to get more details
      console.error("Error in signUp:", error);

      // Customize the error message based on the type of error
      if (error.name === "ValidationError") {
        throw new Error("Validation error occurred", 400);
      } else if (error.name === "MongoError" && error.code === 11000) {
        throw new Error("Duplicate key error", 409);
      } else {
        throw new Error("Something went wrong with database", 500);
      }
    }
  }

  async findByEmail(email) {
    // write your code here
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error("Something went wrong with database", 500);
    }
  }

  async resetPassword(userID, newPassword) {
    // write your code here
    try {
      const resetUser = await UserModel.findByIdAndUpdate(userID);
      if (!resetUser) {
        throw new Error("User not found", 404);
      }
      resetUser.password = newPassword;
      await resetUser.save();
      return resetUser;
    } catch (error) {
      throw new Error("Something went wrong with database", 500);
    }
  }

  async requestResetPassword(userID, otp, currentTime) {
    try {
      const requestUserPassword = await UserModel.findByIdAndUpdate(
        userID,
        {
          otp,
        },
        {
          isExpireOtp: currentTime,
        }
      );
      if (!requestUserPassword) {
        throw new Error("User not found", 404);
      }
      return requestUserPassword;
    } catch (error) {
      throw new Error("Something went wrong with database", 500);
    }
  }

  async verifyOTP(userID) {
    try {
      const otpVerify = await UserModel.findById(userID);
      return otpVerify;
    } catch (error) {
      throw new Error("Something went wrong with database", 500);
    }
  }
}
