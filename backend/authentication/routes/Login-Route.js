import express from 'express';
import loginController from '../controller/login-controller.js';
const loginRouter = express.Router();
loginRouter.post('/', loginController);
export default loginRouter;
