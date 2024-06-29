// Server Using Express
import express from "express";
import { googlePassportConfig } from "../../middleware/authGoogle.middleware.js";

const authRouter = express.Router();



export default authRouter;
