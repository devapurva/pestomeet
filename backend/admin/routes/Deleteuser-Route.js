import express from 'express';
import deleteController from '../controller/deleteuser-controller.js';
const deleteRouter = express.Router();
deleteRouter.delete('/:id', deleteController);
export default deleteRouter;
