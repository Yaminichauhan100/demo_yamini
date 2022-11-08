import { Request, Response, NextFunction } from "express";
import productModel from "../models/product.model";

class productController {

  //1.createProduct
  async createProduct(req: Request, res: Response, next: NextFunction) { 
    try {
      const { title, description, size, categories, price, color, image } =
        req.body;
      console.log(req.body, req.headers);
      const product = await productModel.create({
        title: title,
        description: description,
        size: size,
        categories: categories,
        price: price,
        color: color,
        image: image,
      });

      res
        .status(200)
        .json({ message: "product added successfuly", data: product });
    } catch (err) {
      throw err;
    }
  }

  //2.GetProducts
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productModel.find();
      res.status(200).json({ data: data });
    } catch (err) {
      throw err;
    }
  }

  //3.GetProductsById
  async getProductsById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = await productModel.findById(id);
      res.status(200).json({ data: data });
    } catch (err) {
      throw err;
    }
  }

  //RemoveProductById
  async removeProductById(req: Request, res: Response, next: NextFunction){
    try{
      const  _id = req.params.id;
      const data = await productModel.deleteOne({_id})
      res.status(200).json({ data: data });
    }
    catch(err){
      throw err;
    }
  }
}
export default new productController();
