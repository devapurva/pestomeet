import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import registerUser from '../schema/User-Schema.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import { success, error } from '../../utils/Success-Response.js';
var id = uuidv4();
const registerController = (reqest, response) => {
    const { name, email, phone, password, role, experience, approval } = reqest.body;
    const errors = validationResult(reqest);
    if (!errors.isEmpty()) {
        return response.json(error("Validation Error", errors.array(), 400));
    }
    const hash = bcrypt.hashSync(password, 10);
    let userDetails = mongoose.model("userModel", registerUser);
    let newUser = new userDetails({ "id": id, "name": name.toLowerCase(), "email": email.toLowerCase(), "phone": phone, "password": hash, "role": role.toLowerCase(), "experience": experience, "approval": approval });
    userDetails.findOne({ $or: [{ 'email': email.toLowerCase() }, { 'phone': phone }] }, function (error, result) {
        if (!error) {
            if (!result) {
                newUser.save(function (error, result) {
                    if (error) {
                        response.json({ message: error });
                    }
                    else {
                        response.json(success("User Registered Successfully", null, 200));
                    }
                });
            }
            else {
                console.log(result);
                response.json(error("User Already Available", null, 400));
            }
        }
        else {
            response.json(success("Error Happened while registering User, Try Again !", null, 400));
        }
    });
};
export default registerController;
