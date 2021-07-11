import mongoose from 'mongoose'

interface IUser{
  id:string,
  name: string;
  email: string;
  phone: Number;
  password:string;
  role:String;
  experience:Number;
  approval: String
}

const userSchema = new mongoose.Schema<IUser>({
  id:{type:String , required:true} ,
  name:{type:String , required:true},
  avatar:{type:String},
  email: {type:String, required:true},
  phone:{type:Number , required:true},
  role:{type:String , required:true},
  password:{type:String,require:true},
  experience:{type:String,require:true},
  approval:{type:String,require:true}
});

const userModel = mongoose.model(String(process.env.DB_USER_MODEL),userSchema);
export default userModel;
