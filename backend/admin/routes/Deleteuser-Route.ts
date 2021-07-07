import express from 'express'
import deleteController from '../controller/Deleteuser-Controller.js'

const deleteRouter= express.Router()
deleteRouter.delete('/:id',deleteController)

export default deleteRouter;
