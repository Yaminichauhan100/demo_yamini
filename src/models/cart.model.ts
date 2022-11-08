import mongoose, { model } from "mongoose";
import { CartInterface } from "typings/cart.typings";

const cartSchema = new mongoose.Schema<CartInterface>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const cartModel = model<CartInterface>("cartDetails", cartSchema);
export default cartModel;
