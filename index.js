import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import bodyParser from "body-parser";
import cors from "cors";

import "./env.js";
import mongooseConnectToDB from "./src/config/mongooseConfig.js";
import router from "./routes.js";

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

const corsOptions = {
  origin: ['https://node-js-authentication-git-it.onrender.com', 'http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials
};

// Example middleware to set CORS headers
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://node-js-authentication-git-it.onrender.com'); // Replace with your frontend URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow cookies/sessions
  next();
});

server.use(cors(corsOptions));

const port = process.env.PORT || 3622;
const hostname = process.env.HOST_NAME;

server.use(express.json());
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }));

// MongoDB URI
const mongoUri = process.env.URL;

// Middleware
server.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: 'sessions',
    }),
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true if using HTTPS
  })
);

server.use(passport.initialize());
server.use(passport.session());

// Serve static files from the React app
server.use(express.static(path.join(__dirname, 'dist')));

// Router parent middleware
server.use(router);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

server.listen(port, async () => {
  try {
    console.log(`Server is running at ${port}`);
    await mongooseConnectToDB();
  } catch (error) {
    console.error("Error while connecting to database", error);
  }
});
