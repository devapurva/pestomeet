import listTeam from '../schema/team-schema'
import {message} from '../../utils/success-response'


const ListteamController =(request:any,response:any)=>{
    const teamType = request.params.type;
    listTeam.find({"teamType":teamType},(errors:any,result:any)=>{
        if (errors) {
            response.json(message("Error while reteriving team",errors,false))
        }else if(result.length==0){
            response.json(message("No "+String(teamType)+" Team found",null,false))
        }else{
            response.json(message(String(result.length)+" "+String(teamType)+" Teams Found",result,true))
            }
    })   
}

export default ListteamController;