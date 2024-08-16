import { Router } from "express";
import productcontroller from "../controllers/ProductController";
import tokenrequireMiddleware from "../middlewares/tokenrequireMiddleware";
import jsonemptyMiddleware from "../middlewares/jsonemptyMiddleware";
const router = new Router();

//router.post("/", jsonemptyMiddleware, tokenrequireMiddleware, productcontroller.post);
router.post("/", tokenrequireMiddleware, productcontroller.post);
router.get("/", productcontroller.getall);
router.put("/:id", tokenrequireMiddleware, productcontroller.update);
router.get("/:id", productcontroller.update);
router.post("/:id/foto", tokenrequireMiddleware, productcontroller.imgupload);

export default router;
