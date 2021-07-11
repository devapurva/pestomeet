import mongoose from 'mongoose'
import dotenv from'dotenv'
dotenv.config()

interface ITeam{
  teamId:string,
  teamName: string;
  teamType:string;
  mentorId:string;
  mentorName:string;
  teamMembers:Array<Object>
  lastupdateTime:{type:Date}
}

const teamSchema = new mongoose.Schema<ITeam>({
  teamId:{type:String , required:true} ,
  teamName:{type:String , required:true},
  ew  :{type:String,required:true},
  mentorId:{type:String,require:true},
  mentorName: {type:String, required:true},
  teamMembers:{type:Object , required:true}
  
});

const teamModel = mongoose.model(String(process.env.DB_TEAM_MODEL),teamSchema);
export default teamModel;
