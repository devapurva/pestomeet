import express from 'express'
import mongoose from 'mongoose'
import deleteTeam from '../schema/team-schema'
import { message } from '../../utils/success-response'


const DeleteteamController =(request:any,response:any)=>{
    const id = request.params.id;
    deleteTeam.findOneAndDelete({"teamId":id},{},(errors:any,docs:any)=>{
        if (errors) {
                response.json(message("Error while deleting User",null,false))
            }else if(!docs){
                response.json(message("Team Not Found",docs,false))
            }else{
                response.json(message("Team deleted successfully",docs,true))
            }
        })
    
}

export default DeleteteamController;