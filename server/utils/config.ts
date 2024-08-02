import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export const PORT = process.env.PORT || 3001;
let isConnected = false;

export const dbConnect = async () => {
  if (isConnected) {
    return;
  }
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("Successfully connected to MongoDB!");
    isConnected = true;
  } catch (error) {
    console.error(error);
  }
};
