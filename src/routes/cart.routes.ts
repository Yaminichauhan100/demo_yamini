import cartController from "../controllers/cart.controller"
import verifytoken from "../middlewares/user.middleware"
import {Router} from "express";
const router = Router();
router.post('/addtocart',verifytoken,cartController.addToCart)
router.get('/getitems',verifytoken,cartController.getItems)
router.delete('/deletecart/:id',verifytoken,cartController.removeCartById)
router.delete('/deleteproductfromcart',verifytoken,cartController.removeProductFromCart)
router.patch('/updatecart',verifytoken,cartController.updateProductQuantity)
export default router;