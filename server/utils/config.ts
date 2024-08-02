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

  let dev_uri = process.env.MONGODB_URI;
  let test_uri = process.env.MONGO_URI;

  try {
    if (process.env.NODE_ENV === "test") {
      await mongoose.connect(`${test_uri}`);
    } else if (process.env.NODE_ENV === "development") {
      await mongoose.connect(`${dev_uri}`);
      console.log("Successfully connected to production MongoDB!");
    }
    isConnected = true;
  } catch (error) {
    console.error(error);
  }
};
