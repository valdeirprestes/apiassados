import tokenrequiremiddleware from "../middlewares/tokenrequireMiddleware";
import { Router } from "express";
import stockcontroller from "../controllers/StockController";
const route = new Router();

route.get("/",tokenrequiremiddleware, stockcontroller.getall);

route.post("/adicionar", tokenrequiremiddleware, stockcontroller.add);
route.post("/remover", tokenrequiremiddleware, stockcontroller.sub);

route.get("/quantidade", tokenrequiremiddleware, stockcontroller.count);
route.get("/saldo", tokenrequiremiddleware, stockcontroller.saldo);
export default route;