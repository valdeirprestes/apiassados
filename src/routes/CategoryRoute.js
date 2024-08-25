import { Router } from "express";
import categorycontroller from "../controllers/CategoryController";
import tokenrequireMiddleware from "../middlewares/tokenrequireMiddleware";
const route = new Router();
route.post('/', tokenrequireMiddleware, categorycontroller.post);
route.post("/todos", categorycontroller.getall);
route.put("/:id", tokenrequireMiddleware, categorycontroller.update);
route.post("/quantidade", tokenrequireMiddleware, categorycontroller.count)
route.get("/:id", tokenrequireMiddleware, categorycontroller.get);
export default route;
