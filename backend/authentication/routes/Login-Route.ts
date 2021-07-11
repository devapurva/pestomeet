import express, {Router}  from 'express'
import loginController from '../controller/login-controller.js'



const loginRouter:Router= express.Router()
loginRouter.post('/',loginController)

export default loginRouter;
