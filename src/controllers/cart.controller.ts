import cartModel from "../models/cart.model";
import { Request, Response, NextFunction } from "express";
class cartController {
  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      let newCart;
      const cartExist = await cartModel.findOne({ userId: req.body.userId });
      if (cartExist) {
        const updatedCart = await cartModel.findOneAndUpdate(
          { "cartItems.productId": req.body.cartItems.productId },
          { $inc: { "cartItems.$.quantity": req.body.cartItems.quantity } },
          { new: true }
        );
        //res.status(400).json({ data:updatedCart});

        if (!updatedCart) {
          newCart = await cartModel.findOneAndUpdate(
            { userId: req.body.userId },
            { $push: { cartItems: req.body.cartItems } },
            { new: true }
          );
          //console.log("NEW PRODUCT ADDED", newCart);
          // console.log(updatedCart);
          // res.status(400).json({ message: "new product added" , data:newCart});
        }
        console.log("NEW PRODUCT ADDED", newCart);
        console.log(updatedCart);
        res.status(400).json({ message: "new product added", data: newCart });
      } else {
        const cart = await cartModel.create({
          userId: req.body.userId,
          cartItems: req.body.cartItems,
        });
        res
          .status(200)
          .json({ message: "successfully added to cart", data: cart });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getItems(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cartModel.find();
      res.status(200).json({ data: data });
    } catch (err) {
      throw err;
    }
  }

  async removeCartById(req: Request, res: Response, next: NextFunction) {
    try {
      const _id = req.params.id;
      const data = await cartModel.deleteOne({ _id });
      res.status(200).json({ data: data });
    } catch (err) {
      throw err;
    }
  }

  async removeProductFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cartModel.findOneAndUpdate(
        { userId: req.body.userId}, 
        { $pull: { cartItems: { _id: req.body._id} } },
      
    );
    res.status(200).json({message:"removed successfully",data:data})
    } catch (err) {
      throw err;
    }
  }

  async updateProductQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const cartExist = await cartModel.findOne({ userId: req.body.userId });
      if (cartExist) {
        const updatedCart = await cartModel.findOneAndUpdate(
          { "cartItems.productId": req.body.cartItems.productId },
          { $inc: { "cartItems.$.quantity": req.body.cartItems.quantity } },
          { new: true }
        );
        res
          .status(200)
          .json({ message: "update Successfully", data: updatedCart });
      }
    } catch (err) {
      throw err;
    }
  }
}
export default new cartController();
