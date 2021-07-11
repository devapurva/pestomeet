import dotenv from'dotenv'
dotenv.config()
import registerTeam from '../../schema/team-schema.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import {validationResult } from 'express-validator';
import { pass,fail } from '../../utils/success-response.js'


var teamId = uuidv4();
const RegisterteamController = (reqest:any,response:any)=>{

const {teamName,teamType,mentorId,mentorName,teamMembers} = reqest.body;
let newTeam = new registerTeam({"teamId":teamId,"teamName":teamName.toLowerCase(),"teamType":teamType,"mentorId":mentorId,"mentorName":mentorName,"teamMembers":teamMembers})

registerTeam.findOne({'teamName':teamName.toLowerCase()},function(error:any,result:any){
    if(!error){
      if(!result){
        newTeam.save(function(error:any,result:any){
                    if (error){response.json({message:error}); }
                    else{response.json(pass("Team Registered Successfully",null,200))}})
      }else{
        response.json(fail("Team name is already taken",null,400))
      }
    } else{
        response.json(pass("Error Happened while registering Team, Try Again !",null,400))
    }
  })

}

export default RegisterteamController
