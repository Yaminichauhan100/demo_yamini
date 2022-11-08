import mongoose, { model } from "mongoose";
import { ProductInterface } from "../typings/product.typings";

const productSchema = new mongoose.Schema<ProductInterface>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    size: {
      type: String,
    
    },
    categories: {
      type: String,
    },

    color: {
      type: String,
    },
    price: {
      type: Number,
    },
    image: {
        type:String,
    },
  },
  { timestamps: true }
);

const productModel = model<ProductInterface>("productDetail", productSchema);
export default productModel;
