import express from 'express';
import listController from '../controller/Listuser-Controller.js';
const listRouter = express.Router();
listRouter.get('/:status/:role', listController);
export default listRouter;
