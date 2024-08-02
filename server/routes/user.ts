import express from "express";
// import userService from '..ser
import User from "../models/user";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, username, email, password } = req.body;
  const newUser = new User({
    name,
    username,
    email,
    password,
  });

  await newUser.save();
  res.status(201).json(newUser);
});

export default router;
