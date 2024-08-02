import express from "express";
// import userService from '..ser
import User from "../models/user";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, username, email, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name,
    username,
    email,
    passwordHash,
  });

  const createdUser = await user.save();
  res.status(201).json(createdUser);
});

export default router;
