// Server Using Express
import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import cors from "cors"

import "./env.js";
import mongooseConnectToDB from "./src/config/mongooseConfig.js";
import router from "./routes.js";
const server = express();

const corsOptions = {
  origin: 'http://localhost:5173',
};

server.use(cors(corsOptions))

const port = process.env.PORT;
const hostname = process.env.HOST_NAME;

server.use(express.json());
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }));

// Middleware
server.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
  })
);
server.use(passport.initialize());
server.use(passport.session());

// router parent middleware;
server.use(router);

server.listen(port, () => {
  try {
    console.log(`Server is running at http://${hostname}:${port}`);
    mongooseConnectToDB();
  } catch (error) {
    console.error("Error while connecting to database", error);
  }
});
