import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    role: { type: String, required: true },
    password: { type: String, require: true },
    experience: { type: String, require: true },
    approval: { type: String, require: true }
});
const userModel = mongoose.model("userModel", userSchema);
export default userModel;
