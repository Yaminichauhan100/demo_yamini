import mongoose from "mongoose";

const dbConnection = <string>process.env.MONGO_URL;

const createConnection = con().catch((err) => console.log("database error"));

async function con(): Promise<void> {
  try {
    await mongoose.connect(dbConnection, {
      // useCreateIndex: true,
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
      // useFindAndModify: false,
    });
    mongoose.set("debug", true);
    console.log("Database Connect");
  } catch (err) {
    throw err;
  }
}

export default createConnection;
