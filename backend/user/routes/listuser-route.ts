import express from 'express'
import listController from '../controller/listuser-controller.js'

const listRouter= express.Router()
listRouter.get('/:status/:role',listController)

export default listRouter;
