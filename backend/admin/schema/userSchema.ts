import mongoose from 'mongoose'

interface iuser{
  id:string,
  name: string;
  email: string;
  phone: Number;
  password:string;
  role:String;
  experience:Number;
  approval: String
}

const userSchema = new mongoose.Schema<iuser>({
  id:{type:String , required:true} ,
  name:{type:String , required:true},
  email: {type:String, required:true},
  phone:{type:Number , required:true},
  role:{type:String , required:true},
  password:{type:String,require:true},
  experience:{type:String,require:true},
  approval:{type:String,require:true}
});


export default userSchema;
