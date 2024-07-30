import { Router } from "express";
import usercontroller from "../controllers/UserController";
import tokenrequireMiddleware from "../middlewares/tokenrequireMiddleware";
const router = new Router();



router.post("/", usercontroller.post); // criar novo usuário
router.get("/", usercontroller.getall); // Listar todos os usuários
router.get("/:id", usercontroller.getuser); //obter dados de usuário sespecifico via id
router.put("/:id", tokenrequireMiddleware, usercontroller.update); // Atualizar usuário
export default router;

