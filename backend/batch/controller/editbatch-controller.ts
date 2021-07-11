import editBatch from '../schema/batch-schema.js'
import { validationResult } from 'express-validator';
import {message} from '../../utils/success-response.js'


const ApprovalController =(request:any,response:any)=>{
    const {batchName,batchType,batchOwner,batchMembers}= request.body; 
    const batchId = request.params.id;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.json(message("Validation Error", errors.array(),false));
    }

    let editBatches = {"batchName":batchName.toLowerCase(),"batchType":batchType,"batchOwner":batchOwner,"batchMembers":batchMembers}
    const doc = editBatch.findOneAndUpdate({"batchId":batchId},{$set:editBatches},{useFindAndModify: false ,new:true},(errors:any,doc:any)=>{
        if (errors) {
            response.json(message("Update Failed ! Please Try Again",null,false))
        } else if(doc== null){
            response.json(message("Couldn't Find the Batch",null,true))
        }else{
            response.json(message("Batch updated successfully",null,false))
        }
    })
    
}

export default ApprovalController;