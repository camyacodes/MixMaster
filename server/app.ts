import express from "express";
import cors from "cors";
require("express-async-errors");
// import { dbConnect } from "./utils/config";
import userRouter from "./routes/user";
import setlistRouter from "./routes/setlist";
import { dbConnect } from "./utils/config";
import middleware from "./utils/middleware";
const app = express();

app.use(cors());
app.use(express.json());

dbConnect();

app.get("/", (_req, res) => {
  res.send("Heloooooooo");
});

app.use("/api/users", userRouter);
app.use("/api/setlists", setlistRouter);

app.use(middleware.errorHandler);

export default app;
