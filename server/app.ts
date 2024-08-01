import express from "express";
// import { dbConnect } from "./utils/config";
const app = express();
app.use(express.json());

// dbConnect();

app.get("/", (_req, res) => {
  res.send("Heloooooooo");
});

export default app;
