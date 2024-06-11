/* 
Step to create an email
1. install an library nodemailer
2. import the library.
3. use inbuilt function createTransport which take an object.
*/

// importing an nodemailer
import "../../env.js";
import nodemailer from "nodemailer";

// creating a transporter
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.USER_PASSWORD,
  },
});

// creating an function to send an joinging mail.
async function emailServiceSignUp(userEmail, userName) {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Welcome to  Node Authentication ${userName}`,
      text: `You have a great choice ${userName} that you had selected our node authenticatio platform.`,
    });
    console.log("Email send successfully " + `to user ${userName}`);
  } catch (error) {
    console.log("Error while sending email to user", error);
  }
}

// creating email function to send an forgetPassword OTP link
export async function OPTVerifyEmail(userEmail, OTP) {
  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Regarding Reset Password",
      html: `OTP to reset password: <strong>${OTP}</strong>. This OTP will expire within 2 minutes.`,
    });
    console.log("Email send successfully " + `to user ${userEmail}`);
  } catch (error) {
    console.log("Error While sending otp to user", error);
  }
}

export default emailServiceSignUp;
