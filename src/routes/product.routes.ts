import productController from "../controllers/product.controller";
import {Router} from "express";
import upload from "../fileupload/image";
const router = Router();
router.post('/createproduct', upload.single('image'),productController.createProduct)
router.get('/getproduct', productController.getProducts)
router.get('/getproductbyid/:id', productController.getProductsById)
router.delete('/removeproductbyid/:id',productController.removeProductById)
export default router;