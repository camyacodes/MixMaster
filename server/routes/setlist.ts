import express from "express";
import SetList from "../models/setlist";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";
import { Response } from "express-serve-static-core";

const router = express.Router();

const getTokenFrom = (
  request: { get: (arg0: string) => any },
  response: Response<any, Record<string, any>, number>
) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  } else {
    return response.status(401).json({ error: "User not logged in" });
  }
};
// create set
router.post("/", async (req, res) => {
  const body = req.body;

  const token: string = getTokenFrom(req, res) || "";
  // console.log(req.headers);

  const secret = process.env.SECRET;

  const decodedToken = jwt.verify(token, secret as string) as JwtPayload;
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  // console.log("created set user", user);
  if (!user) {
    return res.status(401).json({ error: "user not found in system" });
  }

  // console.log("setlist create user", user._id);

  const Setlist = new SetList({
    name: body.name,
    songs: body.songs,
    user: user._id,
  });

  const newSetlist = await Setlist.save();
  // console.log("New set created", newSetlist);
  user.setlists = user.setlists.concat(newSetlist._id);
  await user.save();
  // console.log("updated user", updatedUser);
  return res.status(201).json(Setlist);
});

router.put("/:id", async (req, res) => {
  const songs = req.body;

  console.log("sent songs", songs);

  const setlist = await SetList.findById(req.params.id);
  // console.log("found setlist", setlist);

  if (!setlist) {
    return res.status(404).json({ error: "setlist not found" });
  }
  // Add each song to the songs array using Mongoose's push method
  songs.forEach((song: (typeof setlist.songs)[0]) => setlist.songs.push(song));

  console.log("new setlist", JSON.stringify(setlist, null, 2));

  const results = await setlist.save();

  return res.status(200).json(results);
});

export default router;
