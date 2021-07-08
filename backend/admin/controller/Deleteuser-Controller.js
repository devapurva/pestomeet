import dotenv from 'dotenv';
dotenv.config();
import DeleteUser from '../../schema/user-schema.js';
import { pass, fail } from '../../utils/success-response.js';
const DeleteuserController = (request, response) => {
    const id = request.params.id;
    DeleteUser.findOneAndDelete({ "id": id }, {}, function (errors, docs) {
        if (errors) {
            response.json(fail("Error while deleting User", null, 400));
        }
        else if (!docs) {
            response.json(pass("User Not Found", docs, 200));
        }
        else {
            response.json(pass("User deleted successfully", docs, 200));
        }
    });
};
export default DeleteuserController;
