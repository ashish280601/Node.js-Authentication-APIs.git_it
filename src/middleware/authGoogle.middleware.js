/* 
Step to create a social authentication
1. To create an google developer tools credential project to get client & secret id
2. Install the passport & passport-google-auth20.
3. Configure the GoogleStrategy
4. Create a function to save the data of an google username and email
5. Check wheather the data is already exist or not if not then create else use the existing data.

Link --> https://github.com/jaredhanson/passport-google-oauth2?tab=readme-ov-file
*/

// importing the social google library
import passport from "passport";
import { Strategy as GoogleStrategy} from "passport-google-oauth20";
import authModel from "../features/authSocial/auth.schema.js";
import emailServiceSignUp from "../services/emailService.js";

// configuring my google authentication
export const googlePassportConfig = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:7000/api/auth/google/callback",
      scope: ["profile", "email"],
      state: true,
    },
    async function verify(accessToken, refreshToken, profile, cb) {
      try {
        // Find or create user in the database based on Google profile
        let user = await authModel.findOne({ $or: [{ googleID: profile.id }, { email: profile.emails[0].value }] });

        if (!user) {
          // Create a user if not found in the database
          user = new authModel({
            googleID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value, // Assuming you want to store the email
          });
          user = await user.save();
          await emailServiceSignUp(user.email, user.name);
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await authModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});