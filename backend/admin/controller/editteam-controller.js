import dotenv from 'dotenv';
dotenv.config();
import editTeam from '../../schema/team-schema.js';
import { validationResult } from 'express-validator';
import { pass, fail } from '../../utils/success-response.js';
const ApprovalController = (request, response) => {
    let { teamName, teamType, mentorId, mentorName, teamMembers } = request.body;
    let id = request.params.id;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json(fail("Validation Error", errors.array(), 400));
    }
    let editTeams = { "teamName": teamName.toLowerCase(), "teamType": teamType, "mentorId": mentorId, "mentorName": mentorName, "teamMembers": teamMembers };
    const doc = editTeam.findOneAndUpdate({ "id": id }, { $set: editTeams }, { useFindAndModify: false, new: true }, function (errors, doc) {
        if (errors) {
            response.json(fail("Update Failed ! Please Try Again", null, 400));
        }
        else {
            response.json(pass("Team Updated Successfully", null, 200));
        }
    });
};
export default ApprovalController;
