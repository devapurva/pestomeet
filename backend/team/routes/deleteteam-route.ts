import express from 'express'
import deleteteamController from '../controller/deleteteam-controller'

const deleteteamRouter= express.Router()
deleteteamRouter.delete('/:id',deleteteamController)

export default deleteteamRouter;
