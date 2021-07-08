import mongoose from 'mongoose';
const teamSchema = new mongoose.Schema({
    teamId: { type: String, required: true },
    teamName: { type: String, required: true },
    teamType: { type: String, required: true },
    mentorId: { type: String, require: true },
    mentorName: { type: String, required: true },
    teamMembers: { type: Object, required: true }
});
const teamModel = mongoose.model("teamModel", teamSchema);
export default teamModel;
