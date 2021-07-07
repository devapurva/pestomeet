import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import registerUser from '../schema/User-Schema.js';
import { success } from '../../utils/Success-Response.js';
const users = [];
const loginController = (req, res, next) => {
    const { email, phone, password } = req.body;
    let userDetails = mongoose.model("userModel", registerUser);
    userDetails.findOne({ $or: [{ 'email': email.toLowerCase() }, { 'phone': phone }] }, function (error, result) {
        if (!error) {
            if (!result) {
                res.json(error("User is not registered with us", null, 400));
            }
            else if (bcrypt.compareSync(password, result.password)) {
                console.log("JWT Token Created");
                console.log(result);
                var key = process.env.JWT_SECRET;
                try {
                    jwt.sign({ auth: true, name: result.name, id: result.id, role: result.role }, key, function (error, token) {
                        if (error) {
                            res.json(error("Login Error", error, 400));
                        }
                        else {
                            res.json(success("Login Success", token, 200));
                            console.log(token);
                        }
                    });
                }
                catch (_a) {
                    res.json(error("Authentication Error", null, 400));
                }
            }
            else if (!bcrypt.compareSync(password, result.password)) {
                res.json(error("Wrong Username/Password", null, 400));
            }
            else {
                res.json(error("Error Happened while registering User, Try Again !", null, 400));
            }
        }
        else {
            res.json(error("Error Happened while registering User, Try Again !", null, 400));
        }
    });
};
export default loginController;
