import dotenv from 'dotenv';
dotenv.config();
import registerUser from '../../schema/user-schema.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import { pass, fail } from '../../utils/success-response.js';
var id = uuidv4();
const RegisterController = (reqest, response) => {
    const { name, email, phone, password, role, experience, approval } = reqest.body;
    const errors = validationResult(reqest);
    if (!errors.isEmpty()) {
        return response.json(fail("Validation Error", errors.array(), 400));
    }
    const hash = bcrypt.hashSync(password, 10);
    let newUser = new registerUser({ "id": id, "name": name.toLowerCase(), "email": email.toLowerCase(), "phone": phone, "password": hash, "role": role.toLowerCase(), "experience": experience, "approval": approval });
    registerUser.findOne({ $or: [{ 'email': email.toLowerCase() }, { 'phone': phone }] }, function (error, result) {
        if (!error) {
            if (!result) {
                newUser.save(function (error, result) {
                    if (error) {
                        response.json({ message: error });
                    }
                    else {
                        response.json(pass("User Registered Successfully", null, 200));
                    }
                });
            }
            else {
                console.log(result);
                response.json(fail("User Already Available", null, 400));
            }
        }
        else {
            response.json(pass("Error Happened while registering User, Try Again !", null, 400));
        }
    });
};
export default RegisterController;
