import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,
  },
  isExpireOtp: {
    type: Date,
  }
});

const UserModel = mongoose.model("Users", userSchema)

export default UserModel;

