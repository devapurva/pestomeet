import express from 'express';
import listteamController from '../controller/listteam-controller';
const listteamRouter = express.Router();
listteamRouter.get('/:type', listteamController);
export default listteamRouter;
