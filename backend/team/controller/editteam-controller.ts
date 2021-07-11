import editTeam from "../schema/team-schema.js";
import { validationResult } from "express-validator";
import { message } from "../../utils/success-response";

const ApprovalController = (request: any, response: any) => {
  let { teamName, teamType, mentorId, mentorName, teamMembers } = request.body;
  let id = request.params.id;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.json(message("Validation Error", errors.array(), false));
  }

  let editTeams = {
    teamName: teamName.toLowerCase(),
    teamType: teamType,
    mentorId: mentorId,
    mentorName: mentorName,
    teamMembers: teamMembers,
  };
  const doc = editTeam.findOneAndUpdate(
    { id: id },
    { $set: editTeams },
    { useFindAndModify: false, new: true },
    (errors: any, doc: any) => {
      if (errors) {
        response.json(message("Update Failed ! Please Try Again", null, false));
      } else if (!doc) {
        response.json(message("Couldn't Find the Team", null, true));
      } else {
        response.json(message("Team Updated Successfully", null, true));
      }
    }
  );
};

export default ApprovalController;
