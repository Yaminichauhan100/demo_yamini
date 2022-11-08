import express from "express";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: "/home/sky/Documents/backend/.env" });
import router from "./routes/index"
// import {redis} from "./src/config/redis.connection"
// redis.connect()

import createConnection from "./services/database/mongo.database";
createConnection;

import logger from "morgan";
const app = express();
app.use(express.json());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "./src/public")));

app.use("/", router);
app.listen(process.env.PORT, () => {
  console.log("listening at the port 8000");
});
