import express from 'express';
import listbatchController from '../../batch/controller/listbatch-controller';


const listbatchRouter = express.Router();
listbatchRouter.get('/:type', listbatchController);


export default listbatchRouter;
