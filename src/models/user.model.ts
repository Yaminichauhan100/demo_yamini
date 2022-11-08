import {Schema, model } from "mongoose";
import { UserInterface } from "../typings/user.typings";

const userSchema = new Schema<UserInterface>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },

    phoneNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const userModel = model<UserInterface>("userDetail", userSchema);
export default userModel;
