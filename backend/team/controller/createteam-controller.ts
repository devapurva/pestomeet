import registerTeam from '../schema/team-schema.js'
import { v4 as uuidv4 } from 'uuid';
import {message} from '../../utils/success-response.js'


var teamId = uuidv4();
const RegisterteamController = (reqest:any,response:any)=>{

const {teamName,teamType,mentorId,mentorName,teamMembers} = reqest.body;
let newTeam = new registerTeam({"teamId":teamId,"teamName":teamName.toLowerCase(),"teamType":teamType,"mentorId":mentorId,"mentorName":mentorName,"teamMembers":teamMembers})

registerTeam.findOne({'teamName':teamName.toLowerCase()},(error:any,result:any)=>{
    if(error){
        response.json(message("Error Happened while registering Team, Try Again !",null,false))
    }else if(!result){
        newTeam.save((error:any,result:any)=>{
                    if (error){response.json({message:error}); }
                    else{response.json(message("Team Registered Successfully",null,false))}})
      }else{
        response.json(message("Team name is already taken",null,false))
      }
  })

}

export default RegisterteamController
