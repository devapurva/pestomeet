import express, {Router}  from 'express'
import createbatchController from '../controller/createbatch-controller'


const createbatchRouter:Router= express.Router()
createbatchRouter.post('/',createbatchController)

export default createbatchRouter;
