import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "First name must be at least 3 characters long"],
        },
        lastname: {
            type: String,
            minlength: [3, "Last name must be at least 3 characters long"],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // match: [
        //     /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        //     "Please enter a valid email address",
        // ],
        minlength: [5, "Email must be at least 3 characters long"],
    },
    password: {
        type: String,
        required: true,
        select: false, //when we get user from db, password will not be included
    },
    socketId: {
        //we'll use this for sending live location of driver with user
        type: String,
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    return token;
}

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model("user", userSchema);
//"user" is the name of the collection that will be created in mongodb
//when mongoose creates a collection, it pluralizes and lowercases the name of the model
//so in this case, the collection will be "users"

export default userModel;

