import express from 'express';
import createteamController from '../controller/createteam-controller.js';
const createteamRouter = express.Router();
createteamRouter.post('/', createteamController);
export default createteamRouter;
