 import express from "express";
 import cors from "cors";
 import dotenv from "dotenv";
 import connectDB from "./config/db.js";
 import userRoutes from "./routes/user.route.js";

 dotenv.config();

 const app = express();

 app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));

 connectDB();

 app.get("/", (req, res) => {
    res.send("Hello World");
 });

 app.use("/users", userRoutes);

export default app;