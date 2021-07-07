import express from 'express';
import { body } from 'express-validator';
import registerController from '../controller/Register-Controller.js';
const registerRouter = express.Router();
registerRouter.post('/', body('email').isEmail(), body('phone').isNumeric(), registerController);
export default registerRouter;
