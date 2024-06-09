import { RecaptchaV3 } from "express-recaptcha";
import "../../env.js";

const recaptcha = new RecaptchaV3(
  process.env.RECAPTCHA_SITE_KEY,
  process.env.RECAPTCHA_SECRET_KEY
);

export default recaptcha;
