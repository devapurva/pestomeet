import listUser from "../schema/user-schema";
import { message } from "../../utils/success-response";

const ListuserController = (request: any, response: any) => {
  const status = request.params.status;
  const role = request.params.role;
  listUser
    .find({ approval: status, role: role }, (errors: any, result: any) => {
      if (errors) {
        response.json(message("Error while reteriving user", errors, false));
      } else if (result.length == 0) {
        response.json(
          message("No user is in " + String(status) + " Status", null, false)
        );
      } else {
        response.json(
          message(
            String(result.length) + " users on " + String(status) + " Status",
            result,
            true
          )
        );
      }
    })
    .select("-password")
    .select("-_id");
};

export default ListuserController;
