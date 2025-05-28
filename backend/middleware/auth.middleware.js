import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import BlacklistToken from "../models/blacklistToken.js";
import captainModel from "../models/captain.model.js";

//check if user is authenticated
export const authUser = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlacklisted = await BlacklistToken.findOne({ token });
    if(isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await userModel.findById(decoded._id);
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export const authCaptain = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }   
    const isBlacklisted = await BlacklistToken.findOne({ token });
    if(isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.captain = await captainModel.findById(decoded._id);
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}   

export default { authUser, authCaptain };
