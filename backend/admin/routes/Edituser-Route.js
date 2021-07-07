import express from 'express';
import { check } from 'express-validator';
import editController from '../controller/Edituser-Controller.js';
const registerRouter = express.Router();
console.log("in router");
registerRouter.patch('/:id', check('name', 'Name is required').not().isEmpty(), check('email').not().isEmpty(), check('phone').not().isEmpty(), check('role').not().isEmpty(), check('approval').not().isEmpty(), editController);
export default registerRouter;
