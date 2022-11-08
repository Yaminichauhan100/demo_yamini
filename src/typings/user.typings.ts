import { Document } from "mongoose";

export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
}
