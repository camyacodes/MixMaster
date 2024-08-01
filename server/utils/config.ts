import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export const PORT = process.env.PORT;

// let con: Mongoose;
let mongoServer: MongoMemoryServer;

export const dbConnect = async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});
  console.log(mongoServer.getUri());
};

// export default { PORT, dbConnect };
