import express, {Router}  from 'express'
import createteamController from '../controller/createteam-controller.js'



const createteamRouter:Router= express.Router()
createteamRouter.post('/',createteamController)

export default createteamRouter;
