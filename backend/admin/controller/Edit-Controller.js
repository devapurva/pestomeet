import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import registerUser from '../schema/userSchema.js';
import { validationResult } from 'express-validator';
import { success, error } from '../../utils/Success-Response.js';
const approvalController = (req, res, next) => {
    let { name, email, phone, role, experience, approval } = req.body;
    let id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(error("Validation Error", errors.array(), 400));
    }
    let userDetails = mongoose.model("userModel", registerUser);
    let editUser = { "id": id, "name": name.toLowerCase(), "email": email.toLowerCase(), "phone": phone, "role": role.toLowerCase(), "experience": experience, "approval": approval };
    const doc = userDetails.findOneAndUpdate({ "id": id }, { $set: editUser }, { useFindAndModify: false, new: true }, function (errors, doc) {
        if (errors) {
            res.json(success("Update Failed ! Please Try Again", null, 400));
        }
        else {
            res.json(error("Status Updated Successfully", null, 200));
        }
    });
};
export default approvalController;
