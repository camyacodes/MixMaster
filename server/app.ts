import express from "express";
import cors from "cors";
require("express-async-errors");
// import { dbConnect } from "./utils/config";
import userRouter from "./routes/user";
import { dbConnect } from "./utils/config";
const app = express();

app.use(cors());
app.use(express.json());

dbConnect();

app.get("/", (_req, res) => {
  res.send("Heloooooooo");
});

app.use("/api/user", userRouter);

export default app;
