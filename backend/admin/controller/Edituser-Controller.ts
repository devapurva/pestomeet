import dotenv from'dotenv'
dotenv.config()
import EditUser from '../../schema/User-Schema.js'
import { validationResult } from 'express-validator';
import { pass,fail } from '../../utils/Success-Response.js'


const ApprovalController =(request:any,response:any)=>{
    let {name,email,phone,role,experience,approval}= request.body; 
    let id = request.params.id;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json(fail("Validation Error", errors.array(),400));
    }

    let editUser = {"id":id,"name":name.toLowerCase(),"email":email.toLowerCase(),"phone":phone,"role":role.toLowerCase(),"experience":experience,"approval":approval}
    const doc = EditUser.findOneAndUpdate({"id":id},{$set:editUser},{useFindAndModify: false ,new:true},function(errors:any,doc:any){
        if (errors) {
            response.json(pass("Update Failed ! Please Try Again",null,400))
        } else{
            response.json(fail("Status Updated Successfully",null,200))
        }
    })
    
}

export default ApprovalController;