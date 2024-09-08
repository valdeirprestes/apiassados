import tokenrequiremiddleware from "../middlewares/tokenrequireMiddleware";
import { Router } from "express";
import stockcontroller from "../controllers/StockController";
const route = new Router();

route.post("/todos",tokenrequiremiddleware, stockcontroller.getall);

route.post("/adicionar", tokenrequiremiddleware, stockcontroller.add);
route.post("/remover", tokenrequiremiddleware, stockcontroller.sub);

route.post("/quantidade", tokenrequiremiddleware, stockcontroller.count);
route.post("/saldo", tokenrequiremiddleware, stockcontroller.saldo);
export default route;
