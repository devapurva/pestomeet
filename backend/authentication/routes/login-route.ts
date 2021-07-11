import express, { Router } from "express";
import loginController from "../controller/login-controller";

const loginRouter: Router = express.Router();
loginRouter.post("/", loginController);

export default loginRouter;
