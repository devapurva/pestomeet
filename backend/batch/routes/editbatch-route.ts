import express from 'express'
import { body,check} from 'express-validator';
import editbatchController from '../controller/editbatch-controller'

const editbatchRouter= express.Router()

console.log("in router")

editbatchRouter.patch('/:id',check('batchName', 'teamName is required').not().isEmpty(),
check('batchOwner').not().isEmpty(),
check('batchMembers').not().isEmpty(),
editbatchController)

export default editbatchRouter;
