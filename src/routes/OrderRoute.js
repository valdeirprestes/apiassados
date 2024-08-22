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
router.post("/:id/cancelar", tokenrequireMiddleware, ordercontroller.cancel);

router.post("/quantidade", tokenrequireMiddleware, ordercontroller.count);
router.get("/somaitemproduto", tokenrequireMiddleware, ordercontroller.somaproduto);


router.post("/criar2", tokenrequireMiddleware, ordercontroller.post2);
export default router;
