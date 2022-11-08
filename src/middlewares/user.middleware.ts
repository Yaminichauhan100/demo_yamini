import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export default async function 
verifytoken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const secret = <string>process.env.SECRET_KEY;
    const token: string | undefined = req.headers.authorization;
    if (!token) {
      res.status(400).json("Token required for login");
    } else {
      let data: any = jwt.verify(token, secret);
      console.log(data);
      req.body.token = data._id;
      console.log(req.body.token);
      next();
    }
  } catch (err) {
    res.status(400).json("Invalid token login again");
  }
}
