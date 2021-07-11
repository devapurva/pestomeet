import express, {Router}  from 'express'
import createteamController from '../controller/createteam-controller'



const createteamRouter:Router= express.Router()
createteamRouter.post('/',createteamController)

export default createteamRouter;
