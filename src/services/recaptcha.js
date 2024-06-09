import { RecaptchaV3 } from "express-recaptcha";
import "../../env.js"

console.log(process.env.RECAPTCHA_SECRET_KEY);
console.log(process.env.RECAPTCHA_SITE_KEY);
const recaptcha = new RecaptchaV3(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY)

export default recaptcha