import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import md5 from "md5";
import userModel from "../models/user.model";

class UserController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password, phoneNumber } = req.body;
      const existUser = await userModel.findOne({ email: email });
      if (existUser) {
        res.status(404).json({ message: "user already exist" });
      } else {
        const user = new userModel({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: md5(password),
          phoneNumber: phoneNumber,
        });

        await user.save();
        res.status(200).json({ message: "Signup-successfuly", data: user });
      }
    } catch (err) {
      throw err;
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const existUser = await userModel.findOne({ email: email });
      if (!existUser) {
        res.status(400).json({ message: "User does not exist" });
      }
      if (existUser) {
        const verifypassword = md5(password) === existUser.password;
        if (!verifypassword) {
          res.status(400).json({ message: "password does not match" });
        } else {
          const token = jwt.sign(
            { _id: existUser._id },
            <string>process.env.SECRET_KEY,
            {
              expiresIn: "2d",
            }
          );
          res.status(200).json({ message: "login succesfully", token });
        }
      }
    } catch (err) {
      throw err;
    }
  }
}

export default new UserController();
