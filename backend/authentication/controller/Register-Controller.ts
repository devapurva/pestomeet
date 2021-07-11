import registerUser from '../../user/schema/user-schema.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import {validationResult } from 'express-validator';
import {message} from '../../utils/success-response.js'


const id = uuidv4();
const RegisterController = (reqest:any,response:any)=>{

const {name,email,phone,password,role,experience,approval} = reqest.body;
const errors = validationResult(reqest);
    if (!errors.isEmpty()) {
      return response.json(message("Validation Error",errors.array(),false));
    }

const hash = bcrypt.hashSync(password,10);
const newUser = new registerUser({"id":id,"name":name.toLowerCase(),"email":email.toLowerCase(),"phone":phone,"password":hash,"role":role.toLowerCase(),"experience":experience,"approval":approval})

registerUser.findOne({$or:[{'email':email.toLowerCase()},{'phone':phone}]},(error:any,result:any)=>{
    if(error){
      response.json(message("Error Happened while registering User, Try Again !",null,false))
    }else if(!result){
        newUser.save((error:any,result:any)=>{
                    if (error){response.json({message:error}); }
                    else{response.json(message("User Registered Successfully",null,true))}})
    }else{
        console.log(result)
        response.json(message("User Already Available",null,false))
      }
  })

}

export default RegisterController
