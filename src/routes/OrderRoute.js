import tokenrequireMiddleware from "../middlewares/tokenrequireMiddleware";
import ordercontroller from "../controllers/OrderController";

import { Router } from "express";
const router = new Router();
router.post("/criar", tokenrequireMiddleware, ordercontroller.post);
router.post("/todospedidos",tokenrequireMiddleware, ordercontroller.getall);
router.post("/todospedidosdetalhados",tokenrequireMiddleware, ordercontroller.getalldetails);

router.post("/inseriritem", tokenrequireMiddleware, ordercontroller.insertitem);
router.post("/:id/atualizar", tokenrequireMiddleware, ordercontroller.updateitem);
router.post("/:id/fecharpedido", tokenrequireMiddleware, ordercontroller.closeorder);

export default router;
