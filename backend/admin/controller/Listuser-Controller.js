import dotenv from 'dotenv';
dotenv.config();
import listUser from '../../schema/User-Schema.js';
import { pass, fail } from '../../utils/Success-Response.js';
const ListuserController = (request, response) => {
    const status = request.params.status;
    const role = request.params.role;
    listUser.find({ "approval": status, "role": role }, function (errors, result) {
        if (!errors) {
            if (result.length == 0) {
                response.json(pass("No user is in " + String(status) + " Status", null, 200));
            }
            else {
                response.json(pass(String(result.length) + " users on " + String(status) + " Status", result, 200));
            }
        }
        else {
            response.json(fail("Error while reteriving user", errors, 400));
        }
    });
};
export default ListuserController;
