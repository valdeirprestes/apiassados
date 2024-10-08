import { Router } from "express";
import movementcontroller from "../controllers/MovementController";
import tokenrequiremiddleware from "../middlewares/tokenrequireMiddleware";
const router = new Router();
router.post("/", tokenrequiremiddleware, movementcontroller.post);
router.post("/todos", movementcontroller.getall);
router.get("/:id", movementcontroller.get);

//open and close movement
router.post("/fechar", tokenrequiremiddleware, movementcontroller.close);
router.post("/reabrir", tokenrequiremiddleware, movementcontroller.reopen);


router.post("/quantidade", tokenrequiremiddleware, movementcontroller.count);
export default router;