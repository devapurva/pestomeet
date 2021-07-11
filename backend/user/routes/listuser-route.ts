import express from 'express'
import listController from '../controller/listuser-controller'

const listRouter= express.Router()
listRouter.get('/:status/:role',listController)

export default listRouter;
