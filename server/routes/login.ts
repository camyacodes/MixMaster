import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const loginRouter = require("express").Router();
import User from "../models/user";

loginRouter.post("/", async (req: Request, res: Response) => {
  // user submits username and password through login form
  const { username, password } = req.body;

  //   user is found in the db by username field
  const user = await User.findOne({ username });

  // console.log(user);

  //check if password is correct using bcrypt
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  // both username and password need to be correct
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  //  create user object that will be encoded in token
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // console.log(user._id);

  //   create token with expiration date in 1 hr
  const token = jwt.sign(userForToken, `${process.env.SECRET}`, {
    expiresIn: 60 * 60,
  });
  // send token back with user info
  return res
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user._id });
});

export default loginRouter;
