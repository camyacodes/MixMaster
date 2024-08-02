import mongoose from "mongoose";
import { dbConnect } from "../utils/config";

beforeAll(async () => {
  // put your client connection code here, example with mongoose:
  dbConnect();
});

afterAll(async () => {
  // put your client disconnection code here, example with mongoose:
  await mongoose.disconnect();
});
