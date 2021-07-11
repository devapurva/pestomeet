import express from 'express';
import listteamController from '../controller/listteam-controller.js';
const listteamRouter = express.Router();
listteamRouter.get('/:type', listteamController);
export default listteamRouter;
