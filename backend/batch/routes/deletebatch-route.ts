import express from 'express'
import deletebatchController from '../controller/deletebatch-controller.js'

const deletebatchRouter= express.Router()
deletebatchRouter.delete('/:id',deletebatchController)

export default deletebatchRouter;
