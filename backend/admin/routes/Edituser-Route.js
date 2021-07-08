import express from 'express';
import { check } from 'express-validator';
import editController from '../controller/edituser-controller.js';
const edituserRouter = express.Router();
console.log("in router");
edituserRouter.patch('/:id', check('name', 'Name is required').not().isEmpty(), check('email').not().isEmpty(), check('phone').not().isEmpty(), check('role').not().isEmpty(), check('approval').not().isEmpty(), editController);
export default edituserRouter;
