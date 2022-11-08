import UserController from "../controllers/user.controller";
import { Router } from "express";
const router = Router();
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
export default router;
