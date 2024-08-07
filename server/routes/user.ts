import express from "express";
// import userService from '..ser
import User from "../models/user";
import bcrypt from "bcrypt";
// import SetList from "../models/setlist";

const router = express.Router();

// get user by id with setlists
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate({
    path: "setlists",
    populate: { path: "songs" },
  });

  // console.log("User with populated setlists:", JSON.stringify(user, null, 2));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
});

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
