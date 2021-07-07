import express from 'express';
import loginController from '../controller/Login-Controller.js';
const loginRouter = express.Router();
loginRouter.post('/', loginController);
export default loginRouter;
