import captainModel from "../models/captain.model.js";
import captainService from "../services/captain.service.js";
import { validationResult } from "express-validator";

const registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password, vehicle } = req.body;

    //check if captain already exists
    const existingCaptain = await captainModel.findOne({email}).select("+password");
    if(existingCaptain) {
        return res.status(400).json({ message: "Captain already exists" });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const newCaptain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = newCaptain.generateAuthToken();

    res.status(201).json({ newCaptain, token });

}

export default { registerCaptain };
