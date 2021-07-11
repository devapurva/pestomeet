import express from 'express'
import deletebatchController from '../controller/deletebatch-controller'

const deletebatchRouter= express.Router()
deletebatchRouter.delete('/:id',deletebatchController)

export default deletebatchRouter;
