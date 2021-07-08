import dotenv from'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import deleteTeam from '../../schema/team-schema.js'
import { pass,fail } from '../../utils/success-response.js'


const DeleteteamController =(request:any,response:any)=>{
    const id = request.params.id;
    deleteTeam.findOneAndDelete({"teamId":id},{},function(errors:any,docs:any){
        if (errors) {
                response.json(fail("Error while deleting User",null,400))
            }else if(!docs){
                response.json(pass("Team Not Found",docs,200))
            }else{
                response.json(pass("Team deleted successfully",docs,200))
            }
        })
    
}

export default DeleteteamController;