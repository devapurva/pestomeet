import deleteBatch from '../schema/batch-schema.js'
import {message} from '../../utils/success-response.js'


const DeleteteamController =(request:any,response:any)=>{
    const id = request.params.id;
    deleteBatch.findOneAndDelete({"teamId":id},{},(errors:any,docs:any)=>{
        if (errors) {
                response.json(message("Error while deleting batch",null,false))
            }else if(!docs){
                response.json(message("batch Not Found",docs,true))
            }else{
                response.json(message("batch deleted successfully",docs,false))
            }
        })
    
}

export default DeleteteamController;