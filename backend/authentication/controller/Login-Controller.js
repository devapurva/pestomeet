import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import registerUser from '../../schema/User-Schema.js';
import { pass, fail } from '../../utils/Success-Response.js';
const users = [];
const LoginController = (request, response) => {
    const { email, phone, password } = request.body;
    registerUser.findOne({ $or: [{ 'email': email.toLowerCase() }, { 'phone': phone }] }, function (error, result) {
        if (!error) {
            if (!result) {
                response.json(fail("User is not registered with us", null, 400));
            }
            else if (bcrypt.compareSync(password, result.password)) {
                console.log("JWT Token Created");
                console.log(result);
                var key = process.env.JWT_SECRET;
                try {
                    jwt.sign({ auth: true, name: result.name, id: result.id, role: result.role }, key, function (error, token) {
                        if (error) {
                            response.json(fail("Login Error", error, 400));
                        }
                        else {
                            response.json(pass("Login Success", token, 200));
                            console.log(token);
                        }
                    });
                }
                catch (_a) {
                    response.json(fail("Authentication Error", null, 400));
                }
            }
            else if (!bcrypt.compareSync(password, result.password)) {
                response.json(fail("Wrong Username/Password", null, 400));
            }
            else {
                response.json(fail("Error Happened while registering User, Try Again !", null, 400));
            }
        }
        else {
            response.json(fail("Error Happened while registering User, Try Again !", null, 400));
        }
    });
};
export default LoginController;
