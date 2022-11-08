import { Router } from "express";
const router = Router();
import userRoutes from "./user.routes";
import productRoutes from "./product.routes";
import cartRoutes from "./cart.routes"
router.use("/", productRoutes, userRoutes, cartRoutes);
export default router;
