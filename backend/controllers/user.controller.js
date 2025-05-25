import userModel from "../models/user.model.js";
import userService from "../services/user.service.js";
import { validationResult } from "express-validator";

//register user
export const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    //check if user already exists
    const user = await userModel.findOne({ email });
    if(user) {
        return res.status(400).json({ message: "Account already exists. Please login to continue" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const newUser = await userService.createUser({ fullname, email, password: hashedPassword });

    const token = newUser.generateAuthToken();

    res.status(201).json({ newUser, token }); 
    //res.status(201).json({ message: "User created successfully" }); 
}

//login user
export const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    //check if user doesn't exist
    const user = await userModel.findOne({ email }).select("+password");
    if(!user) {
        return res.status(401).json({ message: "Account does not exist. Sign up to continue" });
    }

    //check if password is correct
    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = user.generateAuthToken();
    res.status(200).json({ user, token });
}


export default { registerUser, loginUser };
