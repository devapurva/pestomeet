import express from 'express'
import deleteController from '../controller/deleteuser-controller'

const deleteRouter= express.Router()
deleteRouter.delete('/:id',deleteController)

export default deleteRouter;
