import mongoose from 'mongoose'

interface iteam{
  teamId:string,
  teamName: string;
  teamType:string;
  mentorId:string;
  mentorName:string;
  teamMembers:Array<Object>
}

const teamSchema = new mongoose.Schema<iteam>({
  teamId:{type:String , required:true} ,
  teamName:{type:String , required:true},
  teamType:{type:String,required:true},
  mentorId:{type:String,require:true},
  mentorName: {type:String, required:true},
  teamMembers:{type:Object , required:true}
  
});

const teamModel = mongoose.model("teamModel",teamSchema);
export default teamModel;
