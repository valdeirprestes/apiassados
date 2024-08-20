import { Router } from "express";
import categorycontroller from "../controllers/CategoryController";
import tokenrequireMiddleware from "../middlewares/tokenrequireMiddleware";
const route = new Router();
route.post('/', tokenrequireMiddleware, categorycontroller.post);
route.get("/", categorycontroller.getall);
route.put("/:id", categorycontroller.update);
export default route;