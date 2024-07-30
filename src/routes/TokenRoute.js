import tokenController from "../controllers/TokenController";
import { Router } from "express";
const route = new Router();
route.post("/",tokenController.store);
export default route;