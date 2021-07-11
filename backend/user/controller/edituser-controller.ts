import EditUser from '../schema/user-schema.js'
import { validationResult } from 'express-validator';
import {message} from '../../utils/success-response.js'


const ApprovalController =(request:any,response:any)=>{
    let {name,email,phone,role,experience,approval}= request.body; 
    let id = request.params.id;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.json(message("Validation Error", errors.array(),false));
    }

    let editUser = {"id":id,"name":name.toLowerCase(),"email":email.toLowerCase(),"phone":phone,"role":role.toLowerCase(),"experience":experience,"approval":approval}
    const doc = EditUser.findOneAndUpdate({"id":id},{$set:editUser},{useFindAndModify: false ,new:true},(errors:any,doc:any)=>{
        if (errors) {
            response.json(message("Update Failed ! Please Try Again",null,false))
        } else if(!doc){
            response.json(message("Couldn't Find the user",null,false))
        } else{
            response.json(message("Status Updated Successfully",null,true))
        }
    })
    
}

export default ApprovalController;