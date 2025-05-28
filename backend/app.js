 import express from "express";
 import cors from "cors";
 import dotenv from "dotenv";
 import connectDB from "./config/db.js";
 import userRoutes from "./routes/user.routes.js";
 import cookieParser from "cookie-parser";   
 import captainRoutes from "./routes/captain.routes.js";

 dotenv.config();

 const app = express();

 app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use(cookieParser());

 connectDB();

 app.get("/", (req, res) => {
    res.send("Hello World");
 });

 app.use("/users", userRoutes);
 app.use("/captains", captainRoutes);

export default app;